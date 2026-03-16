import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft } from "lucide-react";
import type {
  TrainerRequestFilter,
  TrainerViewMode,
} from "../types/training-requests.types";

interface Props {
  isTrainer: boolean;
  showTrainerIncomingRequests: boolean;
  trainerRequestFilter: TrainerRequestFilter;
  trainerViewMode: TrainerViewMode;
  onFilterChange: (value: TrainerRequestFilter) => void;
  onViewModeChange: (value: TrainerViewMode) => void;
}

export default function TrainingRequestsHeader({
  isTrainer,
  showTrainerIncomingRequests,
  trainerRequestFilter,
  trainerViewMode,
  onFilterChange,
  onViewModeChange,
}: Props) {
  const pageDescription = showTrainerIncomingRequests
    ? "Itt latod a hozzad beerkezett edzesterv kereseket."
    : "Itt latod az altalad elkuldott edzesterv kereseket es azok allapotat.";

  return (
    <CardHeader className="border-b">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ArrowRightLeft className="h-6 w-6" />
              Training kerelmek
            </CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{pageDescription}</p>
          </div>
          <Badge variant="secondary" className="w-fit">
            {showTrainerIncomingRequests ? "Edzoi nezet" : "Felhasznaloi nezet"}
          </Badge>
        </div>

        {isTrainer && (
          <div className="flex flex-wrap gap-3">
            <Button
              variant={trainerViewMode === "trainer" ? "default" : "outline"}
              onClick={() => onViewModeChange("trainer")}
            >
              Edzoi nezet
            </Button>
            <Button
              variant={trainerViewMode === "user" ? "default" : "outline"}
              onClick={() => onViewModeChange("user")}
            >
              Felhasznaloi nezet
            </Button>
          </div>
        )}

        {showTrainerIncomingRequests && (
          <Tabs value={trainerRequestFilter} onValueChange={(value) => onFilterChange(value as TrainerRequestFilter)}>
            <TabsList className="flex h-auto w-full max-w-2xl flex-row gap-1 p-1">
              <TabsTrigger value="pending" className="flex-1">
                Folyamatban
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex-1">
                Elfogadott
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex-1">
                Elutasitott
              </TabsTrigger>
              <TabsTrigger value="closed" className="flex-1">
                Befejezett
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
    </CardHeader>
  );
}
