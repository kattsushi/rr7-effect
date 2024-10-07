import type * as Route from "./+types.login";
import { AuthService } from "~/lib/context/auth.service";
import * as T from "effect/Effect";
import * as Context from 'effect/Context'
import * as Layer from 'effect/Layer'

import { getAuth } from "~/lib/auth/auth.server";
import { ServerRuntime } from "~/lib/server-runtime";
import { loaderEffect } from "~/lib/effect.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router"

// export async function loader({ request }: Route.LoaderArgs) {
//   console.log("loader", request)
//   const { authenticator } = await getAuth();
//   return await authenticator.authenticate("zitadel-openid", request, {
//     successRedirect: "/admin",
//     failureRedirect: "/",
//   });
// }


// export const loader = loaderEffect(ServerRuntime ,({ request }) => T.gen(function* () {
//   // const authService = yield* AuthService˚
//   const { authenticator } = yield* AuthService.getAuth

//   yield* T.log("authenticating")
//   yield* T.log(JSON.stringify(authenticator))

//   return yield* T.promise(() => authenticator.authenticate("zitadel-openid", request, {
//     successRedirect: "/admin",
//     failureRedirect: "/",
//   }))
// }))

const LoaderArgs = Context.GenericTag<LoaderFunctionArgs>('LoaderArgs');

export async function loader(args: LoaderFunctionArgs) {
  console.log('args', args)
  return ServerRuntime.runPromise(T.gen(function* () {
    const { authenticator } = yield* AuthService.getAuth
    const args2 = yield* LoaderArgs
    yield* T.log("authenticating")
    yield* T.logInfo(args2.request)

    return yield* T.promise(() => authenticator.authenticate("zitadel-openid", args2.request, {
      successRedirect: "/admin",
      failureRedirect: "/",
    }))
  }).pipe(T.provideService(LoaderArgs, args)))
}

export default function Login() {
  return <></>;
}