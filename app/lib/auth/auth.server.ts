import type { Session, SessionData } from 'react-router'
import { Authenticator } from 'remix-auth'
import { OIDCStrategy } from 'remix-auth-openid'
import type { OIDCStrategyBaseUser } from 'remix-auth-openid'
import { authSessionStorage } from './session.server'

interface User extends OIDCStrategyBaseUser {
  name?: string
}

async function getAuth() {
  const authenticator = new Authenticator<User>(authSessionStorage, {})
  const strategy = await OIDCStrategy.init<User>(
    {
      issuer: process.env.OPENID_ISSUER_URL ?? 'http://localhost:8080',
      client_id: process.env.OPENID_CLIENT_ID ?? 'zitadel-console',
      client_secret: process.env.OPENID_CLIENT_SECRET,
      redirect_uris: process.env.OPENID_REDIRECT_URIS?.split(',') ?? ['http://localhost:3000/auth/callback'],
      scopes: process.env.OPENID_SCOPES?.split(',') ?? ['openid', 'email', 'profile', 'offline_access'],
    },
    async ({ tokens, request }): Promise<User> => {
      if (!tokens.id_token) {
        throw new Error('No id_token in response')
      }

      if (!tokens.access_token) {
        throw new Error('No access_token in response')
      }

      return {
        ...tokens.claims(),
        accessToken: tokens.access_token,
        idToken: tokens.id_token,
        refreshToken: tokens.refresh_token,
        expiredAt: new Date().getTime() / 1000 + (tokens.expires_in ?? 0),
      }
    },
  )

  authenticator.use(strategy, 'zitadel-openid')
  return { strategy, authenticator }
}

interface UserSession {
  user: User
  session: Session<SessionData, SessionData>
}

async function getSession(request: Request): Promise<UserSession> {
  const { authenticator, strategy } = await getAuth()
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  const session = await authSessionStorage.getSession(request.headers.get('Cookie'))

  // refresh access_token if the expiration is approaching
  if (user.expiredAt < new Date().getTime() + 60 * 1000) {
    const tokens = await strategy.refresh(user.refreshToken ?? '', { failureRedirect: '/login' })
    if (!tokens || !tokens?.access_token) {
      return await authenticator.logout(request, { redirectTo: '/login' })
    }
    const newUser = { ...user, accessToken: tokens.access_token, refreshToken: tokens.refresh_token }
    session.set(authenticator.sessionKey, newUser)
    await authSessionStorage.commitSession(session)
    return { user: newUser, session }
  }

  return { user, session }
}

async function logout(request: Request) {
  const { authenticator, strategy } = await getAuth()
  const user = await authenticator.isAuthenticated(request)
  if (!user) {
    return await authenticator.logout(request, { redirectTo: '/login' })
  }
  const redirectTo = (strategy as any).logoutUrl(user.idToken ?? '')
  return await authenticator.logout(request, { redirectTo: redirectTo })
}

export { getAuth, getSession, logout }
