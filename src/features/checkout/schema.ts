import { z } from "zod";

export const shippingAddressSchema = z.object({
	fullName: z.string().min(1),
	email: z.email(),
	address: z.string().min(1),
	city: z.string().min(1),
	phone: z.string().min(1),
	postalCode: z.string().min(1),
});
