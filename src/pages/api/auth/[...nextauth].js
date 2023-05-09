import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import jwt from 'jsonwebtoken';

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
      console.log('session', session)
      console.log('token', token)
      console.log('token', token)
        // console.log('session', session)
    // console.log('token', token)
		session.user = token.user;
		session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user}) {
      console.log('Inside jwt' + JSON.stringify(user) + JSON.stringify(token))
	
	  if(token) {
		const payload = {
			sub: token?.user?.email,
			name: token?.user?.firstName,
			iat: parseInt(token?.iat), // issued at timestamp in seconds
			exp: parseInt(token?.exp), // expiration timestamp in seconds
			jti: token?.jti, // unique identifier for the token
		  };
		  const secret = process.env.NEXTAUTH_SECRET;
		  const jwtToken = jwt.sign(payload, secret, { algorithm: 'HS256' });
		  console.log('----------------------------- Token -------------------------------------')
		  console.log(jwtToken);
		  token.accessToken = jwtToken
		 
	  }
	  if(user) {
		token.user = user;
	  }
	  
	  return token;
    },
    
  },
  pages: {
    signIn: '/auth/signin',
  }
})


