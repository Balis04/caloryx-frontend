import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEditProfile } from "../hooks/useEditProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BasicInfoSection } from "../components/BasicInfoSection";
import { PhysicalStatsSection } from "../components/PhysicalStatsSection";
import { User, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { USER_ROLE_OPTIONS } from "@/shared/constants/user-options";

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
    return <div className="flex justify-center p-10 italic">Betöltés...</div>;

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] pt-2 pb-6 px-4">
      <div className="w-full max-w-5xl space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/profile")}
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3 h-3 mr-2" /> Vissza
        </Button>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="py-3 border-b mb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5" /> Profil szerkesztése
              </CardTitle>
              <Badge variant="secondary" className="capitalize">
                {USER_ROLE_OPTIONS.find((o) => o.value === userProfile.userRole)
                  ?.label ?? "Felhasználó"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 py-2">
            {" "}
            {/* Csökkentett space-y */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-4 items-start">
              {/* Bal oldal */}
              <div className="space-y-4">
                <BasicInfoSection
                  userProfile={userProfile}
                  setField={setField}
                />
              </div>

              {/* Jobb oldal */}
              <div className="space-y-4">
                <PhysicalStatsSection
                  userProfile={userProfile}
                  setField={setField}
                />
              </div>
            </div>
            <div className="pt-4 border-t mt-2">
              <Button
                onClick={handleSave}
                disabled={!canSave}
                className="w-full lg:w-48 h-10 ml-auto flex font-bold transition-all shadow-md"
              >
                {canSave ? "Mentés" : "Hiányzó adatok"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
