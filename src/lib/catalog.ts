import type { Database } from "@/integrations/supabase/types";

export type Product = Database["public"]["Tables"]["products"]["Row"] & { categories?: { name: string; slug: string } | null };
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Company = Database["public"]["Tables"]["company_settings"]["Row"];
export type ListItem = { product: Product; quantity: number };

export const formatPrice = (value: number | null) => value == null ? "Consulte" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
export const effectivePrice = (product: Product) => product.promotional_price ?? product.price;
export const stockLabel = (product: Product) => product.stock_quantity === 0 ? "ESGOTADO" : product.stock_quantity <= product.minimum_stock ? "ÚLTIMAS UNIDADES" : "EM ESTOQUE";
export const whatsappUrl = (phone: string | null | undefined, message: string) => `https://wa.me/${(phone || "554432640413").replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

export type BusinessHours = { weekdays: string; saturday: string; sunday: string };
export const BUSINESS_HOURS: BusinessHours = { weekdays: "08:00 às 18:00", saturday: "08:00 às 12:00", sunday: "Fechado" };
export function getBusinessHours(value: Company["business_hours"] | null | undefined): BusinessHours {
  if (!value || typeof value !== "object" || Array.isArray(value)) return BUSINESS_HOURS;
  return {
    weekdays: typeof value.weekdays === "string" ? value.weekdays : BUSINESS_HOURS.weekdays,
    saturday: typeof value.saturday === "string" ? value.saturday : BUSINESS_HOURS.saturday,
    sunday: typeof value.sunday === "string" ? value.sunday : BUSINESS_HOURS.sunday,
  };
}
