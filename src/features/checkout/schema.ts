import { z } from "zod";

export const shippingAddressSchema = z.object({
	fullName: z.string().min(1),
	email: z.email(),
	address: z.string().min(1),
	city: z.string().min(1),
	phone: z.string().min(1),
	postalCode: z.string().min(1),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

/** Result of the "continue to payment" server action. */
export type CheckoutActionState = {
	status: "idle" | "error";
	message: string;
};
