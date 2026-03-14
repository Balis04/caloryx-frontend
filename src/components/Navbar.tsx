import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useViewerProfile } from "@/features/profile/hooks/useViewerProfile";

export default function Navbar() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();
  const { profile } = useViewerProfile(isAuthenticated);
  const isTrainer = profile?.role === "TRAINER";

  return (
    <nav
      style={{
        padding: "1rem",
        borderBottom: "1px solid #e5e5e5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div onClick={() => navigate("/")} style={{ fontWeight: 600 }}>
        CalorieX
      </div>

      {isAuthenticated ? (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>
            {user?.email}
          </span>

          {isTrainer && (
            <button onClick={() => navigate("/trainer-profile")}>
              Edzoi profil
            </button>
          )}

          <button onClick={() => navigate("/profile")}>Profile</button>

          <button
            onClick={() =>
              logout({
                logoutParams: { returnTo: window.location.origin },
              })
            }
          >
            Logout
          </button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>Login</button>
      )}
    </nav>
  );
}
