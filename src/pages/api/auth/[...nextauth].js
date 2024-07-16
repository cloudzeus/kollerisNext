import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  session: {
    strategy: "jwt",
  
  },
  providers: [
    CredentialsProvider({
        sectret:process.env.NEXTAUTH_SECRET,
        name: 'Credentials',
        type: 'credentials',
        credentials: {},
       
        async authorize(credentials, req) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/login`, {
              method: "POST",
              body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" },
            });
            let user = await res.json();
            
            if (user.user  && user.success ) {
              return user;
            } 
            else {
              return null
            }
            
            
            
    }
})
    // ...add more providers here
  ],
  callbacks: {
	async jwt({ token, user, trigger, session }) {
    if(trigger === 'update') {
      return {...token, ...session.user};
    }
	  return {...token, ...user};
    },
    async session({ session, token }) {
      return {...session, ...token};
    },
    
    
  },
  pages: {
    signIn: '/auth/signin',
  }
})

