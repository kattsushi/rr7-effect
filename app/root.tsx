import type * as Route from "./+types.root";
import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  LinksFunction,
  Outlet,
} from "react-router";

import indexCss from "./index.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: indexCss },
];

function App({ children, loaderData }: Route.ComponentProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function AppWithProviders({ loaderData }: Route.ComponentProps) {
  return (
      <App>
        <Outlet />
      </App>
  );
}
