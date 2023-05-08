import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"


export default withAuth(
    async function  middleware(req) {
    
        if(req.nextUrl.pathname.startsWith("/dashboard/admin") && req.nextauth.token.user.role !== 'admin') {
            console.log(req.nextauth.token.user)
            return NextResponse.redirect(new URL('/auth/signin', req.url))
        }

       const token = await getToken({req}) 
       if(token) {
        console.log("JSON Web Token", JSON.stringify(token, null, 2))
       }
       
    }
)







export const config = {
    matcher: ["/dashboard/admin/:path*", "/dashboard/:path*"]
}