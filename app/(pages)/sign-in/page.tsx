import { SignInForm } from "@/components/SignInForm";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
    const { user } = await validateRequest()

    if (user) {
        return redirect("/")
    }

    return (
        <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 dark:bg-gray-900 h-screen">
          <a
            href="#"
            className="flex items-center justify-center text-2xl font-semibold dark:text-white"
          >
            <img src="/logo.png" className="mr-4 w-96 h-56" />
          </a>
          <div className="w-full max-w-xl space-y-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:p-8">
            <SignInForm />
          </div>
        </div>
      )
}