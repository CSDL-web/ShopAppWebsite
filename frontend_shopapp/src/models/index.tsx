import { ReactNode, ReactElement } from "react";

export interface ILayoutProps {
  children: ReactElement;
}

export interface MenuItemType {
  key: string | number;
  label: ReactNode;
  icon?: ReactNode;
  path?: string;
  children?: MenuItemType[];
}

export interface DynamicKeyObject {
  [key: string | number]: any;
}
