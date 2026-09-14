import { useState } from "react"; 
import { createFileRoute } from "@tanstack/react-router"; 
import { Instagram, MapPin, MessageCircle, Phone, Clock } from "lucide-react"; 
import { PageShell } from "@/components/site/PageShell"; 
import { Button } from "@/components/ui/button"; 
import { useStore } from "@/lib/store"; 
import { whatsappUrl, getBusinessHours } from "@/lib/catalog";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato | Depósito Araucária" },
      { name: "description", content: "Fale com o Depósito Araucária em Sarandi-PR. WhatsApp, telefone, endereço e horários." },
      { property: "og:title", content: "Contato | Depósito Araucária" },
      { property: "og:description", content: "Fale com nossa equipe e solicite seu orçamento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  }),
  component: Contact
});

function Contact() {
  const { company } = useStore();
  const hours = getBusinessHours(company?.business_hours);
  const [f, setF] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(whatsappUrl(company?.whatsapp, `Olá! Sou ${f.name}.\nAssunto: ${f.subject}\n${f.message}\nTelefone: ${f.phone}\nE-mail: ${f.email}`), "_blank");
  };

  const cards = [
    [MessageCircle, "WhatsApp", company?.whatsapp || "44 3264-0413"],
    [Phone, "Telefone", company?.phone || "44 3264-0413"],
    [Instagram, "Instagram", company?.instagram_handle || "@depositoaraucaria"],
    [MapPin, "Endereço", `${company?.address_line || "Av. Araucária"} · ${company?.city_state || "Sarandi-PR"}`],
    [Clock, "Horários", `Seg–Sex ${hours.weekdays} · Sáb ${hours.saturday} · Domingo ${hours.sunday}`]
  ] as const;

  return (
    <PageShell>
      <section className="page-section">
        <div className="container-site">
          <div className="page-heading">
            <p className="eyebrow">Atendimento de confiança</p>
            <h1>FALE COM A GENTE</h1>
          </div>
          
          <div className="contact-grid">
            {cards.map(([Icon, t, v]) => (
              <div className="contact-card" key={t}>
                <span><Icon /></span>
                <div>
                  <h2>{t}</h2>
                  <p>{v}</p>
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={submit} className="mx-auto mt-12 max-w-3xl rounded-lg border border-border bg-card p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <input required className="input" placeholder="Nome" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
              <input required className="input" placeholder="Telefone" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} />
              <input type="email" className="input" placeholder="E-mail" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
              <input required className="input" placeholder="Assunto" value={f.subject} onChange={e => setF({ ...f, subject: e.target.value })} />
            </div>
            <textarea required className="input mt-4 min-h-36" placeholder="Mensagem" value={f.message} onChange={e => setF({ ...f, message: e.target.value })} />
            <Button className="mt-4" variant="brand" size="lg">Enviar pelo WhatsApp</Button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
