import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {

  providers: [
    CredentialsProvider({
        // The name to display on the sign in form (e.g. 'Sign in with...')
        name: 'Credentials',
        credentials: {},
        async authorize(credentials, req) {
        
            console.log('100')
            let user = {id: '323jjoi43', firstName: 'John', lastName: 'Rambo', username: 'rambo'}

            const {username, password} = credentials
            console.log(username, password)
            if(username !== 'rambo' && password !== '12345') {
                return  null
            } 

            if(username == 'rambo'      && password == '12345') return user;
            
    }
})
    // ...add more providers here
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;  // Setting token in session
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  }
}
export default NextAuth(authOptions)