import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { useRegisterForm } from "../hooks/useRegisterForm";
import { submitRegister } from "../services/register.service";
import { RegisterProgress } from "../components/RegisterProgress";
import { RegisterNav } from "../components/RegisterNav";
import { StepBasic } from "../components/StepBasic";
import { StepBody } from "../components/StepBody";
import { StepGoal } from "../components/StepGoal";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuth0();

  const { step, formData, setField, canGoNext, next, back } = useRegisterForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      await submitRegister(token, user?.email, formData);
      navigate("/profile");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Network error.");
      }
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
