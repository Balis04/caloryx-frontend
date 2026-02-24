import { useNavigate } from "react-router-dom";
import ProfileField from "./ProfileField";
import type { ProfileResponse } from "../types/profile.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Target, Activity, Edit3 } from "lucide-react";

import {
  GENDER_OPTIONS,
  ACTIVITY_OPTIONS,
  GOAL_OPTIONS,
  USER_ROLE_OPTIONS,
} from "@/shared/constants/user-options";
import { getLabelFromOptions } from "@/shared/utils/optionMapper";

interface Props {
  profile: ProfileResponse;
}

export default function ProfileCard({ profile }: Props) {
  const navigate = useNavigate();

  const formattedDate = new Date(profile.birthDate).toLocaleDateString("hu-HU");
  const totalToLose = profile.startWeightKg - profile.targetWeightKg;
  const lostSoFar = profile.startWeightKg - profile.actualWeightKg;
  const progressValue =
    totalToLose > 0 ? Math.min((lostSoFar / totalToLose) * 100, 100) : 0;

  return (
    // Megnövelt szélesség (max-w-4xl), hogy asztalon kiférjen 2 oszlopban
    <Card className="w-full max-w-4xl shadow-xl border-t-4 border-t-primary">
      <CardHeader className="py-4 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Felhasználói Profil
          </CardTitle>
          <Badge variant="secondary" className="capitalize">
            {USER_ROLE_OPTIONS.find((o) => o.value === profile.role)?.label ??
              "Felhasználó"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Responsive Grid: Mobilan 1 oszlop, LG mérettől 2 oszlop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
          {/* BAL OLDAL: Személyes és alapvető fizikai adatok */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                <User className="w-3 h-3" /> Alapadatok
              </h3>
              <ProfileField label="Név" value={profile.fullName} />
              <ProfileField label="Születési dátum" value={formattedDate} />
              <ProfileField
                label="Nem"
                value={getLabelFromOptions(GENDER_OPTIONS, profile.gender)}
              />
              <ProfileField label="Magasság" value={`${profile.heightCm} cm`} />
            </div>

            <Separator className="lg:hidden" />

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                <Activity className="w-3 h-3" /> Fizikai állapot
              </h3>
              <ProfileField
                label="Kezdő súly"
                value={`${profile.startWeightKg} kg`}
              />
              <ProfileField
                label="Jelenlegi súly"
                value={`${profile.actualWeightKg} kg`}
              />
              <ProfileField
                label="Aktivitási szint"
                value={getLabelFromOptions(
                  ACTIVITY_OPTIONS,
                  profile.activityLevel
                )}
              />
            </div>
          </div>

          {/* JOBB OLDAL: Célok és Haladás */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                <Target className="w-3 h-3" /> Célkitűzések
              </h3>
              <ProfileField
                label="Cél súly"
                value={`${profile.targetWeightKg} kg`}
              />
              <ProfileField
                label="Heti cél"
                value={`${profile.weeklyGoalKg} kg`}
              />
              <ProfileField
                label="Cél típusa"
                value={getLabelFromOptions(GOAL_OPTIONS, profile.goal)}
              />
            </div>

            {/* Haladás szekció kártyaszerűen kiemelve */}
            <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-muted-foreground uppercase">
                  Haladás
                </span>
                <span className="text-lg font-black text-primary">
                  {progressValue.toFixed(0)}%
                </span>
              </div>
              <Progress value={progressValue} className="h-2.5" />
              <p className="text-[11px] text-center text-muted-foreground leading-tight">
                {lostSoFar > 0
                  ? `Gratulálunk, már ${lostSoFar.toFixed(
                      1
                    )} kg-ot fogytál az indulás óta!`
                  : "Minden nagy utazás az első lépéssel kezdődik!"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-slate-50/50 py-4">
        <Button
          onClick={() => navigate("/profile/edit")}
          className="w-full lg:w-auto lg:ml-auto font-bold group"
        >
          <Edit3 className="mr-2 w-4 h-4" />
          Profil szerkesztése
        </Button>
      </CardFooter>
    </Card>
  );
}
