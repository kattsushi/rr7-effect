import type { Effect } from "effect/Effect"
import type { ManagedRuntime } from "effect/ManagedRuntime"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router"

export function loaderEffect<A, RE, RF, R>(
    runtime: ManagedRuntime<R, RE>,
    func: (args: LoaderFunctionArgs) => Effect<A, RF, R>
) {
    return function (args: LoaderFunctionArgs) {
      console.log("loaderEffect", args)
        return runtime.runPromise(func(args))
    }
}

export function actionEffect<A, RE, RF, R>(
    runtime: ManagedRuntime<R, RE>,
    func: (args: ActionFunctionArgs) => Effect<A, RF, R>
) {
    return function (args: ActionFunctionArgs) {
        return runtime.runPromise(func(args))
    }
}