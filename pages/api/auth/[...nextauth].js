import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const providers = [];

if (process.env.VERCEL_ENV === "preview") {
  providers.push(
    // Create a credentials provider with dummy data, describing input fields:
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "fish" },
        password: { label: "Password", type: "password" },
      },
      // and adding a fake authorization with static username and password:
      async authorize(credentials) {
        if (
          credentials.username === "fish" &&
          credentials.password === "fishbone"
        ) {
          return {
            id: "1",
            name: "Flipper",
            email: "YOUR-EMAIL-USED@github",
          };
        } else {
          return null;
        }
      },
    })
  );
} else {
  providers.push(
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  );
}

function getRoleOfUser(email) {
  if (email === "thomas.foeldi@gmail.com") {
    return "admin";
  }
  return "viewer";
}

export const authOptions = {
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = getRoleOfUser(user.email);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
};
export default NextAuth(authOptions);
