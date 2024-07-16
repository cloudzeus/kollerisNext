import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


export default withAuth(
    async function  middleware(req) {

        if(req.nextUrl.pathname.startsWith("/dashboard") && req.nextauth.token.user.role === 'user') {
            return NextResponse.redirect(new URL('/auth/signin', req.url))
        }

    }
)



export const config = {
    matcher: ["/dashboard/admin/:path*", "/dashboard/:path*"]
}