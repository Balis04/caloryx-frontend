import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEditProfile } from "../hooks/useEditProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BasicInfoSection } from "../components/BasicInfoSection";
import { PhysicalStatsSection } from "../components/PhysicalStatsSection";
import { Separator } from "@/components/ui/separator";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { loading, setField, userProfile, loadUser, saveUserProfile, canSave } =
    useEditProfile();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleSave = async () => {
    if (await saveUserProfile()) navigate("/profile");
  };

  if (loading)
    return <div className="flex justify-center p-20">Betöltés...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-10">
      <div className="w-full max-w-lg px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-bold">
              Profil szerkesztése
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <BasicInfoSection userProfile={userProfile} setField={setField} />
            <Separator />
            <PhysicalStatsSection
              userProfile={userProfile}
              setField={setField}
            />
            <Separator />

            <div className="pt-2">
              <Button
                onClick={handleSave}
                disabled={!canSave}
                className="w-full h-12 text-lg transition-all"
              >
                {canSave ? "Mentés" : "Kérlek tölts ki minden mezőt"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
