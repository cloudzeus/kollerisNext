import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  sectret:process.env.NEXTAUTH_SECRET,
  session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    // // Seconds - Throttle how frequently to write to database to extend a session.
    // // Use it to limit write operations. Set to 0 to always update the database.
    // // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
    // generateSessionToken: () => {
    //   return randomUUID?.() ?? randomBytes(32).toString("hex")
    // }
  },
  providers: [
    CredentialsProvider({
        name: 'Credentials',
        type: 'credentials',
        credentials: {},
       
        async authorize(credentials, req) {
            const res = await fetch("http://localhost:3000/api/user/login", {
              method: "POST",
              body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" },
            });
            const resJson = await res.json();
            const user = resJson.user;
            if (user) {
              return user;
            } else {
              return null;
            }
            
            
            
    }
})
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, user}) {
      console.log(`token ${JSON.stringify(token)}`);
      console.log(user)
      return {...token};
    },
    async session({ session, token }) {
      session.user = token;
      console.log(session)
      // console.log('----------------------------- this is the TOKEN.USER')
      // console.log(token.user)
      // console.log('----------------------------- this is the sessio.user')
      // console.log(session.user)
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  }
})


