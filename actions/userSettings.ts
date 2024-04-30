"use server";

import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { UpdateUserCurrencySchema } from "@/schemas/userSettings";
import { redirect } from "next/navigation";

export async function UpdateUserCurrency(currency: string) {
  const parsedBody = UpdateUserCurrencySchema.safeParse({
    currency,
  });

  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  const { user } = await validateRequest();
  
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await db.userSettings.update({
    where: {
      userId: user.id,
    },
    data: {
      currency,
    },
  });

  return userSettings;
}