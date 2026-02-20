import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();

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
