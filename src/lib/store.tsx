import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Banner, Category, Company, ListItem, Product } from "./catalog";

type StoreValue = { products: Product[]; categories: Category[]; banners: Banner[]; company: Company | null; loading: boolean; session: Session | null; isAdmin: boolean; list: ListItem[]; addToList: (p: Product, q?: number) => void; updateQuantity: (id: string, q: number) => void; removeFromList: (id: string) => void; clearList: () => void; refresh: () => Promise<void> };
const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]); const [categories, setCategories] = useState<Category[]>([]); const [banners, setBanners] = useState<Banner[]>([]); const [company, setCompany] = useState<Company | null>(null); const [loading, setLoading] = useState(true); const [session, setSession] = useState<Session | null>(null); const [isAdmin, setIsAdmin] = useState(false); const [list, setList] = useState<ListItem[]>([]);
  const refresh = async () => { const [p,c,b,s] = await Promise.all([supabase.from("products").select("*, categories(name,slug)").order("name"), supabase.from("categories").select("*").order("sort_order"), supabase.from("banners").select("*").order("sort_order"), supabase.from("company_settings").select("*").limit(1).maybeSingle()]); setProducts((p.data as Product[]) || []); setCategories(c.data || []); setBanners(b.data || []); setCompany(s.data || null); setLoading(false); };
  useEffect(() => { void refresh(); const raw = localStorage.getItem("araucaria-list"); if(raw) try { setList(JSON.parse(raw) as ListItem[]); } catch { localStorage.removeItem("araucaria-list"); } supabase.auth.getSession().then(({data}) => setSession(data.session)); const { data } = supabase.auth.onAuthStateChange((event, next) => { if (["SIGNED_IN","SIGNED_OUT","USER_UPDATED"].includes(event)) setSession(next); }); return () => data.subscription.unsubscribe(); }, []);
  useEffect(() => { if (!session) { setIsAdmin(false); return; } supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle().then(({data}) => setIsAdmin(Boolean(data))); }, [session]);
  useEffect(() => { localStorage.setItem("araucaria-list", JSON.stringify(list)); }, [list]);
  const addToList = (product: Product, quantity=1) => setList(v => { const found=v.find(i=>i.product.id===product.id); return found?v.map(i=>i.product.id===product.id?{...i,quantity:i.quantity+quantity}:i):[...v,{product,quantity}]; });
  const value=useMemo(()=>({products,categories,banners,company,loading,session,isAdmin,list,addToList,updateQuantity:(id:string,q:number)=>setList(v=>q<1?v.filter(i=>i.product.id!==id):v.map(i=>i.product.id===id?{...i,quantity:q}:i)),removeFromList:(id:string)=>setList(v=>v.filter(i=>i.product.id!==id)),clearList:()=>setList([]),refresh}),[products,categories,banners,company,loading,session,isAdmin,list]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export const useStore=()=>{const v=useContext(StoreContext); if(!v) throw new Error("StoreProvider ausente"); return v;};
