import { db } from "@/lib/db";
import { lucia, validateRequest } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/sign-in");
  }

  let userSettings = await db.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    userSettings = await db.userSettings.create({
      data: {
        userId: user.id,
        currency: "COP",
      },
    });
  }

  // Revalidate the home page that uses the user currency
  revalidatePath("/");
  return Response.json(userSettings);
}