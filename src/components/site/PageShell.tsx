import { type ReactNode } from "react";
import { Header, Footer, FloatingWhatsApp } from "./Layout";
export function PageShell({children}:{children:ReactNode}) { return <><Header/><main>{children}</main><Footer/><FloatingWhatsApp/></>; }