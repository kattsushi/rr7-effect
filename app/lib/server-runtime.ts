
import { ManagedRuntime, Layer } from "effect"
import { AuthService } from "./context/auth.service"

const layers = Layer.mergeAll(
    AuthService.Live
)

export const ServerRuntime = ManagedRuntime.make(layers)