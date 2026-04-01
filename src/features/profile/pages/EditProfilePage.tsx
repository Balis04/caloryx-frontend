import { CaloriexPage, GlassCard } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../components/ProfileForm";
import { useProfileEditForm } from "../hooks/useProfileEditForm";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { loading, setField, values, loadProfile, saveProfile, canSave } =
    useProfileEditForm();

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleSave = async () => {
    if (await saveProfile()) navigate("/profile");
  };

  if (loading) {
    return (
      <CaloriexPage>
        <section className="container mx-auto px-6 py-16">
          <GlassCard>
            <CardContent className="p-6 text-sm italic text-slate-600">
              Loading profile editor...
            </CardContent>
          </GlassCard>
        </section>
      </CaloriexPage>
    );
  }

  return (
    <ProfileForm
      values={values}
      setField={setField}
      onSave={handleSave}
      canSave={canSave}
    />
  );
}
