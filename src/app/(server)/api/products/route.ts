import { NextResponse } from "next/server";
import { products } from "@/app/(customer)/(store)/product";

export async function GET() {
	return NextResponse.json(products);
}
