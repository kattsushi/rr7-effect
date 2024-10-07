import type * as Route from "./+types.admin";

import { Outlet } from "react-router";
import { getAuth } from "~/lib/auth/auth.server";
import { getSidebarGroups } from "~/lib/sidebar-groups";

export async function loader({ request }: Route.LoaderArgs) {
  const { authenticator } = await getAuth();
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  return user;
}

export default function AdminLayout() {
  const groups = getSidebarGroups()
  return (
    <>
      <div className="navbar" />
      <div className="layout">
        <aside className="">
          <div className="sidebar" />
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  )
}