import type * as Route from "./+types.logout";

import { getAuth } from "~/lib/auth/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { authenticator } = await getAuth();
  return await authenticator.logout(request, {
    redirectTo: "/",
  });
}

export default function Login() {
  return <></>;
}