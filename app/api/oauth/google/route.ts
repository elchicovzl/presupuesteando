import { db } from "@/lib/db"
import { lucia } from "@/lib/auth";
import { google } from "@/lib/oauth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface GoogleUser {
    id: string
    email: string
    verified_email: boolean
    name: string
    given_name: string
    picture: string
    locale: string
}

export const GET = async (req: NextRequest) => {
    try {
      const url = new URL(req.url)
      const searchParams = url.searchParams
  
      const code = searchParams.get("code")
      const state = searchParams.get("state")

      if (!code || !state) {
        return Response.json(
          { error: "Invalid request" },
          {
            status: 400,
          }
        )
      }
  
      const codeVerifier = cookies().get("codeVerifier")?.value
      const savedState = cookies().get("state")?.value
  
      if (!codeVerifier || !savedState) {
        return Response.json(
          { error: "Code verifier or saved state is not exists" },
          {
            status: 400,
          }
        )
      }
  
      if (savedState !== state) {
        return Response.json(
          {
            error: "State does not match",
          },
          {
            status: 400,
          }
        )
      }
  
      const { accessToken, idToken, accessTokenExpiresAt, refreshToken } =
        await google.validateAuthorizationCode(code, codeVerifier)
  
      const googleRes = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          method: "GET",
        }
      )
  
      const googleData = (await googleRes.json()) as GoogleUser
  
      try {

        const account = await db.account.findFirst({
            where: {
                providerAccountId: googleData.id
            }
        });

        if(!account) {
            const user = await db.user.create({
                data: {
                    email: googleData.email,
                    name: googleData.name,
                    profilePictureUrl: googleData.picture,
                    role: "USER"
                }
            });

            const regAccount = await db.account.create({
                data: {
                    provider: "google",
                    providerAccountId: googleData.id,
                    userId: user.id,
                    access_token: accessToken,
                    expires_at: accessTokenExpiresAt,
                    refresh_token: refreshToken,
                    type: "oauth"
                }
            });


        }else {
            const updatedAccount = await db.account.update({
                where: {
                    id: account.id
                },
                data: {
                    access_token: accessToken,
                    expires_at: accessTokenExpiresAt,
                    refresh_token: refreshToken,
                }
            });
        }

        const accountSession = await db.account.findFirst({
            where: {
                providerAccountId: googleData.id
            }
        });

        if (!accountSession) {
            return Response.json(
                { error: "error" },
                {
                  status: 500,
                }
            )
        }

        const session = await lucia.createSession(accountSession?.userId, {
            expiresIn: 60 * 60 * 24 * 30,
        });

        const sessionCookie = lucia.createSessionCookie(session.id)
      
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );
      
        cookies().set("state", "", {
            expires: new Date(0),
        });
        cookies().set("codeVerifier", "", {
            expires: new Date(0),
        });
      
        return NextResponse.redirect(
            new URL("/", process.env.NEXT_PUBLIC_BASE_URL),
            {
                status: 302,
            }
        );


      } catch(error) {
        console.log("[SIGIN_GOOGLE]", error);
        return { error: "Algo salió mal!" };
      }
      
    } catch (error: any) {
      return Response.json(
        { error: error.message },
        {
          status: 500,
        }
      )
    }
  }