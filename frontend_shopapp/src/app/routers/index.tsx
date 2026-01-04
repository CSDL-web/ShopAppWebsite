import { ReactElement, Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { URL } from "../../constants";
import DefaultLayout from "../layouts/DefaultLayout";
import User from "@/app/pages/dashboards/users/user";
import Product from "@/app/pages/dashboards/product";
import Layout from "@/app/pages/login/layout";
import ProductContainer from "../pages/searchs/searchPage";

const DEFAULT_LAYOUT = "default";
const AUTH_LAYOUT = "auth";

const Home = lazy(() => import("@/app/pages/homes/index"));
const Products = lazy(() => import("@/app/pages/products/index"));
const Cart = lazy(() => import("@/app/pages/carts/index"));
const Setting = lazy(() => import("@/app/pages/dashboards/setting"));
const CateProduct = lazy(() => import("@/app/pages/products/cateProduct"));

interface ItemType {
  key: string;
  components: ReactElement;
  layout: string;
  private: boolean;
}

const userItems: ItemType[] = [
  {
    key: URL.Home,
    components: <Home />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: URL.Products,
    components: <Products />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: URL.Cart,
    components: <Cart />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },

  {
    key: URL.Categories,
    components: <CateProduct />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: "/search",
    components: <ProductContainer />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
];

const adminItems: ItemType[] = [
  {
    key: URL.Home,
    components: <Home />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: URL.Products,
    components: <Products />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: URL.Cart,
    components: <Cart />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },

  {
    key: "/dashboard/users",
    components: <User />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: "/dashboard/products",
    components: <Product />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: "/dashboard/setting",
    components: <Setting />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: URL.Categories,
    components: <CateProduct />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: "/search",
    components: <ProductContainer />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
];

const sharedItems: ItemType[] = [
  {
    key: URL.Home,
    components: <Home />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
];

function getItems(isTargetAdmin: boolean) {
  return isTargetAdmin
    ? adminItems.concat(sharedItems)
    : userItems.concat(sharedItems);
}

export default function Routers() {
  const items = getItems(true);
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
