import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/lib/services/payment.service";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const transactionId = url.searchParams.get("transactionId") || url.searchParams.get("id");

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });
    }

    const tx = await PaymentService.getTransactionStatus(transactionId);
    if (!tx) {
      return NextResponse.json({ error: "Unable to retrieve transaction" }, { status: 404 });
    }

    const status = (tx as Record<string, unknown>).status as string | null;
    const approved = status === "approved";

    return NextResponse.json({ success: true, transactionId, status, approved, transaction: tx });
  } catch (error) {
    console.error("Verify payment status error:", error);
    return NextResponse.json({ error: "Failed to verify payment status" }, { status: 500 });
  }
}
