"use server"

import { generateId } from "lucia";
import { db } from "@/lib/db";
import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { generateCodeVerifier, generateState } from "arctic";
import { facebook, google } from "@/lib/oauth";

export const signOut = async () => {
    try {
      const { session } = await validateRequest()
  
      if (!session) {
        return {
          error: "Unauthorized",
        }
      }
  
      await lucia.invalidateSession(session.id)
  
      const sessionCookie = lucia.createBlankSessionCookie()
  
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    } catch (error: any) {
      return {
        error: error?.message,
      }
    }
}

export const createFacebookAuthorizationURL = async () => {
    try {
      const state = generateState()
  
      const authorizationURL = await facebook.createAuthorizationURL(state, {
        scopes: ["email", "public_profile"],
      })
  
      return {
        success: true,
        data: authorizationURL,
      }
    } catch (error: any) {
      return {
        error: error?.message,
      }
    }
}

export const createGoogleAuthorizationURL = async () => {
    try {
      const state = generateState()
      const codeVerifier = generateCodeVerifier()
  
      cookies().set("codeVerifier", codeVerifier, {
        httpOnly: true,
      })
  
      cookies().set("state", state, {
        httpOnly: true,
      })
  
      const authorizationURL = await google.createAuthorizationURL(
        state,
        codeVerifier,
        {
          scopes: ["email", "profile"],
        }
      )
  
      return {
        success: true,
        data: authorizationURL,
      }
    } catch (error: any) {
      return {
        error: error?.message,
      }
    }
}