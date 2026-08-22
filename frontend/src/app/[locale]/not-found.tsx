import Link from "next/link";

export default function NotFound() {
  return <main className="error-state"><h1>404</h1><p>Page not found</p><Link className="button button-primary" href="/fa">AbrIT</Link></main>;
}
