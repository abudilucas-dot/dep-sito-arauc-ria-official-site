import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { effectivePrice, formatPrice, whatsappUrl } from "@/lib/catalog";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/minha-lista")({ head: () => ({ meta: [{ title: "Minha Lista | Depósito Araucária" }, { name: "description", content: "Gerencie sua lista de materiais e solicite um orçamento rápido pelo WhatsApp." }, { property: "og:title", content: "Minha Lista | Depósito Araucária" }, { property: "og:description", content: "Organize os materiais para sua obra e peça um orçamento." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: List });

function List() {
  const { list, updateQuantity, removeFromList, clearList, company } = useStore();
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const hasUnpricedItems = list.some((item) => effectivePrice(item.product) == null);
  const total = list.reduce((value, item) => value + (effectivePrice(item.product) ?? 0) * item.quantity, 0);
  const totalLabel = hasUnpricedItems ? "Consulte valores" : formatPrice(total);
  const message = `Olá, Depósito Araucária!\n\nVim pelo site e gostaria de solicitar um orçamento.\n\nMinha lista:\n${list.map((item) => `• ${item.quantity}x ${item.product.name}${effectivePrice(item.product) == null ? " — consultar preço" : ` — ${formatPrice(effectivePrice(item.product))}`}`).join("\n")}\n\nValor estimado pelo site: ${totalLabel}.\nGostaria de confirmar valores, disponibilidade e condições.`;

  const requestQuote = async () => {
    if (!customer.name.trim() || !customer.phone.trim()) {
      setStatus("Informe seu nome e telefone para enviar o orçamento.");
      return;
    }

    setBusy(true);
    setStatus("");
    const { error } = await (supabase as any).rpc("create_quote_with_items", {
      _customer_name: customer.name.trim(),
      _customer_phone: customer.phone.trim(),
      _customer_email: customer.email.trim() || null,
      _items: list.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
    });

    if (error) {
      setStatus("Não foi possível registrar o pedido agora. Tente novamente.");
      setBusy(false);
      return;
    }

    clearList();
    window.location.assign(whatsappUrl(company?.whatsapp, message));
  };

  return <PageShell><section className="page-section"><div className="container-site"><div className="page-heading"><p className="eyebrow">Seu orçamento começa aqui</p><h1>MINHA LISTA DE MATERIAIS</h1></div>{!list.length ? <div className="empty-state"><h2>Sua lista está vazia</h2><p>Adicione os materiais que precisa e envie tudo de uma vez.</p><Button asChild variant="brand"><Link to="/produtos">Ver produtos</Link></Button></div> : <div className="grid gap-8 lg:grid-cols-[1fr_360px]"><div className="space-y-3">{list.map((item) => <article className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center" key={item.product.id}><div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase text-muted-foreground">{item.product.brand}</p><h2 className="font-black uppercase">{item.product.name}</h2><p>{formatPrice(effectivePrice(item.product))}</p></div><div className="flex items-center justify-between gap-3"><div className="flex items-center rounded-md border"><Button variant="ghost" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}><Minus/></Button><b className="w-9 text-center">{item.quantity}</b><Button variant="ghost" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}><Plus/></Button></div><b className="w-28 text-right">{effectivePrice(item.product) == null ? "Consulte" : formatPrice((effectivePrice(item.product) ?? 0) * item.quantity)}</b><Button variant="ghost" size="icon" onClick={() => removeFromList(item.product.id)} aria-label="Remover"><Trash2/></Button></div></article>)}<Button variant="outline" onClick={clearList}>Limpar lista</Button></div><aside className="h-fit rounded-lg bg-foreground p-6 text-background"><h2 className="text-xl font-black uppercase">Resumo</h2><div className="my-6 flex justify-between border-y border-background/20 py-5"><span>Total estimado</span><strong className="text-2xl text-primary">{totalLabel}</strong></div><div className="space-y-3"><input className="input" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="Seu nome"/><input className="input" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} placeholder="Seu telefone"/><input className="input" type="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} placeholder="Seu e-mail (opcional)"/></div>{status && <p className="mt-3 text-sm text-primary">{status}</p>}<Button type="button" onClick={requestQuote} disabled={busy} variant="brand" size="lg" className="mt-4 w-full">{busy ? "Enviando..." : "Solicitar orçamento"}</Button><p className="mt-4 text-xs text-background/60">O valor é estimado e será confirmado pela equipe.</p></aside></div>}</div></section></PageShell>;
}
