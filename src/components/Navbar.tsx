import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/use-auth";

export default function Navbar() {
  const { authState, isAuthenticated, login, logout, hasAnyRole } = useAuth();
  const navigate = useNavigate();
  const isTrainer = hasAnyRole("COACH");

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
            {authState?.email}
          </span>

          {isTrainer && (
            <button onClick={() => navigate("/trainer-profile")}>
              Trainer Profile
            </button>
          )}

          <button onClick={() => navigate("/profile")}>Profile</button>

          <button
            onClick={() => void logout("/")}
          >
            Logout
          </button>
        </div>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </nav>
  );
}
