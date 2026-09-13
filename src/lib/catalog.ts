import type { Database } from "@/integrations/supabase/types";

export type Product = Database["public"]["Tables"]["products"]["Row"] & { categories?: { name: string; slug: string } | null };
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Company = Database["public"]["Tables"]["company_settings"]["Row"];
export type ListItem = { product: Product; quantity: number };

export const formatPrice = (value: number | null) => value == null ? "Consulte" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
export const effectivePrice = (product: Product) => product.promotional_price ?? product.price;
export const stockLabel = (product: Product) => product.stock_quantity === 0 ? "ESGOTADO" : product.stock_quantity <= product.minimum_stock ? "ÚLTIMAS UNIDADES" : "EM ESTOQUE";
export const whatsappUrl = (phone: string | null | undefined, message: string) => `https://wa.me/${(phone || "554432640413").replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
