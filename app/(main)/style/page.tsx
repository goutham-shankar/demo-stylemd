import { redirect } from "next/navigation";

export default function StyleRedirect() {
  // Keep legacy /style route working by redirecting to /styles
  redirect('/styles');
}
