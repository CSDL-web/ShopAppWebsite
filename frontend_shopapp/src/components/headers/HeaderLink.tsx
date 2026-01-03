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
        ...style,
      }}
    >
      {children}
    </Link>
  );
}
