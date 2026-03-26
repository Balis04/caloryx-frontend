import { useAuth } from "@/features/auth/use-auth";

export default function LoginButton() {
  const { login } = useAuth();

  return <button onClick={login}>Login</button>;
}
