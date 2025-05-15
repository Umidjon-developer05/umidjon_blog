import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDb } from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { NextAuthOptions, Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import type { User as NextAuthUser, Account, Profile } from 'next-auth'

interface User {
	id: string
	name: string
	email: string
	image: string
}
// Ensure database connection
connectToDb()

// Define auth options
export const authOptions: NextAuthOptions = {
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID || '',
			clientSecret: process.env.GITHUB_SECRET || '',
			authorization: {
				params: {
					scope: 'read:user user:email',
				},
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID || '',
			clientSecret: process.env.GOOGLE_SECRET || '',
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null
				}

				await connectToDb()

				// Find user by email
				const user = await User.findOne({ email: credentials.email })

				// Check if user exists and has a password (not a social login only user)
				if (!user || !user.password) {
					return null
				}

				// Verify password
				const isPasswordValid = await bcrypt.compare(
					credentials.password,
					user.password
				)

				if (!isPasswordValid) {
					return null
				}

				// Update last login
				await User.findOneAndUpdate(
					{ email: user.email },
					{ $set: { lastLogin: new Date() } }
				)

				return {
					id: user._id.toString(),
					name: user.name,
					email: user.email,
					image: user.image,
				}
			},
		}),
	],
	pages: {
		signIn: '/login',
		error: '/error',
	},
	callbacks: {
		async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
			if (user) {
				token.id = user.id
			}
			return token
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			if (session.user && token) {
				session.user.id = token.id
			}
			return session
		},
		async signIn({
			user,
			account,
			profile,
		}: {
			user: NextAuthUser
			account: Account | null
			profile?: Profile
		}) {
			try {
				if (account?.provider === 'credentials') {
					return true
				}

				await connectToDb()

				if (!user.email) {
					console.log('No email provided by OAuth provider')

					if (account?.provider === 'github' && profile && 'login' in profile) {
						const githubProfile = profile as { login: string }
						user.email = `${githubProfile.login}@github.placeholder.com`
					} else {
						user.email = `user-${Date.now()}@placeholder.com`
					}
				}

				const existingUser = await User.findOne({
					$or: [
						{ email: user.email },
						account?.providerAccountId
							? {
									providerAccountId: account.providerAccountId,
									provider: account.provider,
							  }
							: {},
					],
				})

				if (!existingUser) {
					const newUser = new User({
						name: user.name || 'Anonymous User',
						email: user.email,
						image: user.image,
						provider: account?.provider,
						providerAccountId: account?.providerAccountId,
						createdAt: new Date(),
					})
					await newUser.save()
				} else {
					await User.findOneAndUpdate(
						{ email: user.email },
						{
							$set: {
								name: user.name || existingUser.name,
								image: user.image || existingUser.image,
								lastLogin: new Date(),
							},
						}
					)
				}

				return true
			} catch (error) {
				console.error('Error in signIn callback:', error)
				return false
			}
		},
	},
	session: {
		strategy: 'jwt' as const,
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	secret: process.env.NEXTAUTH_SECRET,
}

// Initialize NextAuth
export const { auth, signIn, signOut } = NextAuth(authOptions)
