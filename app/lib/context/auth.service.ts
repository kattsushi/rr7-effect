import * as T from "effect/Effect";
import * as Layer from "effect/Layer";


interface User  {
  name?: string
}

const make = T.sync(() => {
  return {
    getAuth: T.gen(function* () {

      return { strategy: null, authenticator: null }
    })
  };
});

export class AuthService extends T.Tag("@services/AuthService")<
  AuthService,
  T.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(this, make);
}
