import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownToLine,
  ArrowRightLeft,
  ArrowUpRight,
  Dumbbell,
  Flame,
  Orbit,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type HomeFeature = {
  title: string;
  description: string;
  eyebrow: string;
  accentClassName: string;
  surfaceClassName: string;
  glowClassName: string;
  badgeClassName: string;
  iconWrapClassName: string;
  ctaClassName: string;
  signal: string;
  points: string[];
  path: string;
  icon: typeof Dumbbell;
};

const HOME_FEATURES: HomeFeature[] = [
  {
    title: "Find a Coach",
    description: "Choose a coach and request a personalized training plan for your goals.",
    eyebrow: "Coaching",
    accentClassName: "from-emerald-400/30 via-cyan-300/10 to-slate-950/0",
    surfaceClassName: "border-emerald-300/40 bg-white/60",
    glowClassName: "bg-emerald-400/20",
    badgeClassName: "border-emerald-400/40 bg-emerald-200/50 text-emerald-950",
    iconWrapClassName: "border-emerald-300/50 bg-emerald-100/70 text-emerald-950",
    ctaClassName:
      "border-emerald-300/50 bg-emerald-100/80 text-emerald-950 hover:bg-emerald-200/90",
    signal: "Custom guidance",
    points: ["Browse coaches", "Start a request", "Get a tailored plan"],
    path: "/training-request",
    icon: Dumbbell,
  },
  {
    title: "Calorie Tracking",
    description: "Set a daily target, follow your meals, and keep your nutrition aligned.",
    eyebrow: "Nutrition",
    accentClassName: "from-rose-300/30 via-amber-300/10 to-slate-950/0",
    surfaceClassName: "border-rose-300/40 bg-white/60",
    glowClassName: "bg-rose-300/20",
    badgeClassName: "border-rose-400/40 bg-rose-200/50 text-rose-950",
    iconWrapClassName: "border-rose-300/50 bg-rose-100/75 text-rose-950",
    ctaClassName:
      "border-rose-300/50 bg-rose-100/80 text-rose-950 hover:bg-rose-200/90",
    signal: "Daily awareness",
    points: ["Track meals", "Watch calories", "Follow macro targets"],
    path: "/calorie-counter",
    icon: Flame,
  },
  {
    title: "Training Requests",
    description: "Track the status of incoming or sent requests and manage active plan flows.",
    eyebrow: "Workflow",
    accentClassName: "from-violet-300/30 via-sky-300/10 to-slate-950/0",
    surfaceClassName: "border-violet-300/40 bg-white/60",
    glowClassName: "bg-violet-300/20",
    badgeClassName: "border-violet-400/40 bg-violet-200/50 text-violet-950",
    iconWrapClassName: "border-violet-300/50 bg-violet-100/75 text-violet-950",
    ctaClassName:
      "border-violet-300/50 bg-violet-100/80 text-violet-950 hover:bg-violet-200/90",
    signal: "Request control",
    points: ["See request statuses", "Manage uploads", "Stay in sync with users"],
    path: "/training-requests",
    icon: ArrowRightLeft,
  },
  {
    title: "Community Plans",
    description: "Download ready-made maintenance, weight loss, and bulk PDF plans instantly.",
    eyebrow: "Library",
    accentClassName: "from-sky-300/30 via-cyan-300/15 to-slate-950/0",
    surfaceClassName: "border-sky-300/40 bg-white/60",
    glowClassName: "bg-sky-300/20",
    badgeClassName: "border-sky-400/40 bg-sky-200/55 text-sky-950",
    iconWrapClassName: "border-sky-300/50 bg-sky-100/80 text-sky-950",
    ctaClassName:
      "border-sky-300/50 bg-sky-100/80 text-sky-950 hover:bg-sky-200/90",
    signal: "Instant access",
    points: ["Maintenance track", "Weight loss track", "Muscle gain track"],
    path: "/community-training-plans",
    icon: ArrowDownToLine,
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f7fb] text-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(110,231,183,0.22),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(125,211,252,0.18),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.82),_rgba(239,246,255,0.94))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
      <div className="absolute left-[8%] top-24 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="absolute right-[12%] top-10 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />

      <section className="relative border-b border-white/40">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.95fr] lg:items-end">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-cyan-300/40 bg-white/65 px-4 py-1 text-[11px] uppercase tracking-[0.35em] text-slate-700 backdrop-blur">
                CalorieX platform
              </div>

              <div className="space-y-4">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-slate-950 md:text-7xl">
                  Training, nutrition, and coaching in one clean flow.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                  Build better routines with coach requests, calorie tracking, and instant-access
                  community plans designed around real fitness goals.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
                  Personalized coaching
                </div>
                <div className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
                  Goal-based nutrition
                </div>
                <div className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
                  Community downloads
                </div>
              </div>
            </div>

            <Card className="overflow-hidden border-white/50 bg-white/55 shadow-[0_20px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur-xl">
              <CardContent className="p-0">
                <div className="border-b border-white/50 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                        System overview
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                        Core experience
                      </h2>
                    </div>
                    <div className="rounded-full border border-cyan-300/40 bg-cyan-100/60 p-3 text-slate-700">
                      <Orbit className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/60 bg-white/65 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Modules</p>
                    <p className="mt-3 text-3xl font-semibold">04</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Coaching, nutrition, requests, and public training plans.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/60 bg-white/65 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Focus</p>
                    <p className="mt-3 text-3xl font-semibold">Progress</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Everything on the home page leads directly into action.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {HOME_FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="group relative overflow-hidden border-white/60 bg-white/50 shadow-[0_22px_70px_-28px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_90px_-28px_rgba(15,23,42,0.4)]"
              >
                <div className={`absolute inset-x-8 top-6 h-24 rounded-full blur-3xl ${feature.glowClassName}`} />

                <button
                  type="button"
                  onClick={() => navigate(feature.path)}
                  className="relative w-full cursor-pointer text-left"
                >
                  <div className={`bg-gradient-to-br p-5 ${feature.accentClassName}`}>
                    <div
                      className={`rounded-[28px] border p-5 shadow-sm backdrop-blur-xl ${feature.surfaceClassName}`}
                    >
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-[0.32em] text-slate-500">
                            {feature.eyebrow}
                          </p>
                          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                            {feature.title}
                          </h2>
                        </div>
                        <div
                          className={`rounded-2xl border p-3 shadow-sm backdrop-blur ${feature.iconWrapClassName}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-white/60 bg-white/60 p-5">
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                              Signal
                            </p>
                            <p className="mt-2 text-lg font-semibold text-slate-900">
                              {feature.signal}
                            </p>
                          </div>
                          <Sparkles className="h-5 w-5 text-slate-500" />
                        </div>

                        <p className="text-sm leading-7 text-slate-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className={`w-fit rounded-full border px-3 py-1 text-xs font-medium backdrop-blur ${feature.badgeClassName}`}
                      >
                        {feature.eyebrow}
                      </div>
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        Start here
                      </span>
                    </div>

                    <CardTitle className="text-2xl tracking-tight text-slate-950">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid gap-3">
                      {feature.points.map((point) => (
                        <div
                          key={point}
                          className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-sm text-slate-700 backdrop-blur"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </div>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>

                    <div
                      className={`flex h-12 items-center justify-center rounded-2xl border px-4 text-sm font-medium shadow-sm backdrop-blur ${feature.ctaClassName}`}
                    >
                      Open section
                    </div>
                  </CardContent>
                </button>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="relative container mx-auto px-6 pb-16">
        <Card className="overflow-hidden border-white/60 bg-white/50 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur-xl">
          <CardContent className="grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Home overview</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Move from overview to action without losing context.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                The home page now acts like a launch surface for the whole platform: users can
                jump into coach requests, nutrition, request management, or the community plan
                library from one consistent visual system.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[24px] border border-white/70 bg-white/65 p-4 text-sm text-slate-700 backdrop-blur">
                Coaching: request personalized plans directly from the landing surface.
              </div>
              <div className="rounded-[24px] border border-white/70 bg-white/65 p-4 text-sm text-slate-700 backdrop-blur">
                Nutrition: track calories and stay aligned with your goal.
              </div>
              <div className="rounded-[24px] border border-white/70 bg-white/65 p-4 text-sm text-slate-700 backdrop-blur">
                Community: download starter plans for maintenance, fat loss, or bulk.
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="relative mt-auto border-t border-white/40 py-6 text-center text-sm text-slate-500 backdrop-blur">
        © {new Date().getFullYear()} CalorieX
      </footer>
    </div>
  );
}
