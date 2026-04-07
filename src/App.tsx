import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import RegisterPage from "./features/register/pages/RegisterPage";
import EditProfilePage from "./features/profile/pages/EditProfilePage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import AuthRedirectPage from "./features/auth/pages/AuthRedirectPage";
import FoodSearchPage from "./features/foods/pages/FoodSearchPage";
import { Outlet } from "react-router-dom";
import RequireAuth from "./guards/RequireAuth";
import RequireOnboarding from "./guards/RequireOnboarding";
import DiaryPage from "./features/foods/pages/DiaryPage";
import MealTimeDetailsPage from "./features/foods/pages/MealTimeDetailsPage";
import CoachRequestPage from "./features/training-requests/request/pages/CoachRequestPage";
import CoachProfilePage from "./features/coach-profile/pages/CoachProfilePage";
import EditCoachProfilePage from "./features/coach-profile/pages/EditCoachProfilePage";
import RequireCoach from "./guards/RequireCoach";
import TrainingRequestFormPage from "./features/training-requests/request/pages/TrainingRequestFormPage";
import CoachTrainingRequestsPage from "./features/training-requests/coach-requests/pages/CoachTrainingRequestsPage";

const CommunityTrainingPlansPage = lazy(
  () => import("./features/community-training-plans/pages/CommunityTrainingPlansPage")
);

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route
          path="/community-training-plans"
          element={
            <Suspense fallback={<div className="container mx-auto px-6 py-16">Loading plans...</div>}>
              <CommunityTrainingPlansPage />
            </Suspense>
          }
        />

        <Route path="/auth-redirect" element={<AuthRedirectPage />} />

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
            <Route path="/training-request" element={<CoachRequestPage />} />
            <Route path="/training-requests" element={<CoachTrainingRequestsPage />} />
            <Route
              path="/training-request/:coachId"
              element={<TrainingRequestFormPage />}
            />
            <Route
              path="/coach-profile"
              element={
                <RequireCoach>
                  <CoachProfilePage />
                </RequireCoach>
              }
            />
            <Route
              path="/coach-profile/edit"
              element={
                <RequireCoach>
                  <EditCoachProfilePage />
                </RequireCoach>
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
