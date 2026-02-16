import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/lib/services/order.service";
import { supabase } from "@/lib/services/supabase.service";
import { buildTimelineFromStatus } from "@/lib/utils/order-timeline";
import { getOrderStatusLabel } from "@/lib/utils/order-status";
import type { SuiviOrder } from "@/lib/types/suivi.types";

/**
 * GET /api/suivi/[orderNumber]
 * Fetches order tracking data by order number.
 * Returns enriched SuiviOrder or 404.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const normalized = orderNumber?.trim().toUpperCase();

    if (!normalized) {
      return NextResponse.json({ error: "Numéro de commande requis" }, { status: 400 });
    }

    const order = await OrderService.getOrderByNumber(normalized);
    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
    }

    // Order from service is raw Supabase row (snake_case)
    const row = order as unknown as Record<string, unknown>;
    const modelId = row.model_id ?? row.modelId;
    const fabricId = row.fabric_id ?? row.fabricId;
    const createdAt = (row.created_at ?? row.createdAt ?? new Date().toISOString()) as string;
    const status = (row.status ?? "confirmed") as string;

    let modelName = "—";
    let fabricName = "—";

    if (modelId != null) {
      const { data: model } = await supabase
        .from("modeles")
        .select("nom")
        .eq("id", modelId)
        .single();
      if (model?.nom) modelName = model.nom;
    }

    if (fabricId != null) {
      const { data: fabric } = await supabase
        .from("tissus")
        .select("nom")
        .eq("id", fabricId)
        .single();
      if (fabric?.nom) fabricName = fabric.nom;
    }

    const orderNumberVal = (row.order_number ?? row.orderNumber ?? normalized) as string;
    const totalAmount = Number(row.total_amount ?? row.totalAmount ?? 0);
    const estimatedDelivery = new Date(createdAt);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 14);

    const suiviOrder: SuiviOrder = {
      id: (row.id as string) ?? "",
      orderNumber: orderNumberVal,
      date: createdAt,
      status: getOrderStatusLabel(status) as SuiviOrder["status"],
      modelName,
      fabricName,
      totalAmount,
      estimatedDelivery: estimatedDelivery.toISOString().split("T")[0],
      timeline: buildTimelineFromStatus(status, createdAt),
    };

    return NextResponse.json(suiviOrder);
  } catch (error) {
    console.error("Suivi API error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la commande" },
      { status: 500 }
    );
  }
}
