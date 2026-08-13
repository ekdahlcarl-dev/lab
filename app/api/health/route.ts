import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "lab-webshop",
    timestamp: new Date().toISOString(),
  });
}
