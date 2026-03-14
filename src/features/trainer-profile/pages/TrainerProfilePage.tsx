import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  Edit3,
  FileText,
  Save,
  Shield,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrainerProfileForm } from "../hooks/useTrainerProfileForm";
import type { Currency, TrainingFormat } from "../types/trainer-profile.types";
import ProfileField from "@/features/profile/components/ProfileField";

const TRAINING_FORMAT_OPTIONS = [
  { value: "ONLINE", label: "Online" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "IN_PERSON", label: "Személyes" },
] as const;

const CURRENCY_OPTIONS = [
  { value: "HUF", label: "HUF" },
  { value: "EUR", label: "EUR" },
  { value: "USD", label: "USD" },
] as const;

export default function TrainerProfilePage() {
  const navigate = useNavigate();
  const {
    formData,
    loading,
    saving,
    statusMessage,
    errorMessage,
    hasTrainerProfile,
    isEditing,
    setField,
    setAvailabilityField,
    saveTrainerProfile,
    startEditing,
    cancelEditing,
    canSave,
  } = useTrainerProfileForm();
  const [selectedPdfNames, setSelectedPdfNames] = useState<string[]>([]);

  const allCertificateNames = useMemo(
    () => [...formData.certificates, ...selectedPdfNames],
    [formData.certificates, selectedPdfNames]
  );

  const handlePdfSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");
    setSelectedPdfNames(pdfFiles.map((file) => file.name));
  };

  if (loading) {
    return <div className="flex justify-center p-10 italic">Edzői profil betöltése...</div>;
  }

  const showForm = !hasTrainerProfile || isEditing;
  const primaryActionLabel = hasTrainerProfile ? "Módosítás mentése" : "Edzői profil létrehozása";

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] pt-2 pb-6 px-4">
      <div className="w-full max-w-5xl space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/profile")}
          className="w-fit text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-3 w-3" />
          Vissza a profilhoz
        </Button>

        {errorMessage && (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-4 text-sm text-red-700">
              {errorMessage}
            </CardContent>
          </Card>
        )}

        {statusMessage && (
          <Card className="border-emerald-300 bg-emerald-50">
            <CardContent className="p-4 text-sm">{statusMessage}</CardContent>
          </Card>
        )}

        {showForm ? (
          <Card className="shadow-lg border-t-4 border-t-primary">
            <CardHeader className="py-3 border-b mb-2">
              <div className="flex justify-between items-center gap-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />{" "}
                  {hasTrainerProfile ? "Edzoi profil modositasa" : "Edzoi profil letrehozasa"}
                </CardTitle>
                <Badge variant="secondary" className="capitalize">
                  Edzoi profil
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 py-2">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
                <div className="space-y-6">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Shield className="h-5 w-5" />
                        Bemutatkozas es munkamod
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startedCoachingAt">Mikortol edzoskodol?</Label>
                  <Input
                    id="startedCoachingAt"
                    type="date"
                    value={formData.startedCoachingAt}
                    onChange={(event) =>
                      setField("startedCoachingAt", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Rovid leiras</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(event) => setField("description", event.target.value)}
                    placeholder="Mutasd be, miben tudsz segiteni, milyen tipusu vendegekkel dolgozol, milyen szemleletben tervezel."
                    className="min-h-36 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionFormat">Edzes formatuma</Label>
                  <select
                    id="sessionFormat"
                    value={formData.sessionFormat}
                    onChange={(event) =>
                      setField(
                        "sessionFormat",
                        event.target.value as TrainingFormat | ""
                      )
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Valassz formatumot</option>
                    {TRAINING_FORMAT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxCapacity">Max kapacitas</Label>
                  <Input
                    id="maxCapacity"
                    type="number"
                    min="1"
                    value={formData.maxCapacity}
                    onChange={(event) => setField("maxCapacity", event.target.value)}
                    placeholder="pl. 12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceFrom">Ar -tol</Label>
                  <Input
                    id="priceFrom"
                    type="number"
                    min="0"
                    value={formData.priceFrom}
                    onChange={(event) => setField("priceFrom", event.target.value)}
                    placeholder="pl. 8000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceTo">Ar -ig</Label>
                  <Input
                    id="priceTo"
                    type="number"
                    min="0"
                    value={formData.priceTo}
                    onChange={(event) => setField("priceTo", event.target.value)}
                    placeholder="pl. 15000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Penznem</Label>
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(event) =>
                      setField("currency", event.target.value as Currency | "")
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Valassz penznemet</option>
                    {CURRENCY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="contactNote">Kapcsolatfelveteli megjegyzes</Label>
                  <textarea
                    id="contactNote"
                    value={formData.contactNote}
                    onChange={(event) => setField("contactNote", event.target.value)}
                    placeholder="pl. milyen celu vendeggel dolgozol szivesen, mennyi valaszido varhato"
                    className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <CalendarDays className="h-5 w-5" />
                        Heti elerhetoseg
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                {formData.availability.map((slot) => (
                  <div
                    key={slot.dayOfWeek}
                    className="grid gap-3 rounded-xl border bg-background p-4 md:grid-cols-[140px_120px_1fr_1fr]"
                  >
                    <label className="flex items-center gap-3 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={slot.enabled}
                        onChange={(event) =>
                          setAvailabilityField(
                            slot.dayOfWeek,
                            "enabled",
                            event.target.checked
                          )
                        }
                      />
                      {slot.label}
                    </label>

                    <Badge variant={slot.enabled ? "default" : "outline"} className="w-fit">
                      {slot.enabled ? "Elerheto" : "Nem vallal"}
                    </Badge>

                    <div className="space-y-2">
                      <Label htmlFor={`${slot.dayOfWeek}-from`}>Kezdes</Label>
                      <Input
                        id={`${slot.dayOfWeek}-from`}
                        type="time"
                        disabled={!slot.enabled}
                        value={slot.from}
                        onChange={(event) =>
                          setAvailabilityField(slot.dayOfWeek, "from", event.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${slot.dayOfWeek}-until`}>Vege</Label>
                      <Input
                        id={`${slot.dayOfWeek}-until`}
                        type="time"
                        disabled={!slot.enabled}
                        value={slot.until}
                        onChange={(event) =>
                          setAvailabilityField(slot.dayOfWeek, "until", event.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <FileText className="h-5 w-5" />
                        Oklevelek es igazolasok
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certificates">PDF feltoltes</Label>
                  <Input
                    id="certificates"
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={handlePdfSelection}
                  />
                  <p className="text-xs text-muted-foreground">
                    A fajlfeltoltes UI mar keszen van. A tenyleges szerveroldali PDF tarolas a
                    backend endpoint bekotesevel lesz aktiv.
                  </p>
                </div>

                {allCertificateNames.length > 0 ? (
                  <div className="grid gap-2">
                    {allCertificateNames.map((certificate) => (
                      <div
                        key={certificate}
                        className="rounded-lg border bg-muted/30 px-3 py-2 text-sm"
                      >
                        {certificate}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
                    Meg nem valasztottal ki PDF oklevelet.
                  </div>
                )}
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-3">
                    {hasTrainerProfile && (
                      <Button variant="outline" onClick={cancelEditing}>
                        Megse
                      </Button>
                    )}
                    <Button
                      onClick={() => void saveTrainerProfile()}
                      disabled={!canSave || saving}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Mentes..." : primaryActionLabel}
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Users className="h-5 w-5" />
                        Nyilvanos osszefoglalo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="font-medium">Leiras</p>
                  <p className="mt-2 text-muted-foreground">
                    {formData.description || "Itt fog megjelenni a bemutatkozasod a felhasznaloknak."}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="font-medium">Edzoskodes kezdete</p>
                  <p className="mt-2 text-muted-foreground">
                    {formData.startedCoachingAt || "Meg nincs megadva."}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="font-medium">Edzes tipus</p>
                  <p className="mt-2 text-muted-foreground">
                    {TRAINING_FORMAT_OPTIONS.find(
                      (option) => option.value === formData.sessionFormat
                    )?.label || "Meg nincs megadva."}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="font-medium">Arsav</p>
                  <p className="mt-2 text-muted-foreground">
                    {formData.priceFrom || formData.priceTo
                      ? `${formData.priceFrom || "0"} - ${formData.priceTo || "0"} ${formData.currency || ""}`
                      : "Meg nincs megadva."}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="font-medium">Max kapacitas</p>
                  <p className="mt-2 text-muted-foreground">
                    {formData.maxCapacity
                      ? `${formData.maxCapacity} egyideju ugyfel`
                      : "Meg nincs megadva."}
                  </p>
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="font-medium">Aktiv napok</p>
                  <p className="mt-2 text-muted-foreground">
                    {formData.availability
                      .filter((slot) => slot.enabled)
                      .map((slot) => `${slot.label} ${slot.from}-${slot.until}`)
                      .join(", ") || "Meg nincs aktiv nap beallitva."}
                  </p>
                </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full shadow-xl border-t-4 border-t-primary">
            <CardHeader className="py-4 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" /> Edzoi profil
                </CardTitle>
                <Badge variant="secondary">Kitoltve</Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Shield className="w-3 h-3" /> Alapadatok
                    </h3>
                    <ProfileField
                      label="Edzoskodes kezdete"
                      value={formData.startedCoachingAt || "-"}
                    />
                    <ProfileField
                      label="Edzes formatuma"
                      value={
                        TRAINING_FORMAT_OPTIONS.find(
                          (option) => option.value === formData.sessionFormat
                        )?.label ?? "-"
                      }
                    />
                    <ProfileField
                      label="Kapacitas"
                      value={
                        formData.maxCapacity
                          ? `${formData.maxCapacity} egyideju ugyfel`
                          : "-"
                      }
                    />
                    <ProfileField
                      label="Arsav"
                      value={
                        formData.priceFrom || formData.priceTo
                          ? `${formData.priceFrom || "0"} - ${formData.priceTo || "0"} ${formData.currency || ""}`
                          : "-"
                      }
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Users className="w-3 h-3" /> Nyilvanos adatok
                    </h3>
                    <ProfileField label="Leiras" value={formData.description || "-"} />
                    <ProfileField
                      label="Kapcsolatfelveteli megjegyzes"
                      value={formData.contactNote || "-"}
                    />
                    <ProfileField
                      label="Aktiv napok"
                      value={
                        formData.availability
                          .filter((slot) => slot.enabled)
                          .map((slot) => `${slot.label} ${slot.from}-${slot.until}`)
                          .join(", ") || "-"
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            <div className="border-t bg-slate-50/50 py-4 px-6">
              <div className="flex w-full justify-end">
                <Button onClick={startEditing} className="font-bold">
                  <Edit3 className="mr-2 w-4 h-4" />
                  Modositas
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
