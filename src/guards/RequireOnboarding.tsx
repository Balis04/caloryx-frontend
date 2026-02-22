// guards/RequireOnboarding.tsx
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

type AccountResponse = {
  hasProfile: boolean;
};

export default function RequireOnboarding({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getAccessTokenSilently } = useAuth0();
  const [status, setStatus] = useState<"loading" | "needsRegister" | "ok">(
    "loading"
  );

  useEffect(() => {
    const check = async () => {
      const token = await getAccessTokenSilently();

      const res = await fetch("/account/needs-register", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: AccountResponse = await res.json();

      if (data.hasProfile) {
        setStatus("ok");
      } else {
        setStatus("needsRegister");
      }
    };

    check();
  }, [getAccessTokenSilently]);

  if (status === "loading") return <div>Loading...</div>;

  if (status === "needsRegister") {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
}
