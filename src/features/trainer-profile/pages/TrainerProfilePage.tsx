import type { ChangeEvent } from "react";
import ProfileField from "@/features/profile/components/ProfileField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/lib/api-client";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  Download,
  Edit3,
  FileText,
  Save,
  Shield,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrainerProfileForm } from "../hooks/useTrainerProfileForm";
import type {
  Currency,
  TrainerCertificate,
  TrainingFormat,
} from "../types/trainer-profile.types";

const TRAINING_FORMAT_OPTIONS = [
  { value: "ONLINE", label: "Online" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "IN_PERSON", label: "In person" },
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
  const [selectedPdfFiles, setSelectedPdfFiles] = useState<File[]>([]);
  const [selectedPdfNames, setSelectedPdfNames] = useState<string[]>([]);

  const allCertificateNames = useMemo(
    () => [
      ...new Set([
        ...formData.certificates.map((certificate) => certificate.certificateName),
        ...selectedPdfNames,
      ]),
    ],
    [formData.certificates, selectedPdfNames]
  );

  const downloadableCertificates = useMemo(
    () => formData.certificates.filter((certificate) => certificate.fileUrl),
    [formData.certificates]
  );

  const handlePdfSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");
    setSelectedPdfFiles(pdfFiles);
    setSelectedPdfNames(pdfFiles.map((file) => file.name));
  };

  const handleCertificateDownload = (certificate: TrainerCertificate) => {
    if (!certificate.fileUrl) {
      return;
    }

    const fileUrl = /^https?:\/\//i.test(certificate.fileUrl)
      ? certificate.fileUrl
      : `${API_BASE_URL}${certificate.fileUrl.startsWith("/") ? "" : "/"}${certificate.fileUrl}`;

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return <div className="flex justify-center p-10 italic">Loading trainer profile...</div>;
  }

  const showForm = !hasTrainerProfile || isEditing;
  const primaryActionLabel = hasTrainerProfile ? "Save changes" : "Create trainer profile";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-start px-4 pb-6 pt-2">
      <div className="w-full max-w-5xl space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/profile")}
          className="w-fit text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-3 w-3" />
          Back to profile
        </Button>

        {errorMessage && (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-4 text-sm text-red-700">{errorMessage}</CardContent>
          </Card>
        )}

        {statusMessage && (
          <Card className="border-emerald-300 bg-emerald-50">
            <CardContent className="p-4 text-sm">{statusMessage}</CardContent>
          </Card>
        )}

        {showForm ? (
          <Card className="border-t-4 border-t-primary shadow-lg">
            <CardHeader className="mb-2 border-b py-3">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Briefcase className="h-5 w-5" />
                  {hasTrainerProfile ? "Edit trainer profile" : "Create trainer profile"}
                </CardTitle>
                <Badge variant="secondary" className="capitalize">
                  Trainer profile
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
                        Introduction and coaching setup
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="startedCoachingAt">When did you start coaching?</Label>
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
                        <Label htmlFor="description">Short description</Label>
                        <textarea
                          id="description"
                          value={formData.description}
                          onChange={(event) => setField("description", event.target.value)}
                          placeholder="Describe how you help clients, what kind of people you work with, and your coaching approach."
                          className="min-h-36 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sessionFormat">Training format</Label>
                        <select
                          id="sessionFormat"
                          value={formData.sessionFormat}
                          onChange={(event) =>
                            setField("sessionFormat", event.target.value as TrainingFormat | "")
                          }
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="">Select a format</option>
                          {TRAINING_FORMAT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxCapacity">Maximum capacity</Label>
                        <Input
                          id="maxCapacity"
                          type="number"
                          min="1"
                          value={formData.maxCapacity}
                          onChange={(event) => setField("maxCapacity", event.target.value)}
                          placeholder="e.g. 12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priceFrom">Price from</Label>
                        <Input
                          id="priceFrom"
                          type="number"
                          min="0"
                          value={formData.priceFrom}
                          onChange={(event) => setField("priceFrom", event.target.value)}
                          placeholder="e.g. 8000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priceTo">Price to</Label>
                        <Input
                          id="priceTo"
                          type="number"
                          min="0"
                          value={formData.priceTo}
                          onChange={(event) => setField("priceTo", event.target.value)}
                          placeholder="e.g. 15000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <select
                          id="currency"
                          value={formData.currency}
                          onChange={(event) =>
                            setField("currency", event.target.value as Currency | "")
                          }
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="">Select a currency</option>
                          {CURRENCY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="contactNote">Contact note</Label>
                        <textarea
                          id="contactNote"
                          value={formData.contactNote}
                          onChange={(event) => setField("contactNote", event.target.value)}
                          placeholder="e.g. what kind of clients you prefer to work with and your expected response time"
                          className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <CalendarDays className="h-5 w-5" />
                        Weekly availability
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
                            {slot.enabled ? "Available" : "Unavailable"}
                          </Badge>

                          <div className="space-y-2">
                            <Label htmlFor={`${slot.dayOfWeek}-from`}>Start</Label>
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
                            <Label htmlFor={`${slot.dayOfWeek}-until`}>End</Label>
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
                        Certificates and documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="certificates">Upload PDF files</Label>
                        <Input
                          id="certificates"
                          type="file"
                          accept="application/pdf"
                          multiple
                          onChange={handlePdfSelection}
                        />
                        <p className="text-xs text-muted-foreground">
                          Upload selected certificate PDFs for your public trainer profile.
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
                          No PDF certificates selected yet.
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Uploaded certificates</Label>
                        {downloadableCertificates.length > 0 ? (
                          <div className="grid gap-2">
                            {downloadableCertificates.map((certificate) => (
                              <div
                                key={certificate.id}
                                className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2"
                              >
                                <div className="min-w-0 text-sm">
                                  <p className="truncate font-medium">
                                    {certificate.certificateName}
                                  </p>
                                  {certificate.issuer || certificate.issuedAt ? (
                                    <p className="truncate text-xs text-muted-foreground">
                                      {[certificate.issuer, certificate.issuedAt]
                                        .filter(Boolean)
                                        .join(" | ")}
                                    </p>
                                  ) : null}
                                </div>

                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCertificateDownload(certificate)}
                                  className="shrink-0 gap-2"
                                >
                                  <Download className="h-4 w-4" />
                                  Download
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
                            No uploaded certificates are available for this profile yet.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-3">
                    {hasTrainerProfile && (
                      <Button variant="outline" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    )}
                    <Button
                      onClick={async () => {
                        const saved = await saveTrainerProfile(selectedPdfFiles);
                        if (saved) {
                          setSelectedPdfFiles([]);
                          setSelectedPdfNames([]);
                        }
                      }}
                      disabled={!canSave || saving}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : primaryActionLabel}
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Users className="h-5 w-5" />
                        Public summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div className="rounded-xl border bg-muted/30 p-4">
                        <p className="font-medium">Description</p>
                        <p className="mt-2 text-muted-foreground">
                          {formData.description || "Your introduction will appear here for users."}
                        </p>
                      </div>

                      <div className="rounded-xl border bg-muted/30 p-4">
                        <p className="font-medium">Coaching since</p>
                        <p className="mt-2 text-muted-foreground">
                          {formData.startedCoachingAt || "Not specified yet."}
                        </p>
                      </div>

                      <div className="rounded-xl border bg-muted/30 p-4">
                        <p className="font-medium">Training type</p>
                        <p className="mt-2 text-muted-foreground">
                          {TRAINING_FORMAT_OPTIONS.find(
                            (option) => option.value === formData.sessionFormat
                          )?.label || "Not specified yet."}
                        </p>
                      </div>

                      <div className="rounded-xl border bg-muted/30 p-4">
                        <p className="font-medium">Price range</p>
                        <p className="mt-2 text-muted-foreground">
                          {formData.priceFrom || formData.priceTo
                            ? `${formData.priceFrom || "0"} - ${formData.priceTo || "0"} ${formData.currency || ""}`
                            : "Not specified yet."}
                        </p>
                      </div>

                      <div className="rounded-xl border bg-muted/30 p-4">
                        <p className="font-medium">Maximum capacity</p>
                        <p className="mt-2 text-muted-foreground">
                          {formData.maxCapacity
                            ? `${formData.maxCapacity} active clients`
                            : "Not specified yet."}
                        </p>
                      </div>

                      <div className="rounded-xl border bg-muted/30 p-4">
                        <p className="font-medium">Active days</p>
                        <p className="mt-2 text-muted-foreground">
                          {formData.availability
                            .filter((slot) => slot.enabled)
                            .map((slot) => `${slot.label} ${slot.from}-${slot.until}`)
                            .join(", ") || "No active days selected yet."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full border-t-4 border-t-primary shadow-xl">
            <CardHeader className="border-b py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Trainer profile
                </CardTitle>
                <Badge variant="secondary">Completed</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <Shield className="h-3 w-3" /> Basic information
                    </h3>
                    <ProfileField label="Coaching since" value={formData.startedCoachingAt || "-"} />
                    <ProfileField
                      label="Training format"
                      value={
                        TRAINING_FORMAT_OPTIONS.find(
                          (option) => option.value === formData.sessionFormat
                        )?.label ?? "-"
                      }
                    />
                    <ProfileField
                      label="Capacity"
                      value={
                        formData.maxCapacity
                          ? `${formData.maxCapacity} active clients`
                          : "-"
                      }
                    />
                    <ProfileField
                      label="Price range"
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
                    <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <Users className="h-3 w-3" /> Public information
                    </h3>
                    <ProfileField label="Description" value={formData.description || "-"} />
                    <ProfileField label="Contact note" value={formData.contactNote || "-"} />
                    <ProfileField
                      label="Active days"
                      value={
                        formData.availability
                          .filter((slot) => slot.enabled)
                          .map((slot) => `${slot.label} ${slot.from}-${slot.until}`)
                          .join(", ") || "-"
                      }
                    />
                    <div className="space-y-2 pt-2">
                      <p className="text-sm font-medium">Certificates</p>
                      {downloadableCertificates.length > 0 ? (
                        <div className="grid gap-2">
                          {downloadableCertificates.map((certificate) => (
                            <button
                              key={certificate.id}
                              type="button"
                              onClick={() => handleCertificateDownload(certificate)}
                              className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50"
                            >
                              <span className="truncate">{certificate.certificateName}</span>
                              <Download className="h-4 w-4 shrink-0" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">-</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <div className="border-t bg-slate-50/50 px-6 py-4">
              <div className="flex w-full justify-end">
                <Button onClick={startEditing} className="font-bold">
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
