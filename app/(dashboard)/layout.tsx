import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";
import { SessionProvider } from "../SessionContext";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function layout({children}: {children: ReactNode}) {
    const session = await validateRequest();
    
    if (!session.user) {
        return redirect("/sign-in")
    }

    return (
        <div className="relative flex h-screen w-full flex-col">
            <div className="w-full">
                <SessionProvider value={session}>
                <Navbar />
                {children}
                </SessionProvider>
            </div>
        </div>
    )
}