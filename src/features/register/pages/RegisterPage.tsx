import RegisterWorkspace from "../components/RegisterWorkspace";
import { useRegisterPage } from "../hooks/useRegisterPage";

export default function RegisterPage() {
  const registerPage = useRegisterPage();

  return <RegisterWorkspace {...registerPage} />;
}
