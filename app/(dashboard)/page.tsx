import { unstable_noStore as noStore } from "next/cache";
import React from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/Overview";
import History from "./_components/History";

export const revalidate = 0;

async function page() {
    noStore();
    const { user } = await validateRequest()

    if (!user) {
        redirect("/sign-in");
    }

    const userSettings = await db.userSettings.findUnique({
        where: {
          userId: user.id,
        },
    });
    
    if (!userSettings) {
        redirect("/wizard");
    }

    return (
        <div className="h-full bg-background">
            <div className="border-b bg-card">
                <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
                    <p className="text-2xl font-bold capitalize">Hola, {user.name}! 👋</p>
                    <div className="flex items-center gap-3 justify-center md:justify-end w-full">
                        <CreateTransactionDialog
                            trigger={
                                <Button
                                    variant={"outline"}
                                    className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
                                >
                                    Nuevos Ingresos 🤑
                                </Button>
                            }
                            type="income"
                        />
                        <CreateTransactionDialog
                            trigger={
                                <Button
                                    variant={"outline"}
                                    className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
                                >
                                    Nuevos Gastos 😤
                                </Button>
                            }
                            type="expense"
                        />
                    </div>
                </div>
            </div>
            <Overview userSettings={userSettings} />
            <History userSettings={userSettings} />
        </div>
    )
}

export default page;