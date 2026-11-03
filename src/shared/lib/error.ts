/**
 * The single result envelope for server mutations.
 *
 * Every mutation answers with a discriminated union: `success` carries the data
 * (and an optional human message), `error` carries a message the UI can show.
 * Forms start from `idleAction`. There is no `failure` status and no HTTP
 * status code — the transport is a server action, and the UI only needs
 * "worked" or "did not work, here is why".
 */
export type FieldErrors = Record<string, string[]>;

export type ActionError = {
	status: "error";
	message: string;
	/** Per-field messages from schema validation. */
	fieldErrors?: FieldErrors;
	/**
	 * Why access was refused, for callers that redirect instead of rendering.
	 * This is a cause, not an HTTP status code.
	 */
	reason?: "unauthenticated" | "forbidden";
};

export type ActionSuccess<T = undefined> = {
	status: "success";
	message?: string;
	data: T;
};

export type ActionOutcome<T = undefined> = ActionSuccess<T> | ActionError;

export type ActionResult<T = undefined> = { status: "idle" } | ActionOutcome<T>;

/** The untouched state a form starts in. */
export const idleAction = { status: "idle" } as const;

export function actionError(
	message: string,
	options: {
		fieldErrors?: FieldErrors;
		reason?: ActionError["reason"];
	} = {},
): ActionError {
	const { fieldErrors, reason } = options;

	return {
		status: "error",
		message,
		...(fieldErrors ? { fieldErrors } : {}),
		...(reason ? { reason } : {}),
	};
}

export function actionSuccess<T = undefined>(
	data?: T,
	message?: string,
): ActionSuccess<T> {
	return {
		status: "success",
		data: data as T,
		...(message ? { message } : {}),
	};
}

/** A schema validation failure: messages live on the fields, not in a banner. */
export function validationError(fieldErrors: FieldErrors): ActionError {
	return actionError("Check the highlighted fields.", { fieldErrors });
}

/**
 * Turns a thrown database error into a safe, human message.
 *
 * Prisma wraps Postgres failures in `PrismaClientKnownRequestError` (codes such
 * as `P2002`) and raises `PrismaClientValidationError` for malformed input.
 * Raw `pg` errors that reach the action keep their SQLSTATE (`23505`, `23503`,
 * `22P02`, ...). Both shapes are detected structurally, so this module stays
 * free of server-only imports and can be shared with client bundles.
 */
export function databaseError(
	error: unknown,
	fallback = "Something went wrong. Try again.",
): ActionError {
	console.error("A database mutation failed.", error);

	const handled = describeDatabaseError(error);
	return actionError(handled ?? fallback);
}

function describeDatabaseError(error: unknown): string | null {
	const code = readCode(error);
	const name = readName(error);

	if (name === "PrismaClientValidationError") {
		return "Some of the details are not valid. Check them and try again.";
	}

	switch (code) {
		// Unique constraint (Prisma P2002, Postgres 23505).
		case "P2002":
		case "23505":
			return "That value is already in use. Try a different one.";
		// Foreign key constraint (Prisma P2003, Postgres 23503).
		case "P2003":
		case "23503":
			return "This item is still linked to other data and cannot be changed.";
		// Required relation missing (Prisma P2025, Postgres 23503 on delete).
		case "P2025":
		case "P2011":
		case "P2012":
		case "23502":
			return "A required detail is missing. Check the form and try again.";
		// Value too long for its column (Prisma P2000, Postgres 22001).
		case "P2000":
		case "22001":
			return "One of the values is too long. Shorten it and try again.";
		// Malformed or out-of-range value (Prisma P2005/P2006, Postgres 22P02/22003).
		case "P2005":
		case "P2006":
		case "P2007":
		case "P2009":
		case "22P02":
		case "22003":
			return "Some of the details are not valid. Check them and try again.";
		// Check constraint (Postgres 23514).
		case "23514":
			return "One of the values is not allowed. Check the form and try again.";
		// Serialization failure and deadlock: retryable.
		case "40001":
		case "40P01":
			return "The server was busy. Try again.";
		default:
			return null;
	}
}

function readCode(error: unknown): string | null {
	if (typeof error !== "object" || error === null) return null;

	const code = (error as { code?: unknown }).code;
	return typeof code === "string" ? code : null;
}

function readName(error: unknown): string | null {
	if (typeof error !== "object" || error === null) return null;

	const name = (error as { name?: unknown }).name;
	return typeof name === "string" ? name : null;
}
