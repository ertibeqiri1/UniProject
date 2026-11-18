import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import bcrypt from 'bcryptjs'
import dbConnect from '@/src/lib/dbConnect'
import User from '@/src/models/User'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        await dbConnect()
        const user = await User.findOne({ email: credentials.email }).select('+password')
        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id:    user._id.toString(),
          name:  user.name,
          email: user.email,
          image: user.image,
          role:  user.role,
        }
      },
    }),

    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    FacebookProvider({
      clientId:     process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        await dbConnect()
        const existing = await User.findOne({ email: user.email })
        if (!existing) {
          await User.create({
            name:     user.name,
            email:    user.email,
            image:    user.image,
            provider: account.provider,
            password: undefined,
          })
        }
      }
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id   = user.id
      }
      if (!token.role) {
        await dbConnect()
        const dbUser = await User.findOne({ email: token.email })
        if (dbUser) token.role = dbUser.role
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
        session.user.id   = token.id
      }
      return session
    },
  },

  pages: {
    signIn: '/auth/signin',
    error:  '/auth/signin',
  },

  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)
