import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "index",
    component: () => import("../pages/index.vue"),
  },
  {
    path: "/catalog",
    name: "catalog.index",
    component: () => import("../pages/catalog/index.vue"),
  },
  {
    path: "/catalog/:id",
    name: "catalog.show",
    component: () => import("../pages/catalog/show.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
