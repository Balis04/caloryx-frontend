import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import RegisterPage from "./features/register/pages/RegisterPage";
import EditProfilePage from "./features/profile/pages/EditProfilePage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import AuthRedirect from "./pages/AuthRedirect";
import CaloriePage from "./pages/CaloriePage";
import FoodSearch from "./features/foods/FoodSearch";
import { Outlet } from "react-router-dom";
import RequireAuth from "./guards/RequireAuth";
import RequireOnboarding from "./guards/RequireOnboarding";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

function App() {
  const { isAuthenticated, getAccessTokenSilently, logout } = useAuth0();

  useEffect(() => {
    const validateToken = async () => {
      if (!isAuthenticated) return;

      try {
        await getAccessTokenSilently();
      } catch {
        logout({
          logoutParams: { returnTo: window.location.origin },
        });
      }
    };

    validateToken();
  }, [isAuthenticated, getAccessTokenSilently, logout]);

  return (
    <>
      <Navbar />
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />

        <Route path="/auth-redirect" element={<AuthRedirect />} />

        {/* CSAK AUTH KELL */}
        <Route
          element={
            <RequireAuth>
              <Outlet />
            </RequireAuth>
          }
        >
          <Route path="/register" element={<RegisterPage />} />

          {/* AUTH + ONBOARDING IS KELL */}
          <Route
            element={
              <RequireOnboarding>
                <Outlet />
              </RequireOnboarding>
            }
          >
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/calorie-counter" element={<CaloriePage />} />
            <Route path="/foods" element={<FoodSearch />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
