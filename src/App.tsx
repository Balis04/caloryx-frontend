import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import RegisterPage from "./features/register/pages/RegisterPage";
import EditProfilePage from "./features/profile/pages/EditProfilePage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import AuthRedirect from "./pages/AuthRedirect";
import FoodSearch from "./features/foods/FoodSearch";
import { Outlet } from "react-router-dom";
import RequireAuth from "./guards/RequireAuth";
import RequireOnboarding from "./guards/RequireOnboarding";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import DiaryScreen from "./features/foods/components/DiaryScreen";
import MealTimeDetailsPage from "./features/foods/pages/MealTimeDetailsPage";
import TrainerRequestPage from "./features/training-request/pages/TrainerRequestPage";
import TrainerProfilePage from "./features/trainer-profile/pages/TrainerProfilePage";
import RequireTrainer from "./guards/RequireTrainer";

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
            <Route path="/training-request" element={<TrainerRequestPage />} />
            <Route
              path="/trainer-profile"
              element={
                <RequireTrainer>
                  <TrainerProfilePage />
                </RequireTrainer>
              }
            />
            <Route path="/calorie-counter" element={<DiaryScreen />} />
            <Route path="/foods/:mealTime" element={<FoodSearch />} />
            <Route
              path="/calorie-counter/meal/:mealTime"
              element={<MealTimeDetailsPage />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
