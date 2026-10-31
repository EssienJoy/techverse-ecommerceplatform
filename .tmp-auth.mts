import { readFileSync, writeFileSync } from "node:fs";
import { SignJWT } from "jose";

for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
  if (m) process.env[m[1]] ??= m[2].replace(/^"|"$/g, "");
}

const { prisma } = await import("./src/prisma-client/prisma.ts");
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const tokenFor = (id: string) =>
  new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(id)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

const customer = await prisma.user.findFirst({
  where: { role: "user", isActive: true },
  select: { id: true, email: true },
});
const admin = await prisma.user.findFirst({
  where: { role: { in: ["admin", "super_admin"] }, isActive: true },
  select: { id: true, email: true },
});
console.log("customer:", customer?.email, "admin:", admin?.email);

writeFileSync(
  "C:/Windows/Temp/opencode/auth-check.json",
  JSON.stringify({
    customerToken: customer ? await tokenFor(customer.id) : null,
    adminToken: admin ? await tokenFor(admin.id) : null,
  }),
);
await prisma.$disconnect();
