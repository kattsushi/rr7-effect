import type * as Route from "./+types.callback";

import { getAuth } from "~/lib/auth/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { authenticator } = await getAuth();
  return await authenticator.authenticate("zitadel-openid", request, {
    successRedirect: "/admin",
    failureRedirect: "/",
  });
}

export default function Calback() {
  return <></>;
}