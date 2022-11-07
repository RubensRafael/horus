import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import connectDb from "../../../lib/mongo";

export const authOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.HORUS_JWT_KEY,
    encryption: true
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        let result = null
        try {
          if (credentials) {
            const db = await connectDb();
            const users = db.collection('users');
            const user = await users.findOne<{ _id: string, password: string, name: string }>({ email: credentials.email });
            if (user) {
              const success = await bcrypt.compare(credentials.password, user.password)
              if (success) {
                result = { id: user._id, name: user.name }
              } else {
                return null
              }
            }
          }
        } catch (err) {
          throw new Error('There is a problem with your credentials.')
        }
        return result
      }
    })
  ],
}

export default NextAuth(authOptions)