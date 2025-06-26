import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }){
        if(user){
            token.id = user.id;
        }
        return token;
    },
    async session({ session, token }){
        if(token){
            session.user.id = token.id as string;
        }
        return session;
    },
  },
});

export { handler as GET, handler as POST };
