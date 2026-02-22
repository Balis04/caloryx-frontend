import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import RegisterPage from "./features/register/pages/RegisterPage";
import EditProfilePage from "./pages/EditProfilePage";
import ProfilePage from "./pages/ProfilePage";
import AuthRedirect from "./pages/AuthRedirect";
import CaloriePage from "./pages/CaloriePage";

import RequireAuth from "./guards/RequireAuth";
import RequireOnboarding from "./guards/RequireOnboarding";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/auth-redirect" element={<AuthRedirect />} />

        {/* REGISTER csak autholt usernek */}
        <Route
          path="/register"
          element={
            <RequireAuth>
              <RegisterPage />
            </RequireAuth>
          }
        />

        {/* PROTECTED + ONBOARDED */}
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <RequireOnboarding>
                <ProfilePage />
              </RequireOnboarding>
            </RequireAuth>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <RequireAuth>
              <RequireOnboarding>
                <EditProfilePage />
              </RequireOnboarding>
            </RequireAuth>
          }
        />

        <Route
          path="/calorie-counter"
          element={
            <RequireAuth>
              <RequireOnboarding>
                <CaloriePage />
              </RequireOnboarding>
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
