import { authenticateUser } from "@/app/server/handlers/auth";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { cookies } from "next/headers";

// TODO: Strip out NextAuth and replace with a custom handler
const handler = NextAuth({
  callbacks: {
    jwt: async ({ account, user, token }) => {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // here we put session.useData and put inside it whatever you want to be in the session
      // here try to console.log(token) and see what it will have
      // sometimes the user get stored in token.uid.userData
      // sometimes the user data get stored in just token.uid
      session.user = {
        id: token.id as string,
        email: token.email as string,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
      }

      return session;
    },
  },
  secret: "areallylongsecretkey",
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const response = await authenticateUser(credentials.email, credentials.password);
        if (!response?.token) {
          return null;
        }
        const cookieStore = await cookies();
        await cookieStore.set('token', response.token);
        return response.user || null;
      },
    }, )
  ],
})

export { handler as GET, handler as POST }