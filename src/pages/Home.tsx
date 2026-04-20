import {
  ArrowDownToLine,
  ArrowRightLeft,
  Dumbbell,
  Flame,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  AccentButton,
  type AccentTone,
  CaloriexPage,
  FeatureCard
} from "@/components/caloriex";

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
    description: "Set your daily target, follow your meals, and keep your nutrition aligned.",
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
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
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

      <footer className="relative mt-auto border-t border-white/40 py-6 text-center text-sm text-slate-500 backdrop-blur">
        {"\u00A9"} {new Date().getFullYear()} CalorieX
      </footer>
    </CaloriexPage>
  );
}
