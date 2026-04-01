import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AccentButton,
  CaloriexPage,
  GlassCard,
  GlassMetric,
  HeroBadge,
  PageHero,
  ReadonlyField,
  SummaryPanel,
} from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_BASE_URL } from "@/lib/api-client";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Edit3,
  FileText,
  Save,
  Shield,
  Sparkles,
  Trash2,
  Users,
  CalendarDays,
} from "lucide-react";
import { useCoachProfileForm } from "../hooks/useCoachProfileForm";
import type {
  CoachCertificate,
  Currency,
  PendingCoachCertificateUpload,
  TrainingFormat,
} from "../types/coach-profile.types";

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

const textareaClassName =
  "min-h-32 w-full rounded-[24px] border border-white/60 bg-white/70 px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none backdrop-blur placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-900/15";
const inputClassName =
  "h-12 rounded-2xl border-white/60 bg-white/70 shadow-sm backdrop-blur focus-visible:ring-slate-900/20";
const selectClassName =
  "h-12 rounded-2xl border-white/60 bg-white/70 shadow-sm backdrop-blur";

const getTrainingFormatLabel = (value: TrainingFormat | "") =>
  TRAINING_FORMAT_OPTIONS.find((option) => option.value === value)?.label ?? "Not set";

const getCurrencyLabel = (value: Currency | "") =>
  CURRENCY_OPTIONS.find((option) => option.value === value)?.label ?? "Not set";

const formatPriceRange = (priceFrom: string, priceTo: string, currency: Currency | "") =>
  priceFrom || priceTo ? `${priceFrom || "0"} - ${priceTo || "0"} ${currency || ""}` : "Not set";

