import { PiggyBank } from "lucide-react";
import Image from "next/image";
import React from "react";

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 my-3">
        <Image alt="logo" src="/logo.png" width={200} height={60} />
    </a>
  );
}

export function LogoMobile() {
  return (
    <a href="/" className="flex items-center gap-2">
      <p className="bg-gradient-to-r from-green-300 to-red-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Presupuesteando
      </p>
    </a>
  );
}

export default Logo;