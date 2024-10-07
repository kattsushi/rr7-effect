import {
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export const PagesRoutes = [
  index("pages/auth/login.tsx"),
  layout("ui/layouts/admin.tsx", [
    route("admin", "pages/admin/home.tsx"),
  ])
];
