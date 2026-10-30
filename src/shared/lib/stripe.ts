import "server-only";

import Stripe from "stripe";
import { requireEnv } from "./utils";

export const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
