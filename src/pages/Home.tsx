import {
  ArrowDownToLine,
  ArrowRightLeft,
  Dumbbell,
  Flame,
  Orbit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  AccentButton,
  type AccentTone,
  CaloriexPage,
  FeatureCard,
  GlassMetric,
  PageHero,
  SummaryPanel,
  HeroBadge,
} from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";

type HomeFeature = {
  title: string;
  description: string;
  eyebrow: string;
  tone: AccentTone;
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
    tone: "emerald",
    signal: "Custom guidance",
    points: ["Browse coaches", "Start a request", "Get a tailored plan"],
    path: "/training-request",
    icon: Dumbbell,
  },
  {
    title: "Calorie Tracking",
    description: "Set a daily target, follow your meals, and keep your nutrition aligned.",
    eyebrow: "Nutrition",
    tone: "rose",
    signal: "Daily awareness",
    points: ["Track meals", "Watch calories", "Follow macro targets"],
    path: "/calorie-counter",
    icon: Flame,
  },
  {
    title: "Training Requests",
    description: "Track the status of incoming or sent requests and manage active plan flows.",
    eyebrow: "Workflow",
    tone: "violet",
    signal: "Request control",
    points: ["See request statuses", "Manage uploads", "Stay in sync with users"],
    path: "/training-requests",
    icon: ArrowRightLeft,
  },
  {
    title: "Community Plans",
    description: "Download ready-made maintenance, weight loss, and bulk PDF plans instantly.",
    eyebrow: "Library",
    tone: "sky",
    signal: "Instant access",
    points: ["Maintenance track", "Weight loss track", "Muscle gain track"],
    path: "/community-training-plans",
    icon: ArrowDownToLine,
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <CaloriexPage>
      <PageHero
        badge={<HeroBadge>CalorieX platform</HeroBadge>}
        title="Training, nutrition, and coaching in one clean flow."
        description="Build better routines with coach requests, calorie tracking, and instant-access community plans designed around real fitness goals."
        chips={["Personalized coaching", "Goal-based nutrition", "Community downloads"]}
        aside={
          <SummaryPanel eyebrow="System overview" title="Core experience" icon={Orbit}>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <GlassMetric
                label="Modules"
                value="04"
                description="Coaching, nutrition, requests, and public training plans."
              />
              <GlassMetric
                label="Focus"
                value="Progress"
                description="Everything on the home page leads directly into action."
              />
            </div>
          </SummaryPanel>
        }
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {HOME_FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              eyebrow={feature.eyebrow}
              title={feature.title}
              description={feature.description}
              signal={feature.signal}
              points={feature.points}
              tone={feature.tone}
              icon={feature.icon}
              metaLabel="Start here"
              action={
                <AccentButton tone={feature.tone} onClick={() => navigate(feature.path)}>
                  Open section
                </AccentButton>
              }
            />
          ))}
        </div>
      </section>

      <section className="relative container mx-auto px-6 pb-16">
        <SummaryPanel eyebrow="Home overview" title="Move from overview to action without losing context." icon={Orbit}>
          <CardContent className="grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div className="space-y-4">
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                The home page now acts like a launch surface for the whole platform: users can
                jump into coach requests, nutrition, request management, or the community plan
                library from one consistent visual system.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="cx-glass-block rounded-[24px] p-4 text-sm text-slate-700">
                Coaching: request personalized plans directly from the landing surface.
              </div>
              <div className="cx-glass-block rounded-[24px] p-4 text-sm text-slate-700">
                Nutrition: track calories and stay aligned with your goal.
              </div>
              <div className="cx-glass-block rounded-[24px] p-4 text-sm text-slate-700">
                Community: download starter plans for maintenance, fat loss, or bulk.
              </div>
            </div>
          </CardContent>
        </SummaryPanel>
      </section>

      <footer className="relative mt-auto border-t border-white/40 py-6 text-center text-sm text-slate-500 backdrop-blur">
        © {new Date().getFullYear()} CalorieX
      </footer>
    </CaloriexPage>
  );
}
