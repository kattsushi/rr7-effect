import * as T from "effect/Effect";
import * as Layer from "effect/Layer";

import { Authenticator } from "remix-auth";
import { authSessionStorage } from "../auth/session.server";
import { OIDCStrategy, OIDCStrategyBaseUser } from "remix-auth-openid";


interface User extends OIDCStrategyBaseUser {
  name?: string
}

const make = T.sync(() => {
  return {
    getAuth: T.gen(function* () {
      const authenticator = new Authenticator<User>(authSessionStorage, {})
      const strategy = yield* T.promise(()=> OIDCStrategy.init<User>(
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
      ))
      authenticator.use(strategy, 'zitadel-openid')
      return { strategy, authenticator }
    })
  };
});

export class AuthService extends T.Tag("@services/AuthService")<
  AuthService,
  T.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(this, make);
}
