import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PageShell } from "@/components/site/PageShell";
import { CatalogPage } from "@/components/site/CatalogPage";

const productSearchSchema = z.object({
  q: z.string().catch(""),
  categoria: z.string().catch(""),
});

export const Route = createFileRoute("/produtos")({
  validateSearch: productSearchSchema,
  head: () => ({
    meta: [
      { title: "Produtos | Depósito Araucária" },
      { name: "description", content: "Catálogo de materiais para construção e reforma em Sarandi-PR." },
      { property: "og:title", content: "Produtos | Depósito Araucária" },
      { property: "og:description", content: "Consulte materiais, disponibilidade e solicite orçamento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Products,
});

function Products() {
  const search = Route.useSearch();
  return <PageShell><CatalogPage initialQuery={search.q} initialCategory={search.categoria} /></PageShell>;
}
