import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" style={{ marginLeft: "1rem" }}>
      <img
        src="/amazon-logo-2.webp"
        alt="Amazon"
        style={{ width: 100, height: 30, objectFit: "contain" }}
      />
    </Link>
  );
}
