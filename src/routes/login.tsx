import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/site/Brand";
import hero from "@/assets/araucaria-hero.jpg";

export const Route=createFileRoute("/login")({head:()=>({meta:[{title:"Acessar | Depósito Araucária"},{name:"description",content:"Acesse sua conta do Depósito Araucária."},{property:"og:title",content:"Acessar | Depósito Araucária"},{property:"og:description",content:"Entre ou crie sua conta."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Login});

type Mode="login"|"signup"|"forgot"|"google-password";

function Login(){
  const navigate=useNavigate();
  const [mode,setMode]=useState<Mode>("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [passwordConfirmation,setPasswordConfirmation]=useState("");
  const [name,setName]=useState("");
  const [show,setShow]=useState(false);
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    if(params.get("confirmed")==="1")setMessage("Conta confirmada com sucesso. Entre com seu e-mail e senha.");
    if(params.get("oauth")!=="google")return;
    void supabase.auth.getUser().then(async({data})=>{
      if(!data.user){setMessage("Não foi possível concluir o acesso pelo Google. Tente novamente.");return;}
      if(data.user.user_metadata?.password_configured){await navigate({to:"/"});return;}
      setMode("google-password");
    });
  },[navigate]);

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();
    setBusy(true);
    setMessage("");

    if(mode==="google-password"){
      if(password!==passwordConfirmation){setMessage("As senhas não coincidem.");setBusy(false);return;}
      const {error}=await supabase.auth.updateUser({password,data:{password_configured:true}});
      if(error)setMessage(error.message);
      else await navigate({to:"/"});
      setBusy(false);
      return;
    }

    if(mode==="forgot"){
      const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/reset-password`});
      setMessage(error?.message||"Se houver uma conta com este e-mail, você receberá as instruções para redefinir a senha.");
      setBusy(false);
      return;
    }

    if(mode==="signup"){
      const {data,error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:`${window.location.origin}/login?confirmed=1`,data:{full_name:name}}});
      if(error)setMessage(error.message);
      else if(data.session){
        await supabase.auth.signOut();
        setMode("login");
        setMessage("Conta criada. Entre com seu e-mail e senha.");
      }else setMessage("Se ainda não houver uma conta com este e-mail, enviamos a confirmação. Caso já exista, nenhuma nova mensagem será enviada: entre ou recupere sua senha.");
    }else{
      const {error}=await supabase.auth.signInWithPassword({email,password});
      if(error)setMessage("E-mail ou senha inválidos. Se criou a conta com Google, use o botão do Google ou recupere sua senha.");
      else await navigate({to:"/"});
    }
    setBusy(false);
  };

  const google=async()=>{
    setBusy(true);
    setMessage("");
    const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:`${window.location.origin}/login?oauth=google`}});
    if(error){setMessage(error.message);setBusy(false);}
  };

  const title=mode==="login"?"Entre na sua conta":mode==="signup"?"Crie sua conta":mode==="forgot"?"Recupere sua senha":"Defina sua senha";

  return <main className="grid min-h-screen lg:grid-cols-2">
    <section className="relative hidden overflow-hidden bg-header lg:block"><img src={hero} alt="Profissional da construção" className="absolute inset-0 size-full object-cover opacity-55"/><div className="absolute inset-0 bg-hero-overlay"/><div className="relative z-10 flex h-full flex-col justify-between p-12 text-header-foreground"><Brand/><h1 className="max-w-lg text-5xl font-black uppercase">Sua obra começa com a escolha certa.</h1><p>Qualidade, variedade e atendimento de confiança.</p></div></section>
    <section className="flex items-center justify-center bg-background p-5"><div className="w-full max-w-md"><div className="mb-10 lg:hidden"><Brand/></div><p className="eyebrow">Área do cliente</p><h1 className="text-4xl font-black uppercase">{title}</h1>{mode==="google-password"&&<p className="mt-3 text-sm text-muted-foreground">Sua conta Google está pronta. Cadastre uma senha para também entrar com e-mail e senha.</p>}
      <form onSubmit={submit} className="mt-8 space-y-4">
        {mode==="signup"&&<input className="input" required placeholder="Nome completo" value={name} onChange={e=>setName(e.target.value)}/>}
        {mode!=="google-password"&&<input className="input" required type="email" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)}/>}
        {mode!=="forgot"&&<label className="relative block"><input className="input pr-12" required minLength={6} type={show?"text":"password"} placeholder={mode==="google-password"?"Crie uma senha":"Senha"} value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" aria-label={show?"Ocultar senha":"Mostrar senha"} className="absolute right-3 top-3" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></label>}
        {mode==="google-password"&&<input className="input" required minLength={6} type="password" placeholder="Confirme a senha" value={passwordConfirmation} onChange={e=>setPasswordConfirmation(e.target.value)}/>}
        {message&&<p className="rounded-md bg-muted p-3 text-sm" role="status">{message}</p>}
        <Button className="w-full" variant="brand" size="lg" disabled={busy}>{busy?"Aguarde...":mode==="login"?"Entrar":mode==="signup"?"Criar conta":mode==="forgot"?"Enviar link":"Cadastrar senha"}</Button>
      </form>
      {mode==="login"&&<Button className="mt-3 w-full" variant="outline" size="lg" onClick={google} disabled={busy}>Continuar com Google</Button>}
      {mode!=="google-password"&&<div className="mt-6 flex flex-wrap justify-between gap-3 text-sm"><button onClick={()=>setMode(mode==="signup"?"login":"signup")} className="font-bold text-primary">{mode==="signup"?"Já tenho conta":"Criar conta"}</button><button onClick={()=>setMode(mode==="forgot"?"login":"forgot")} className="font-bold">{mode==="forgot"?"Voltar":"Esqueci minha senha"}</button></div>}
    </div></section>
  </main>
}