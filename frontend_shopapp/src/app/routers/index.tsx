import { ReactElement, Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { URL } from "../../constants";
import DefaultLayout from "../layouts/DefaultLayout";
import User from "@/app/pages/dashboards/user";
import Product from "@/app/pages/dashboards/product"
const DEFAULT_LAYOUT = "default";

const Login = lazy(() => import("app/pages/login/loginPage"));
const Home = lazy(() => import("@/app/pages/homes/index"));
const Products = lazy(() => import("@/app/pages/products/index"));
const Cart = lazy(() => import("@/app/pages/carts/index"));


interface ItemType {
  key: string;
  components: ReactElement;
  layout: string;
  private: boolean;
}

const userItems: ItemType[] = [
  { key: URL.Login, components: <Login />, layout: DEFAULT_LAYOUT, private: false },
  { key: URL.Home, components: <Home />, layout: DEFAULT_LAYOUT, private: false },
  { key: URL.Products, components: <Products />, layout: DEFAULT_LAYOUT, private: false },
  { key: URL.Cart, components: <Cart />, layout: DEFAULT_LAYOUT, private: false },
];

const adminItems: ItemType[] = [
  { key: URL.Login, components: <Login />, layout: DEFAULT_LAYOUT, private: false },
  { key: URL.Home, components: <Home />, layout: DEFAULT_LAYOUT, private: false },
  { key: URL.Products, components: <Products />, layout: DEFAULT_LAYOUT, private: false },
  { key: URL.Cart, components: <Cart />, layout: DEFAULT_LAYOUT, private: false },

  // ✅ ADD route User vào đây
  { key: "/dashboard/users", components: <User />, layout: DEFAULT_LAYOUT, private: false },
  { key: "/dashboard/products", components: <Product />, layout: DEFAULT_LAYOUT, private: false },

];

const sharedItems: ItemType[] = [
  { key: URL.Login, components: <Login />, layout: DEFAULT_LAYOUT, private: false },
  { key: URL.Home, components: <Home />, layout: DEFAULT_LAYOUT, private: false },
];

function getItems(isTargetAdmin: boolean) {
  return isTargetAdmin ? adminItems.concat(sharedItems) : userItems.concat(sharedItems);
}

export default function Routers() {
  const items = getItems(true);
  console.log("ROUTES:", items.map(i => i.key));
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {items.map((item) => {
        let element = <Suspense fallback={null}>{item.components}</Suspense>;

        if (item.layout === DEFAULT_LAYOUT) {
          element = <DefaultLayout>{element}</DefaultLayout>;
        }

        if (item.private && !token) {
          element = <Navigate to={URL.Login} replace />;
        }

        return <Route key={item.key} path={item.key} element={element} />;
      })}

      <Route path="*" element={<Navigate to={URL.Home} replace />} />
    </Routes>
  );
}
