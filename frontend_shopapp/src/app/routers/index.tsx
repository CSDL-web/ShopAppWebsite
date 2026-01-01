import { ReactElement, Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { URL } from "../../constants";
import DefaultLayout from "../layouts/DefaultLayout";

const NONE_LAYOUT = "none";
const DEFAULT_LAYOUT = "default";

const Login = lazy(() => import("app/pages/login/loginPage"));
const Home = lazy(() => import("@/app/pages/homes/index"));
const Products = lazy(() => import("@/app/pages/products/index"));
const Cart = lazy(() => import("@/app/pages/carts/index"));
const CateProduct = lazy(() => import("@/app/pages/products/cateProduct"));

interface ItemType {
  key: string;
  components: ReactElement;
  layout: string;
  private: boolean;
}

const userItems: ItemType[] = [
  {
    key: URL.Login,
    components: <Login />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
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
];

const adminItems: ItemType[] = [
  {
    key: URL.Login,
    components: <Login />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
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
];

const sharedItems: ItemType[] = [
  {
    key: URL.Login,
    components: <Login />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
  {
    key: URL.Home,
    components: <Home />,
    layout: DEFAULT_LAYOUT,
    private: false,
  },
];

function getItems(isTargetAdmin: boolean) {
  const items = isTargetAdmin
    ? adminItems.concat(sharedItems)
    : userItems.concat(sharedItems);
  return items;
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
