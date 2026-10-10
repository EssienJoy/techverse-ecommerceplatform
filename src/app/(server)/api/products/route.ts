import { NextResponse } from "next/server";
import { products } from "@/features/products";

export async function GET() {
	return NextResponse.json(products);
}
