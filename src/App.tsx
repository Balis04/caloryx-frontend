import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import OnboardingPage from "./pages/OnboardingPage";
import EditProfilePage from "./pages/EditProfilePage";
import ProfilePage from "./pages/ProfilePage";
import AuthRedirect from "./pages/AuthRedirect";
import { AuthErrorHandler } from "./components/AuthErrorHandler";
import CaloriePage from "./pages/CaloriePage";

function App() {
  return (
    <>
      <AuthErrorHandler></AuthErrorHandler>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth-redirect" element={<AuthRedirect />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/calorie-counter" element={<CaloriePage />} />
      </Routes>
    </>
  );
}

export default App;
