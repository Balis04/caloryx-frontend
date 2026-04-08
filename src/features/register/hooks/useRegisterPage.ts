import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterForm } from "./useRegisterForm";
import { useRegisterService } from "./useRegisterService";

export const useRegisterPage = () => {
  const navigate = useNavigate();
  const { step, formData, setField, canGoNext, next, back } = useRegisterForm();
  const { loading, error, registerUser } = useRegisterService();

  const finish = useCallback(async () => {
    const isRegistered = await registerUser(formData);

    if (isRegistered) {
      navigate("/profile");
    }
  }, [formData, navigate, registerUser]);

  return {
    step,
    values: formData,
    setField,
    canGoNext,
    loading,
    error,
    onBack: back,
    onNext: next,
    onFinish: () => void finish(),
  };
};
