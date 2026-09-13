import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { ProductCard } from "./ProductCard";

type CatalogPageProps = { offersOnly?: boolean; initialQuery?: string; initialCategory?: string };

export function CatalogPage({ offersOnly = false, initialQuery = "", initialCategory = "" }: CatalogPageProps) {
  const { products, categories } = useStore();
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [stock, setStock] = useState("");
  const [sort, setSort] = useState("relevant");

  useEffect(() => setQ(initialQuery), [initialQuery]);
  useEffect(() => setCategory(initialCategory), [initialCategory]);

  const shown = useMemo(() => products
    .filter((product) => (
      (!offersOnly || product.promotion)
      && (!q || `${product.name} ${product.brand} ${product.sku}`.toLowerCase().includes(q.toLowerCase()))
      && (!category || product.categories?.slug === category)
      && (!stock || (stock === "available" ? product.stock_quantity > 0 : product.stock_quantity === 0))
    ))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "low") return (a.promotional_price ?? a.price ?? 999999) - (b.promotional_price ?? b.price ?? 999999);
      if (sort === "high") return (b.promotional_price ?? b.price ?? -1) - (a.promotional_price ?? a.price ?? -1);
      return Number(b.featured) - Number(a.featured);
    }), [products, q, category, stock, sort, offersOnly]);

  const clearFilters = () => { setQ(""); setCategory(""); setStock(""); setSort("relevant"); };

  return <section className="page-section"><div className="container-site">
    <div className="page-heading"><p className="eyebrow">{offersOnly ? "Condições especiais" : "Catálogo completo"}</p><h1>{offersOnly ? "OFERTAS DO DEPÓSITO" : "PRODUTOS PARA SUA OBRA"}</h1><p>{offersOnly ? "Produtos promocionais cadastrados pela loja." : "Encontre materiais para construir, reformar e cuidar da casa."}</p></div>
    <div className="mb-8 grid gap-3 rounded-lg border border-border bg-card p-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <label className="relative"><Search className="absolute left-3 top-3 size-5 text-muted-foreground"/><input className="input pl-10" aria-label="Pesquisar produtos" placeholder="Pesquisar produtos..." value={q} onChange={(event) => setQ(event.target.value)} /></label>
      <select className="input" aria-label="Filtrar por categoria" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Todas as categorias</option>{categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select>
      <select className="input" aria-label="Filtrar por disponibilidade" value={stock} onChange={(event) => setStock(event.target.value)}><option value="">Disponibilidade</option><option value="available">Disponível</option><option value="empty">Esgotado</option></select>
      <select className="input" aria-label="Ordenar produtos" value={sort} onChange={(event) => setSort(event.target.value)}><option value="relevant">Mais relevantes</option><option value="low">Menor preço</option><option value="high">Maior preço</option><option value="name">Nome A-Z</option></select>
    </div>
    <p className="mb-5 flex items-center gap-2 text-sm font-bold text-muted-foreground"><SlidersHorizontal className="size-4"/>{shown.length} produtos encontrados</p>
    {shown.length ? <div className="product-grid">{shown.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><h2>Nenhum produto encontrado</h2><p>Tente remover alguns filtros.</p><Button onClick={clearFilters}>Limpar filtros</Button></div>}
  </div></section>;
}
