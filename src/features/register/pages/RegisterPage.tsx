import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { useRegisterService } from "../hooks/useRegisterService";
import { RegisterProgress } from "../components/RegisterProgress";
import { RegisterNav } from "../components/RegisterNav";
import { StepBasic } from "../components/StepBasic";
import { StepBody } from "../components/StepBody";
import { StepGoal } from "../components/StepGoal";

export default function RegisterPage() {
  // 1. Csak a service hook-ot hívjuk be
  const { registerUser } = useRegisterService();
  const navigate = useNavigate();
  const { step, formData, setField, canGoNext, next, back } = useRegisterForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async () => {
    setLoading(true);
    setError(null);
    try {
      // 2. Nincs token kéregetés, nincs email vadászat
      await registerUser(formData);
      navigate("/profile");
    } catch (e: unknown) {
      // 3. Az apiClient már tiszta hibaüzenetet dob
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="w-96 space-y-6">
        <h1 className="text-2xl font-bold">Register</h1>

        <RegisterProgress step={step} />

        {error && <div className="text-red-500 text-sm">{error}</div>}

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
