import type * as Route from "./+types.login";
import * as T from "effect/Effect";
import { withLoaderEffect } from "~/lib/server-runtime";

export const loader = withLoaderEffect(
  T.gen(function* () {
    const { request } = yield* LoaderArgsContext
    yield* T.log("request", request)
    // yield* T.log("request", args.request)
    return yield* T.succeed({ hellow: 'world' })
  })
)

export default function Login() {
  return <></>;
}