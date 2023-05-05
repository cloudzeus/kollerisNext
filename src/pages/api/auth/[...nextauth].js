import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  sectret:process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
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
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user}) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  }
})


