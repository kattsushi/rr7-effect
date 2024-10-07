import { Layer, ManagedRuntime, Context, Logger, Exit } from 'effect'
import { AuthService } from './context/auth.service'
import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from 'react-router'
import { pipe } from 'effect/Function'
import * as T from 'effect/Effect'

import * as Data from 'effect/Data'
import * as Match from 'effect/Match'

export class Ok<T> extends Data.TaggedClass('Ok')<{
  readonly data: T
}> {}

export class Redirect extends Data.TaggedClass('Redirect')<{
  readonly to: string
  readonly init?: any
}> {}

export type HttpResponse<T> = Redirect | Ok<T>
export const matchHttpResponse = <T>() => Match.typeTags<HttpResponse<T>>()

export const makeRuntime = <R, E>(layer: Layer.Layer<R, E, never>) => {
  const runtime = ManagedRuntime.make(layer);

  const withLoaderEffect =
    <A, B>(
      self: T.Effect<A, B, R>
    ) =>
    (args: LoaderFunctionArgs) => {
      const runnable = pipe(
        self,
        T.provide(Logger.pretty),
        T.provideService(LoaderArgsContext, args),
      )
      return runtime.runPromiseExit(runnable)
    }

    // Don't throw the Error requests, handle them in the normal UI. No ErrorBoundary
    const withActionEffect =
      <A>(self: T.Effect<HttpResponse<A>, Error, R>) =>
    (args: ActionFunctionArgs) => {
      const runnable = pipe(
        self,
        T.provideService(ActionArgsContext, args),
        T.provide(Logger.pretty),
        T.match({
          onFailure: (errors) => json({ ok: false as const, errors }, { status: 400 }),
          onSuccess: matchHttpResponse<A>()({
            Ok: ({ data }) => {
              return json({ ok: true as const, data })
            },
            Redirect: ({ to, init = {} }) => {
              return redirect(to, init)
            },
          }),
        }),
      )

      return runtime.runPromise(runnable)
    }

    return { withLoaderEffect, withActionEffect }
}

export const ActionArgsContext = Context.GenericTag<ActionFunctionArgs>('ActionArgsContext')
export const LoaderArgsContext = Context.GenericTag<LoaderFunctionArgs>('LoaderArgsContext')

const layers = Layer.mergeAll(
    AuthService.Live
);

export const { withLoaderEffect, withActionEffect } = makeRuntime(layers)