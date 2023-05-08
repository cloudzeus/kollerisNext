import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


export default withAuth(
    function middleware(req) {
    
        if(req.nextUrl.pathname.startsWith("/dashboard/admin") && req.nextauth.token.user.role !== 'admin') {
            console.log(req.nextauth.token.user)
            return NextResponse.redirect(new URL('/auth/signin', req.url))
        }
        
       
    }
)







export const config = {
    matcher: ["/dashboard/admin/:path*"]
}