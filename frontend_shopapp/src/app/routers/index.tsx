import { ReactElement, Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import ProtectedRoute from "../pages/login/ProtectedRoute";
import { URL } from "../../constants";

const Login = lazy(() => import("@/app/pages/login/loginPage"));
const Register = lazy(() => import("@/app/pages/login/register"));
const Home = lazy(() => import("@/app/pages/homes"));
const Products = lazy(() => import("@/app/pages/products"));
const Cart = lazy(() => import("@/app/pages/carts"));
const Checkout = lazy(() => import("@/app/pages/checkout/checkout"));
const Profile = lazy(() => import("@/app/pages/profile"));
const CateProduct = lazy(() => import("@/app/pages/products/cateProduct"));

const User = lazy(() => import("@/app/pages/dashboards/users/user"));
const Product = lazy(() => import("@/app/pages/dashboards/product"));
const Setting = lazy(() => import("@/app/pages/dashboards/setting"));

interface RouteType {
  key: string;
  components: ReactElement;
  requireAuth: boolean;
  adminOnly?: boolean;
}

const routes: RouteType[] = [
  { key: URL.Home, components: <Home />, requireAuth: false },
  { key: URL.Login, components: <Login />, requireAuth: false },
  { key: URL.Register, components: <Register />, requireAuth: false },
  { key: URL.Products, components: <Products />, requireAuth: false },
  { key: URL.Categories, components: <CateProduct />, requireAuth: false },

  { key: URL.Cart, components: <Cart />, requireAuth: true },
  { key: URL.Checkout, components: <Checkout />, requireAuth: true },
  { key: "/profile", components: <Profile />, requireAuth: true },

  {
    key: "/dashboard/users",
    components: <User />,
    requireAuth: true,
    adminOnly: true,
  },
  {
    key: "/dashboard/products",
    components: <Product />,
    requireAuth: true,
    adminOnly: true,
  },
  {
    key: "/dashboard/setting",
    components: <Setting />,
    requireAuth: true,
    adminOnly: true,
  },
];

export default function Routers() {
  return (
    <Routes>
      {routes.map((route) => {
        let element = <Suspense fallback={null}>{route.components}</Suspense>;

        element = <DefaultLayout>{element}</DefaultLayout>;

        element = (
          <ProtectedRoute
            requireAuth={route.requireAuth}
            adminOnly={route.adminOnly}
          >
            {element}
          </ProtectedRoute>
        );

        return <Route key={route.key} path={route.key} element={element} />;
      })}

      <Route path="*" element={<Navigate to={URL.Home} replace />} />
    </Routes>
  );
}
