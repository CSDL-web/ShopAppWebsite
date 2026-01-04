import { ReactElement, Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { URL } from "../../constants";
import DefaultLayout from "../layouts/DefaultLayout";
import User from "@/app/pages/dashboards/users/user";
import Product from "@/app/pages/dashboards/product";
import ProductContainer from "../pages/searchs/searchPage";
import ProtectedRoute from "../pages/login/ProtectedPage";

const DEFAULT_LAYOUT = "default";
const AUTH_LAYOUT = "auth";

const Home = lazy(() => import("@/app/pages/homes/index"));
const Products = lazy(() => import("@/app/pages/products/index"));
const Cart = lazy(() => import("@/app/pages/carts/index"));
const Setting = lazy(() => import("@/app/pages/dashboards/setting"));
const CateProduct = lazy(() => import("@/app/pages/products/cateProduct"));
const Login = lazy(() => import("@/app/pages/login/loginPage"));
const Register = lazy(() => import("@/app/pages/login/register"));
const Checkout = lazy(() => import("@/app/pages/checkout/checkout"));

interface ItemType {
  key: string;
  components: ReactElement;
  layout: string;
  requireAuth: boolean;
  adminOnly?: boolean;
}

const publicRoutes: ItemType[] = [
  {
    key: URL.Home,
    components: <Home />,
    layout: DEFAULT_LAYOUT,
    requireAuth: false,
  },
  {
    key: URL.Products,
    components: <Products />,
    layout: DEFAULT_LAYOUT,
    requireAuth: false,
  },
  {
    key: URL.Categories,
    components: <CateProduct />,
    layout: DEFAULT_LAYOUT,
    requireAuth: false,
  },
  {
    key: "/search",
    components: <ProductContainer />,
    layout: DEFAULT_LAYOUT,
    requireAuth: false,
  },
  {
    key: URL.Login,
    components: <Login />,
    layout: DEFAULT_LAYOUT,
    requireAuth: false,
  },
  {
    key: URL.Register,
    components: <Register />,
    layout: DEFAULT_LAYOUT,
    requireAuth: false,
  },
  {
    key: URL.Checkout,
    components: <Checkout />,
    layout: DEFAULT_LAYOUT,
    requireAuth: false,
  },
];

const protectedRoutes: ItemType[] = [
  {
    key: URL.Cart,
    components: <Cart />,
    layout: DEFAULT_LAYOUT,
    requireAuth: true,
    adminOnly: false,
  },
];

const adminRoutes: ItemType[] = [
  {
    key: "/dashboard/users",
    components: <User />,
    layout: DEFAULT_LAYOUT,
    requireAuth: true,
    adminOnly: true,
  },
  {
    key: "/dashboard/products",
    components: <Product />,
    layout: DEFAULT_LAYOUT,
    requireAuth: true,
    adminOnly: true,
  },
  {
    key: "/dashboard/setting",
    components: <Setting />,
    layout: DEFAULT_LAYOUT,
    requireAuth: true,
    adminOnly: true,
  },
];

const allRoutes: ItemType[] = [
  ...publicRoutes,
  ...protectedRoutes,
  ...adminRoutes,
];

export default function Routers() {
  return (
    <Routes>
      {allRoutes.map((item) => {
        let element = <Suspense fallback={null}>{item.components}</Suspense>;

        if (item.layout === DEFAULT_LAYOUT) {
          element = <DefaultLayout>{element}</DefaultLayout>;
        }

        if (item.requireAuth) {
          element = (
            <ProtectedRoute
              requireAuth={item.requireAuth}
              adminOnly={item.adminOnly || false}
            >
              {element}
            </ProtectedRoute>
          );
        }

        return <Route key={item.key} path={item.key} element={element} />;
      })}

      <Route path="*" element={<Navigate to={URL.Home} replace />} />
    </Routes>
  );
}
