import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/lib/services/payment.service";
import { supabase } from "@/lib/services/supabase.service";

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

    // Lookup the generated order number for this transaction
    let orderNumber: string | null = null;
    if (approved) {
      const { data: order } = await supabase
        .from("orders")
        .select("order_number")
        .eq("transaction_id", transactionId)
        .single();
      orderNumber = order?.order_number ?? null;
    }

    return NextResponse.json({ success: true, transactionId, status, approved, orderNumber, transaction: tx });
  } catch (error) {
    console.error("Verify payment status error:", error);
    return NextResponse.json({ error: "Failed to verify payment status" }, { status: 500 });
  }
}
