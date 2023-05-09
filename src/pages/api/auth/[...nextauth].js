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
            const resJSON = await fetch("http://localhost:3000/api/user/login", {
              method: "POST",
              body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" },
            });
            const res = await resJSON.json();
			console.log('------------------------- USER --------------------------')
			console.log(res)
			const user = res;
			
			console.log(user)
            if (user) {
              return user;
            } else {
              return null;
            }
            
            
            
    }
})
    // ...add more providers here
  ],
//   callbacks: {
//     async session({ session, token }) {
// 		session.user = token;
// 		// console.log('------------------------- TOKEN USER --------------------------')
// 		// console.log(token)
//       return session;
//     },
//     async jwt({ token, user}) {
// 		console.log('------------------------- TOKEN USER --------------------------')
// 		console.log(user)
// 	  return token;
//     },
    
//   },
  pages: {
    signIn: '/auth/signin',
  }
})


