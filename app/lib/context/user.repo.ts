import * as FetchHttpClient from '@effect/platform/FetchHttpClient'
import * as HttpApiClient from '@effect/platform/HttpApiClient'
import * as Context from 'effect/Context'
import * as T from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { GatewayApi } from '@devx/api/gateway'
import { Email } from '@devx/auth-domain'

const service = '@api/user-repository'

const make = T.gen(function* (_) {
  const client = yield* HttpApiClient.make(GatewayApi, {
    baseUrl: 'http://localhost:3000',
  })
  const data = new FormData()
  data.append('username', 'John')
  const user = yield* client.accounts.createUser({
    payload: {
      email: Email.make('a@test.com'),
    },
  })
  console.log(user)
  return { user } as const
}).pipe(
  T.catchAll((_) => T.succeed({} as const)),
  T.annotateSpans({ service }),
)

export class UserRepository extends Context.Tag(service)<UserRepository, T.Effect.Success<typeof make>>() {
  static readonly Live = Layer.scoped(this, make).pipe(Layer.provide(FetchHttpClient.layer))
}
