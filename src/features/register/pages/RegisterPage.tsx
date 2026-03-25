import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterNav } from "../components/RegisterNav";
import { RegisterProgress } from "../components/RegisterProgress";
import { StepBasic } from "../components/StepBasic";
import { StepBody } from "../components/StepBody";
import { StepGoal } from "../components/StepGoal";
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
    <div className="mt-20 flex justify-center">
      <div className="w-96 space-y-6">
        <h1 className="text-2xl font-bold">Register</h1>

        <RegisterProgress step={step} />

        {error && <div className="text-sm text-red-500">{error}</div>}

        {step === 1 && <StepBasic data={formData} setField={setField} />}
        {step === 2 && <StepBody data={formData} setField={setField} />}
        {step === 3 && <StepGoal data={formData} setField={setField} />}

        <RegisterNav
          step={step}
          canGoNext={canGoNext}
          loading={loading}
          onBack={back}
          onNext={next}
          onFinish={finish}
        />
      </div>
    </div>
  );
}
