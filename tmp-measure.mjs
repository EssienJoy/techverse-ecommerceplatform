const targets = await (await fetch("http://localhost:9222/json")).json();
const page = targets.find(
	(target) => target.type === "page" && target.url.includes("localhost:3000"),
);

if (!page) {
	console.error("No page target");
	process.exit(1);
}

const ws = new WebSocket(page.webSocketDebuggerUrl);
let nextId = 0;
const pending = new Map();

ws.onmessage = (event) => {
	const message = JSON.parse(event.data);
	if (message.id && pending.has(message.id)) {
		pending.get(message.id)(message);
		pending.delete(message.id);
	}
};

function send(method, params = {}) {
	return new Promise((resolve) => {
		const id = ++nextId;
		pending.set(id, resolve);
		ws.send(JSON.stringify({ id, method, params }));
	});
}

const measurement = `(() => {
	const cards = [...document.querySelectorAll('a[href^="/product/"]')].filter((a) => a.className && a.className.includes('group/card'));
	return cards.map((a) => {
		const rect = a.getBoundingClientRect();
		const cta = a.lastElementChild;
		const ctaRect = cta ? cta.getBoundingClientRect() : null;
		return {
			section: a.closest('section')?.querySelector('h2')?.textContent ?? '',
			name: a.querySelector('h3')?.textContent ?? '',
			top: Math.round(rect.top),
			height: Math.round(rect.height),
			ctaBottom: ctaRect ? Math.round(ctaRect.bottom) : null,
		};
	});
})()`;

async function measure(url) {
	await send("Page.navigate", { url });
	await new Promise((resolve) => setTimeout(resolve, 9000));
	const response = await send("Runtime.evaluate", {
		expression: measurement,
		returnByValue: true,
	});
	const rows = new Map();
	for (const card of response.result.result.value) {
		const key = `${card.section}:${card.top}`;
		if (!rows.has(key)) rows.set(key, []);
		rows.get(key).push(card);
	}
	for (const [key, cards] of rows) {
		const bottoms = [...new Set(cards.map((card) => card.ctaBottom))];
		const heights = [...new Set(cards.map((card) => card.height))];
		console.log(
			`${key} | heights=${heights.join("/")} | ctaBottoms=${bottoms.join("/")} | ${cards.map((card) => card.name).join(", ")}`,
		);
	}
}

await new Promise((resolve) => (ws.onopen = resolve));
await send("Runtime.enable");
await send("Page.enable");
await measure("http://localhost:3000/");
console.log("--- SHOP ---");
await measure("http://localhost:3000/shop");
ws.close();
