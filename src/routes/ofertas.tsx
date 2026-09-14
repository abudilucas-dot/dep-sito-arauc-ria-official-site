import { createFileRoute } from "@tanstack/react-router"; 
import { PageShell } from "@/components/site/PageShell"; 
import { CatalogPage } from "@/components/site/CatalogPage";

export const Route = createFileRoute("/ofertas")({
  head: () => ({
    meta: [
      { title: "Ofertas | Depósito Araucária" },
      { name: "description", content: "Confira as ofertas e promoções do Depósito Araucária para sua obra em Sarandi-PR." },
      { property: "og:title", content: "Ofertas | Depósito Araucária" },
      { property: "og:description", content: "Condições especiais para sua obra e reforma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  }),
  component: () => <PageShell><CatalogPage offersOnly/></PageShell>
});
