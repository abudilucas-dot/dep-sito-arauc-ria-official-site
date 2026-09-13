import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/categorias")({ head: () => ({ meta: [{ title: "Categorias | Depósito Araucária" }, { name: "description", content: "Encontre materiais organizados por categoria." }, { property: "og:title", content: "Categorias | Depósito Araucária" }, { property: "og:description", content: "Tudo para sua obra, em um só lugar." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: Categories });

function Categories() {
  const { categories, products } = useStore();
  return <PageShell><section className="page-section"><div className="container-site"><div className="page-heading"><p className="eyebrow">Tudo em um só lugar</p><h1>VOCÊ ENCONTRA AQUI!</h1></div><div className="category-grid">{categories.map((category) => { const Icon = (Icons as unknown as Record<string, LucideIcon>)[category.icon || ""] || Icons.Package; return <Link key={category.id} to="/produtos" search={{ q: "", categoria: category.slug }} className="category-card"><span><Icon/></span><h2>{category.name}</h2><p>{products.filter((product) => product.category_id === category.id).length} produtos</p></Link>; })}</div></div></section></PageShell>;
}
