import { Link } from "react-router-dom";
import { COLORS } from "@/styles/colors";

type Props = {
  to: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export default function HeaderLink({ to, children, style }: Props) {
  return (
    <Link
      to={to}
      style={{
        color: COLORS.white,
        textDecoration: "none",
        margin: "0.5rem",
        display: "inline-flex",      // ✅ giúp icon + text canh đẹp
        alignItems: "center",        // ✅ canh giữa
        gap: "0.25rem",              // ✅ khoảng cách nhỏ
        ...style,
      }}
    >
      {children}
    </Link>
  );
}
