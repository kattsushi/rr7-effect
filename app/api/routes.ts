import {
  layout,
  route,
} from "@react-router/dev/routes";

export const ApiRoutes = [
  route("auth/login", "api/auth/login.tsx"),
  route("auth/logout", "api/auth/logout.tsx"),
];
