export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  phone: string;
  postalCode?: string;
  country?: string;
}

export interface CheckoutFormValues {
  email: string;
  address: ShippingAddress;
}

export type PaymentMethod = "card" | "paypal";
