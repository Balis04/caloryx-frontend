import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/use-auth";

export default function Navbar() {
  const { isAuthenticated, login, logout, hasAnyRole } = useAuth();
  const navigate = useNavigate();
  const isCoach = hasAnyRole("COACH");

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
      <button
        type="button"
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
        aria-label="Go to home page"
      >
        <img
          src="/logo2.png"
          alt="CalorieX"
          style={{
            height: "42px",
            width: "auto",
            display: "block",
          }}
        />
      </button>

      {isAuthenticated ? (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {isCoach && (
            <button onClick={() => navigate("/coach-profile")}>
              Coach Profile
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
