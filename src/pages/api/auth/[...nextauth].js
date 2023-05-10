import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  session: {
    strategy: "jwt",
    // async encode() {},
    // async decode() {},
  },
  providers: [
    CredentialsProvider({
        sectret:process.env.NEXTAUTH_SECRET,
        name: 'Credentials',
        type: 'credentials',
        credentials: {},
       
        async authorize(credentials, req) {
            const res = await fetch("http://localhost:3000/api/user/login", {
              method: "POST",
              body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" },
            });
            const user = await res.json();
			
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
		console.log('------------------------- TOKEN --------------------------')
		console.log(token)
		console.log('------------------------- USER --------------------------')
		console.log(user)
	  return {...token, ...user};
    },
    async session({ session, token }) {
		session.user = token;
      return session;
    },
   
    
  },
  pages: {
    signIn: '/auth/signin',
  }
})


