import { Hexagon } from "lucide-react";
export function Brand({ compact=false }: { compact?: boolean }) { 
  return (
    <div className="flex items-center gap-2 font-black uppercase leading-none tracking-normal">
      <span className="grid size-10 place-items-center bg-primary text-primary-foreground [clip-path:polygon(25%_7%,75%_7%,100%_50%,75%_93%,25%_93%,0_50%)]" aria-hidden="true">
        <Hexagon className="size-5"/>
      </span>
      <span className={compact ? "hidden sm:block" : "block"}>
        Depósito<br/><b className="text-primary">Araucária</b>
      </span>
    </div>
  );
}
