import type * as Route from "./+types.login";

import { Link } from 'react-router'

import { getAuth } from "~/lib/auth/auth.server";

// export async function loader({ request }: Route.LoaderArgs) {
//   const { authenticator } = await getAuth();
//   const isAuthenticated = await authenticator.isAuthenticated(request, {
//     successRedirect: "/admin",
//   });
//   return isAuthenticated
// }
const Login = () => {
  return (
    <div>
      <Link
        to="/auth/login"
      >
        Login
      </Link>
    </div>
  )
}

export default Login