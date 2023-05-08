import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


export default withAuth(
    function middleware(req) {
        console.log('wthffff')
        console.log(req.url)
       

        if(req.nextUrl.pathname.startsWith("/dashboard/admin") && req.nextauth.token.user.role !== 'admin') {
            console.log(req.nextauth.token.user)
            return NextResponse.redirect(new URL('/auth/signin', req.url))
           
        }
        if(req.nextUrl === ("http://localhost:3000")) {
            console.log('next auth user')
            console.log('wthffff')
            console.log(req.url)
           
        }
       
    }
)







export const config = {
    matcher: ["/dashboard/admin/:path*"]
}