export default function CoachProfilePage() {
  const navigate = useNavigate();
  const {
    formData,
    loading,
    saving,
    deletingCertificateId,
    statusMessage,
    errorMessage,
    isForbidden,
    hasCoachProfile,
    isEditing,
    setField,
    setAvailabilityField,
    saveCoachProfile,
    deleteCertificate,
    startEditing,
    cancelEditing,
    canSave,
  } = useCoachProfileForm();
  const [pendingCertificates, setPendingCertificates] = useState<
    PendingCoachCertificateUpload[]
  >([]);

  const downloadableCertificates = useMemo(
    () => formData.certificates.filter((certificate) => certificate.fileUrl),
    [formData.certificates]
  );

  const activeAvailability = useMemo(
    () =>
      formData.availability
        .filter((slot) => slot.enabled)
        .map((slot) => `${slot.label} ${slot.from}-${slot.until}`),
    [formData.availability]
  );

  const handlePdfSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const pdfFiles = files.filter((file) => {
      const isPdfType = file.type === "application/pdf" || !file.type;
      const hasPdfExtension = /\.pdf$/i.test(file.name);
      return isPdfType && hasPdfExtension;
    });

    if (files.length > 0 && pdfFiles.length !== files.length) {
      window.alert("Only PDF files can be uploaded as certificates.");
    }

    const nextCertificates = pdfFiles.map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${index}`,
      file,
      certificateName: file.name.replace(/\.pdf$/i, ""),
      issuer: "",
      issuedAt: "",
    }));

    setPendingCertificates(nextCertificates);
    event.target.value = "";
  };

  const updatePendingCertificate = (
    id: string,
    key: keyof Omit<PendingCoachCertificateUpload, "id" | "file">,
    value: string
  ) => {
    setPendingCertificates((prev) =>
      prev.map((certificate) =>
        certificate.id === id ? { ...certificate, [key]: value } : certificate
      )
    );
  };

  const handleCertificateDownload = (certificate: CoachCertificate) => {
    if (!certificate.fileUrl) return;

    const fileUrl = /^https?:\/\//i.test(certificate.fileUrl)
      ? certificate.fileUrl
      : `${API_BASE_URL}${certificate.fileUrl.startsWith("/") ? "" : "/"}${certificate.fileUrl}`;

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <CaloriexPage>
        <section className="container mx-auto px-6 py-16">
          <GlassCard>
            <CardContent className="p-6 text-sm italic text-slate-600">
              Loading coach profile workspace...
            </CardContent>
          </GlassCard>
        </section>
      </CaloriexPage>
    );
  }

  if (isForbidden) {
    return (
      <CaloriexPage>
        <section className="container mx-auto px-6 py-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="mb-4 w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to profile
          </Button>
          <GlassCard className="border-red-300/70 bg-red-50/70">
            <CardContent className="p-6 text-sm text-red-700">
              {errorMessage ?? "Forbidden"}
            </CardContent>
          </GlassCard>
        </section>
      </CaloriexPage>
    );
  }

  const showForm = !hasCoachProfile || isEditing;
  const primaryActionLabel = hasCoachProfile ? "Save changes" : "Create coach profile";
  const trainingFormatLabel = getTrainingFormatLabel(formData.sessionFormat);
  const priceRange = formatPriceRange(
    formData.priceFrom,
    formData.priceTo,
    formData.currency
  );
  const pendingCertificatesValid = pendingCertificates.every(
    (certificate) => certificate.certificateName.trim().length > 0
  );

  return (
    <CaloriexPage>
      <PageHero
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to profile
          </Button>
        }
        badge={<HeroBadge>Coach profile</HeroBadge>}
        title="Shape the public coach profile users will trust before they send a request."
        description="Your coaching setup, active availability, pricing, and certificate evidence now live in the same CalorieX design system as the rest of the app."
        chips={[
          hasCoachProfile ? "Profile exists" : "New coach setup",
          isEditing || !hasCoachProfile ? "Editing mode" : "Preview mode",
          `${activeAvailability.length} active day${activeAvailability.length === 1 ? "" : "s"}`,
        ]}
        aside={
          <GlassCard className="overflow-hidden">
            <CardContent className="grid gap-4 p-6">
              <GlassMetric
                label="Capacity"
                value={formData.maxCapacity ? `${formData.maxCapacity}` : "-"}
                description="Maximum active clients you want to handle."
              />
              <GlassMetric
                label="Format"
                value={trainingFormatLabel}
                description="How your sessions are typically delivered."
              />
              <GlassMetric
                label="Certificates"
                value={`${downloadableCertificates.length + pendingCertificates.length}`}
                description="Uploaded or currently staged proof documents."
              />
            </CardContent>
          </GlassCard>
        }
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        {errorMessage ? (
          <GlassCard className="mb-6 border-red-300/70 bg-red-50/70">
            <CardContent className="p-4 text-sm text-red-700">{errorMessage}</CardContent>
          </GlassCard>
        ) : null}

        {statusMessage ? (
          <GlassCard className="mb-6 border-emerald-300/70 bg-emerald-50/70">
            <CardContent className="p-4 text-sm text-emerald-800">{statusMessage}</CardContent>
          </GlassCard>
        ) : null}

        {showForm ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_360px]">
            <div className="space-y-6">
              <SummaryPanel
                eyebrow="Positioning"
                title="Introduction and coaching setup"
                icon={Shield}
              >
                <div className="grid gap-5 p-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startedCoachingAt" className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      When did you start coaching?
                    </Label>
                    <Input
                      id="startedCoachingAt"
                      type="date"
                      value={formData.startedCoachingAt}
                      onChange={(event) => setField("startedCoachingAt", event.target.value)}
                      className={inputClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionFormat" className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Training format
                    </Label>
                    <Select
                      value={formData.sessionFormat}
                      onValueChange={(value) =>
                        setField("sessionFormat", value as TrainingFormat | "")
                      }
                    >
                      <SelectTrigger id="sessionFormat" className={selectClassName}>
                        <SelectValue placeholder="Select a format" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRAINING_FORMAT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description" className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Short description
                    </Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(event) => setField("description", event.target.value)}
                      placeholder="Describe how you help clients, what kind of people you work with, and your coaching approach."
                      className={textareaClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxCapacity" className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Maximum capacity
                    </Label>
                    <Input
                      id="maxCapacity"
                      type="number"
                      min="1"
                      value={formData.maxCapacity}
                      onChange={(event) => setField("maxCapacity", event.target.value)}
                      placeholder="e.g. 12"
                      className={inputClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Currency
                    </Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setField("currency", value as Currency | "")}
                    >
                      <SelectTrigger id="currency" className={selectClassName}>
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceFrom" className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Price from
                    </Label>
                    <Input
                      id="priceFrom"
                      type="number"
                      min="0"
                      value={formData.priceFrom}
                      onChange={(event) => setField("priceFrom", event.target.value)}
                      placeholder="e.g. 8000"
                      className={inputClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceTo" className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Price to
                    </Label>
                    <Input
                      id="priceTo"
                      type="number"
                      min="0"
                      value={formData.priceTo}
                      onChange={(event) => setField("priceTo", event.target.value)}
                      placeholder="e.g. 15000"
                      className={inputClassName}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="contactNote" className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Contact note
                    </Label>
                    <textarea
                      id="contactNote"
                      value={formData.contactNote}
                      onChange={(event) => setField("contactNote", event.target.value)}
                      placeholder="What kind of clients you prefer to work with and your expected response time."
                      className={textareaClassName}
                    />
                  </div>
                </div>
              </SummaryPanel>

              <SummaryPanel eyebrow="Schedule" title="Weekly availability" icon={CalendarDays}>
                <div className="grid gap-4 p-6">
                  {formData.availability.map((slot) => (
                    <div
                      key={slot.dayOfWeek}
                      className="cx-glass-block grid gap-4 rounded-[26px] p-4 md:grid-cols-[160px_130px_1fr_1fr]"
                    >
                      <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
                        <input
                          type="checkbox"
                          checked={slot.enabled}
                          onChange={(event) =>
                            setAvailabilityField(slot.dayOfWeek, "enabled", event.target.checked)
                          }
                        />
                        {slot.label}
                      </label>

                      <Badge variant={slot.enabled ? "default" : "outline"} className="w-fit rounded-full">
                        {slot.enabled ? "Available" : "Unavailable"}
                      </Badge>

                      <div className="space-y-2">
                        <Label htmlFor={`${slot.dayOfWeek}-from`} className="text-xs uppercase tracking-[0.24em] text-slate-500">
                          Start
                        </Label>
                        <Input
                          id={`${slot.dayOfWeek}-from`}
                          type="time"
                          disabled={!slot.enabled}
                          value={slot.from}
                          onChange={(event) =>
                            setAvailabilityField(slot.dayOfWeek, "from", event.target.value)
                          }
                          className={inputClassName}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${slot.dayOfWeek}-until`} className="text-xs uppercase tracking-[0.24em] text-slate-500">
                          End
                        </Label>
                        <Input
                          id={`${slot.dayOfWeek}-until`}
                          type="time"
                          disabled={!slot.enabled}
                          value={slot.until}
                          onChange={(event) =>
                            setAvailabilityField(slot.dayOfWeek, "until", event.target.value)
                          }
                          className={inputClassName}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SummaryPanel>
            </div>

            <div className="space-y-6">
              <SummaryPanel eyebrow="Documents" title="Certificates and documents" icon={FileText}>
                <div className="space-y-4 p-6">
                  <div className="space-y-2">
                    <Label htmlFor="certificates" className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Upload PDF files
                    </Label>
                    <Input
                      id="certificates"
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={handlePdfSelection}
                      className={inputClassName}
                    />
                    <p className="text-xs text-slate-500">
                      Upload selected certificate PDFs for your public coach profile.
                    </p>
                  </div>

                  {pendingCertificates.length > 0 ? (
                    <div className="grid gap-3">
                      {pendingCertificates.map((certificate) => (
                        <div
                          key={certificate.id}
                          className="cx-glass-block grid gap-4 rounded-[26px] p-4"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-slate-900">
                              {certificate.certificateName}
                            </p>
                            <p className="text-xs text-slate-500">
                              Source file: {certificate.file.name}
                            </p>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`certificate-name-${certificate.id}`} className="text-xs uppercase tracking-[0.24em] text-slate-500">
                                Certificate name
                              </Label>
                              <Input
                                id={`certificate-name-${certificate.id}`}
                                value={certificate.certificateName}
                                onChange={(event) =>
                                  updatePendingCertificate(
                                    certificate.id,
                                    "certificateName",
                                    event.target.value
                                  )
                                }
                                placeholder="e.g. NASM Certified Coach"
                                className={inputClassName}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`certificate-issuer-${certificate.id}`} className="text-xs uppercase tracking-[0.24em] text-slate-500">
                                Issuer
                              </Label>
                              <Input
                                id={`certificate-issuer-${certificate.id}`}
                                value={certificate.issuer}
                                onChange={(event) =>
                                  updatePendingCertificate(
                                    certificate.id,
                                    "issuer",
                                    event.target.value
                                  )
                                }
                                placeholder="e.g. NASM"
                                className={inputClassName}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`certificate-issued-at-${certificate.id}`} className="text-xs uppercase tracking-[0.24em] text-slate-500">
                                Issued at
                              </Label>
                              <Input
                                id={`certificate-issued-at-${certificate.id}`}
                                type="date"
                                value={certificate.issuedAt}
                                onChange={(event) =>
                                  updatePendingCertificate(
                                    certificate.id,
                                    "issuedAt",
                                    event.target.value
                                  )
                                }
                                className={inputClassName}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-white/70 bg-white/35 px-4 py-5 text-sm text-slate-500">
                      No PDF certificates selected yet.
                    </div>
                  )}

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Uploaded certificates
                    </p>
                    {downloadableCertificates.length > 0 ? (
                      <div className="grid gap-3">
                        {downloadableCertificates.map((certificate) => (
                          <div
                            key={certificate.id}
                            className="cx-glass-block flex items-center justify-between gap-3 rounded-[22px] px-4 py-3"
                          >
                            <div className="min-w-0 text-sm">
                              <p className="truncate font-medium text-slate-900">
                                {certificate.certificateName}
                              </p>
                              {certificate.issuer || certificate.issuedAt ? (
                                <p className="truncate text-xs text-slate-500">
                                  {[certificate.issuer, certificate.issuedAt]
                                    .filter(Boolean)
                                    .join(" | ")}
                                </p>
                              ) : null}
                            </div>

                            <div className="ml-auto flex shrink-0 items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleCertificateDownload(certificate)}
                                disabled={saving || deletingCertificateId === certificate.id}
                                className="gap-2 rounded-full border-white/70 bg-white/70"
                              >
                                <Download className="h-4 w-4" />
                                Download
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => void deleteCertificate(certificate.id)}
                                disabled={saving || deletingCertificateId !== null}
                                className="gap-2 rounded-full"
                              >
                                <Trash2 className="h-4 w-4" />
                                {deletingCertificateId === certificate.id ? "Deleting..." : "Delete"}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-white/70 bg-white/35 px-4 py-5 text-sm text-slate-500">
                        No uploaded certificates are available for this profile yet.
                      </div>
                    )}
                  </div>
                </div>
              </SummaryPanel>

              <SummaryPanel eyebrow="Preview" title="Public summary" icon={Users}>
                <div className="space-y-4 p-6">
                  <ReadonlyField label="Description" value={formData.description} fallback="Your introduction will appear here for users." />
                  <ReadonlyField label="Coaching since" value={formData.startedCoachingAt} fallback="Not specified yet." />
                  <ReadonlyField label="Training type" value={trainingFormatLabel} fallback="Not specified yet." />
                  <ReadonlyField label="Price range" value={priceRange} fallback="Not specified yet." />
                  <ReadonlyField
                    label="Maximum capacity"
                    value={formData.maxCapacity ? `${formData.maxCapacity} active clients` : ""}
                    fallback="Not specified yet."
                  />
                  <ReadonlyField
                    label="Active days"
                    value={activeAvailability.join(", ")}
                    fallback="No active days selected yet."
                  />
                </div>
              </SummaryPanel>

              <GlassCard className="overflow-hidden">
                <CardContent className="space-y-4 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Save flow
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                      Publish your coach-facing details
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Keep your public summary, availability, and supporting documents in
                      sync before users start sending requests.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <ReadonlyField
                      label="Mode"
                      value={hasCoachProfile ? "Update existing profile" : "Create new profile"}
                      fallback="Not set"
                    />
                    <ReadonlyField
                      label="Certificates staged"
                      value={pendingCertificates.length}
                      fallback="0"
                    />
                    <ReadonlyField
                      label="Currency"
                      value={getCurrencyLabel(formData.currency)}
                      fallback="Not set"
                    />
                  </div>

                  <div className="space-y-3">
                    {hasCoachProfile ? (
                      <Button
                        variant="outline"
                        onClick={cancelEditing}
                        className="w-full rounded-2xl border-white/70 bg-white/70"
                      >
                        Cancel
                      </Button>
                    ) : null}

                    <AccentButton
                      tone={canSave ? "emerald" : "sky"}
                      onClick={async () => {
                        const saved = await saveCoachProfile(pendingCertificates);
                        if (saved) {
                          setPendingCertificates([]);
                        }
                      }}
                      disabled={
                        !canSave ||
                        saving ||
                        deletingCertificateId !== null ||
                        !pendingCertificatesValid
                      }
                      className="justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        {saving ? "Saving..." : primaryActionLabel}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </AccentButton>
                  </div>
                </CardContent>
              </GlassCard>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
            <div className="space-y-6">
              <GlassCard className="overflow-hidden border-white/70">
                <div className="border-b border-white/60 bg-gradient-to-r from-sky-100/80 via-white/40 to-emerald-100/80 p-6 md:p-8">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge
                          variant="outline"
                          className="border-sky-300/60 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-700"
                        >
                          Coach profile
                        </Badge>
                        <Badge variant="secondary" className="rounded-full px-3 py-1">
                          Completed
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                          Public coaching profile
                        </h2>
                        <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                          This is the summary users see when evaluating whether to work
                          with you.
                        </p>
                      </div>
                    </div>

                    <div className="cx-glass-block rounded-[28px] p-5 lg:max-w-xs">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                        Live profile status
                      </p>
                      <p className="mt-3 text-3xl font-semibold text-slate-950">Ready</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Your coach-facing details are already saved and available to edit.
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
                  <GlassMetric
                    label="Format"
                    value={trainingFormatLabel}
                    description="Main delivery style shown to users."
                  />
                  <GlassMetric
                    label="Price range"
                    value={priceRange}
                    description="Displayed pricing envelope for your service."
                  />
                  <GlassMetric
                    label="Active days"
                    value={`${activeAvailability.length}`}
                    description="Days where users can expect coaching availability."
                  />
                </CardContent>
              </GlassCard>

              <SummaryPanel eyebrow="Offer" title="Basic information" icon={Shield}>
                <div className="grid gap-4 p-6 md:grid-cols-2">
                  <ReadonlyField label="Coaching since" value={formData.startedCoachingAt} fallback="-" />
                  <ReadonlyField label="Training format" value={trainingFormatLabel} fallback="-" />
                  <ReadonlyField
                    label="Capacity"
                    value={formData.maxCapacity ? `${formData.maxCapacity} active clients` : ""}
                    fallback="-"
                  />
                  <ReadonlyField label="Price range" value={priceRange} fallback="-" />
                </div>
              </SummaryPanel>

              <SummaryPanel eyebrow="Public info" title="What users will read" icon={Users}>
                <div className="grid gap-4 p-6">
                  <ReadonlyField label="Description" value={formData.description} fallback="-" />
                  <ReadonlyField label="Contact note" value={formData.contactNote} fallback="-" />
                  <ReadonlyField
                    label="Active days"
                    value={activeAvailability.join(", ")}
                    fallback="-"
                  />
                </div>
              </SummaryPanel>
            </div>

            <div className="space-y-6">
              <SummaryPanel eyebrow="Documents" title="Certificates" icon={FileText}>
                <div className="space-y-3 p-6">
                  {downloadableCertificates.length > 0 ? (
                    downloadableCertificates.map((certificate) => (
                      <button
                        key={certificate.id}
                        type="button"
                        onClick={() => handleCertificateDownload(certificate)}
                        className="cx-glass-block flex w-full items-center justify-between gap-3 rounded-[22px] px-4 py-3 text-left text-sm transition-transform hover:-translate-y-0.5"
                      >
                        <span className="truncate font-medium text-slate-900">
                          {certificate.certificateName}
                        </span>
                        <Download className="h-4 w-4 shrink-0 text-slate-500" />
                      </button>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-white/70 bg-white/35 px-4 py-5 text-sm text-slate-500">
                      No certificates uploaded yet.
                    </div>
                  )}
                </div>
              </SummaryPanel>

              <GlassCard className="overflow-hidden">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-cyan-300/50 bg-cyan-100/70 p-3 text-slate-700">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                        Next step
                      </p>
                      <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                        Refine your offer
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-slate-600">
                    Reopen the editor whenever your schedule, positioning, or pricing
                    changes.
                  </p>

                  <AccentButton tone="sky" onClick={startEditing} className="justify-between">
                    <span className="flex items-center gap-2">
                      <Edit3 className="h-4 w-4" />
                      Edit coach profile
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </AccentButton>
                </CardContent>
              </GlassCard>
            </div>
          </div>
        )}
      </section>
    </CaloriexPage>
  );
}
