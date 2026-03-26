import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import RegisterPage from "./features/register/pages/RegisterPage";
import EditProfilePage from "./features/profile/pages/EditProfilePage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import AuthRedirect from "./pages/AuthRedirect";
import FoodSearchPage from "./features/foods/pages/FoodSearchPage";
import { Outlet } from "react-router-dom";
import RequireAuth from "./guards/RequireAuth";
import RequireOnboarding from "./guards/RequireOnboarding";
import DiaryPage from "./features/foods/pages/DiaryPage";
import MealTimeDetailsPage from "./features/foods/pages/MealTimeDetailsPage";
import TrainerRequestPage from "./features/training-request/pages/TrainerRequestPage";
import TrainerProfilePage from "./features/trainer-profile/pages/TrainerProfilePage";
import RequireTrainer from "./guards/RequireTrainer";
import TrainingRequestFormPage from "./features/training-request/pages/TrainingRequestFormPage";
import TrainingRequestsPage from "./features/training-requests/pages/TrainingRequestsPage";

function App() {
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
            <Route path="/training-requests" element={<TrainingRequestsPage />} />
            <Route
              path="/training-request/:trainerId"
              element={<TrainingRequestFormPage />}
            />
            <Route
              path="/trainer-profile"
              element={
                <RequireTrainer>
                  <TrainerProfilePage />
                </RequireTrainer>
              }
            />
            <Route path="/calorie-counter" element={<DiaryPage />} />
            <Route path="/foods/:mealTime" element={<FoodSearchPage />} />
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
