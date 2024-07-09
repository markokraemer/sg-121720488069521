import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// This is a mock user database. In a real application, you would use a proper database.
const users = [
  { id: 1, name: "Admin User", email: "admin@example.com", password: "password123" },
];

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Here you would usually query your database
        const user = users.find(user => user.email === credentials.email);
        if (user && user.password === credentials.password) {
          return { id: user.id, name: user.name, email: user.email };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
});