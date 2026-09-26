import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, ShieldCheck, Handshake, PackageCheck, Zap, MapPin, Clock, Instagram } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/site/PageShell";
import { ProductCard } from "@/components/site/ProductCard";
import { useStore } from "@/lib/store";
import { getBusinessHours } from "@/lib/catalog";
import hero from "@/assets/araucaria-hero.jpg";
import facade from "@/assets/store-facade.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ 
    meta: [
      { title: "Depósito Araucária | Materiais para Obra e Reforma" }, 
      { name: "description", content: "Materiais para construção, reforma e manutenção em Sarandi-PR. Monte sua lista e peça seu orçamento." }, 
      { property: "og:title", content: "Depósito Araucária | Materiais para Obra e Reforma" }, 
      { property: "og:description", content: "Tudo para sua obra em um só lugar, com atendimento rápido pelo WhatsApp." }, 
      { property: "og:type", content: "website" }, 
      { name: "twitter:card", content: "summary_large_image" }
    ] 
  }),
  component: Home,
});

function Home() {
  const { products, categories, banners, company } = useStore();
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const hours = getBusinessHours(company?.business_hours); const activeBanners = banners.filter((banner) => (!banner.starts_at || new Date(banner.starts_at) <= new Date()) && (!banner.ends_at || new Date(banner.ends_at) >= new Date()));

  const search = (event: React.FormEvent) => { 
    event.preventDefault(); 
    void navigate({ to: "/produtos", search: { q: q.trim(), categoria: "" } }); 
  };

  return (
    <PageShell>
      <section className="hero">
        <img src={hero} alt="Profissional em uma obra" className="hero-image" width={1600} height={900}/>
        <div className="hero-shade"/>
        <div className="hero-stripe"/>
        <div className="container-site relative z-10 flex min-h-[660px] items-center py-16">
          <div className="max-w-3xl text-header-foreground">
            <p className="eyebrow">{company?.company_name || "Depósito Araucária"} · {company?.city_state || "Sarandi-PR"}</p>
            <h1>TUDO PARA SUA<br/><span>OBRA E REFORMA.</span></h1>
            <p className="mt-6 max-w-xl text-lg text-header-muted">
              Materiais para construção, reforma e manutenção em um só lugar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="brand" size="lg"><Link to="/produtos">Ver produtos <ArrowRight/></Link></Button>
              <Button asChild variant="heroOutline" size="lg"><Link to="/minha-lista">Pedir orçamento</Link></Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm font-bold">
              <Zap className="size-4 text-primary"/> Atendimento rápido pelo WhatsApp
            </p>
          </div>
        </div>
      </section>

      {activeBanners.length > 0 && <section className="bg-muted py-4"><div className="container-site grid gap-4 md:grid-cols-2">{activeBanners.map((banner) => <article key={banner.id} className="overflow-hidden rounded-lg bg-foreground text-background">{banner.image_url && <img src={banner.image_url} alt="" className="h-36 w-full object-cover" loading="lazy" />}<div className="p-5"><h2 className="text-xl font-black uppercase">{banner.title}</h2>{banner.subtitle && <p className="mt-1 text-sm text-background/75">{banner.subtitle}</p>}{banner.link_url && <a className="mt-4 inline-block font-bold text-primary" href={banner.link_url}>{banner.button_label || "Ver oferta"}</a>}</div></article>)}</div></section>}
      <section className="search-band">
        <div className="container-site grid items-center gap-5 py-7 md:grid-cols-[auto_1fr]">
          <div>
            <strong className="block text-xl uppercase">O que você precisa</strong>
            <span className="text-sm text-muted-foreground">para sua obra?</span>
          </div>
          <form onSubmit={search} className="flex gap-2">
            <label className="relative flex-1">
              <Search className="absolute left-4 top-3.5 size-5 text-muted-foreground"/>
              <input 
                className="input h-12 pl-12" 
                placeholder="Pesquisar cimento, ferramentas, hidráulica..." 
                value={q} 
                onChange={(event) => setQ(event.target.value)}
              />
            </label>
            <Button type="submit" variant="brand" size="lg">Buscar</Button>
          </form>
        </div>
      </section>

      <section className="page-section">
        <div className="container-site">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Variedade para cada etapa</p>
              <h2>VOCÊ ENCONTRA <span>AQUI!</span></h2>
            </div>
            <Button asChild variant="outline"><Link to="/categorias">Todas as categorias <ArrowRight/></Link></Button>
          </div>
          <div className="category-grid mt-9">
            {categories.map((category) => { 
              const Icon = (Icons as unknown as Record<string, LucideIcon>)[category.icon || ""] || Icons.Package; 
              return (
                <Link key={category.id} to="/produtos" search={{ q: "", categoria: category.slug }} className="category-card">
                  <span><Icon/></span>
                  <h3>{category.name}</h3>
                  <p>{products.filter((product) => product.category_id === category.id).length} produtos</p>
                </Link>
              ); 
            })}
          </div>
        </div>
      </section>

      <section className="page-section bg-muted">
        <div className="container-site">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Seleção da loja</p>
              <h2>DESTAQUES DO <span>DEPÓSITO</span></h2>
            </div>
            <Button asChild variant="dark"><Link to="/produtos">Ver catálogo</Link></Button>
          </div>
          <div className="product-grid mt-9">
            {products.filter((product) => product.featured).slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product}/>
            ))}
          </div>
        </div>
      </section>

      <section className="benefit-band">
        <div className="container-site grid gap-7 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {([
            { Icon: PackageCheck, t: "Qualidade e variedade" }, 
            { Icon: Handshake, t: "Atendimento de confiança" }, 
            { Icon: ShieldCheck, t: "Tudo em um só lugar" }, 
            { Icon: Zap, t: "Atendimento rápido" }
          ]).map(({ Icon, t }) => (
            <div className="flex items-center gap-4" key={t}>
              <span className="benefit-icon"><Icon/></span>
              <strong className="text-sm uppercase">{t}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div className="relative">
            <img 
              src={facade} 
              alt={`Fachada do ${company?.company_name || "Depósito Araucária"}`} 
              className="aspect-[4/3] size-full rounded-lg object-cover" 
              width={1200} 
              height={900}
            />
            <span className="absolute -bottom-4 right-5 bg-primary px-5 py-4 text-sm font-black uppercase text-primary-foreground">
              {company?.city_state || "Sarandi · Paraná"}
            </span>
          </div>
          <div>
            <p className="eyebrow">{company?.company_name || "Depósito Araucária"}</p>
            <h2 className="display-title">MAIS QUE UMA LOJA.<br/><span>UM PARCEIRO PARA SUA OBRA.</span></h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Da fundação ao acabamento, conte com uma equipe pronta para ajudar você a encontrar a solução certa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="brand" size="lg"><Link to="/sobre">Conheça nossa loja</Link></Button>
              <Button asChild variant="outline" size="lg">
                <a href={company?.google_maps_url || "https://maps.google.com"} target="_blank" rel="noreferrer">
                  <MapPin/> Como chegar
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="location-band">
        <div className="container-site grid gap-7 py-14 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="eyebrow">Estamos de portas abertas para você!</p>
            <h2 className="text-3xl font-black uppercase">{company?.address_line}</h2>
            <p className="mt-2 text-location-muted">{company?.neighborhood} · {company?.city_state}</p>
            <Button asChild variant="brand" className="mt-6">
              <a href={company?.google_maps_url || "https://maps.google.com"} target="_blank" rel="noreferrer">Como chegar</a>
            </Button>
          </div>
          <div className="rounded-lg bg-location-card p-6">
            <Clock className="size-8 text-primary"/>
            <h3 className="mt-4 text-lg font-black uppercase">Horário de atendimento</h3>
            <p className="mt-3 text-sm leading-7 text-location-muted">
              Segunda a sexta: {hours.weekdays}<br/>
              Sábado: {hours.saturday}<br/>
              Domingo: {hours.sunday.toLowerCase()}
            </p>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container-site flex flex-col items-center text-center">
          <Instagram className="size-10 text-primary"/>
          <p className="eyebrow mt-5">Acompanhe o Depósito Araucária</p>
          <h2 className="text-4xl font-black">{company?.instagram_handle}</h2>
          <Button asChild variant="dark" className="mt-6">
            <a href={company?.instagram_url || "https://instagram.com/depositoaraucaria"} target="_blank" rel="noreferrer">Ver Instagram</a>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
