import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { DataTypes, Sequelize } from 'sequelize'
import SequelizeAdapter, { models } from '@next-auth/sequelize-adapter'

// const sequelize = new Sequelize("yourconnectionstring")
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_DATABASE_URL,
  database: process.env.DB_DATABASENAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  ],
  adapter: SequelizeAdapter(sequelize, {
    models: {
      User: sequelize.define('user', {
        ...models.User,
        role: {
          type: DataTypes.STRING,
          defaultValue: 'user'
        },
      }, {
        underscored: true,
        timestamps: false
      }),
    },
  }),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    // Here we pass accessToken to the client to be used in authentication with your API
    async session({ session, user, token }) {
      if (session.user)
        session.user.role = token.role
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.role = user.role
      }
      return token
    }
  },
}

export default NextAuth(authOptions)