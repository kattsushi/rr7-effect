import { createCookie, createMemorySessionStorage } from 'react-router'

const sessionCookie = createCookie('__session', {
  secrets: ['some-secret-for-signing-cookies'],
  sameSite: true,
})

export const authSessionStorage = createMemorySessionStorage({
  cookie: sessionCookie,
})

export const { getSession, commitSession, destroySession } = authSessionStorage
