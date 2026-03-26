import { useAuth } from "@/features/auth/use-auth";

export default function LoginButton() {
  const { logout } = useAuth();

  return (
    <button onClick={() => void logout("/")}>
      Logout
    </button>
  );
}
