"use client"

import { Button } from "@/components/ui/button";
import {
  createFacebookAuthorizationURL,
  createGoogleAuthorizationURL,
} from "../actions/auth.actions";
import { toast } from "@/components/ui/use-toast";
import { Fragment, useEffect, useState } from "react";
import { useCountdown } from "usehooks-ts";
import { MailIcon } from "lucide-react";

export function SignInForm() {
    const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 60,
      intervalMs: 1000,
    });

    useEffect(() => {
        if (count === 0) {
          stopCountdown()
          resetCountdown()
        }
    }, [count]);

    const onGoogleSignInClicked = async () => {
        const res = await createGoogleAuthorizationURL()
        if (res.error) {
          toast({
            variant: "destructive",
            description: res.error,
          })
        } else if (res.success) {
          window.location.href = res.data.toString()
        }
      }
    
      const onFacebookSignInClicked = async () => {
        const res = await createFacebookAuthorizationURL()
        if (res.error) {
          toast({
            variant: "destructive",
            description: res.error,
          })
        } else if (res.success) {
          window.location.href = res.data.toString()
        }
      }

      return (
        <Fragment>
            <div className="w-full flex item-center justify-center">
                <Button
                onClick={onGoogleSignInClicked}
                variant={"outline"}
                className="w-full"
                
                >
                <MailIcon  className="mr-3" /> Ingresa con Google
                </Button>
            </div>
        </Fragment>
    )
}