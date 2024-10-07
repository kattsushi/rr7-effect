import type * as Route from "./+types.admin";

import { Outlet } from "react-router";
export async function loader({ request }: Route.LoaderArgs) {
}

export default function AdminLayout() {
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