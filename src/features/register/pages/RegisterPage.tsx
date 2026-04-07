import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterWorkspace from "../components/RegisterWorkspace";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { useRegisterService } from "../hooks/useRegisterService";

export default function RegisterPage() {
  const { registerUser } = useRegisterService();
  const navigate = useNavigate();
  const { step, formData, setField, canGoNext, next, back } = useRegisterForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async () => {
    setLoading(true);
    setError(null);
    try {
      await registerUser(formData);
      navigate("/profile");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterWorkspace
      step={step}
      values={formData}
      setField={setField}
      canGoNext={canGoNext}
      loading={loading}
      error={error}
      onBack={back}
      onNext={next}
      onFinish={() => void finish()}
    />
  );
}
