import {
  route,
  layout,
  index,
  type RouteConfig,
} from "@react-router/dev/routes";
import { ApiRoutes } from "./api/routes";
import { PagesRoutes } from "./pages/routes";

export const routes: RouteConfig = [
  ...PagesRoutes,
  ...ApiRoutes
];
