import {
  Compass,
  Dumbbell,
  Salad,
  UserCircle2,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export const publicLinks: NavItem[] = [
  { to: "/community-training-plans", label: "Plans", icon: Compass },
];

export const getAppLinks = (isCoach: boolean): NavItem[] => [
  { to: "/profile", label: "Profile", icon: UserCircle2 },
  { to: "/calorie-counter", label: "Calories", icon: Salad },
  {
    to: isCoach ? "/training-requests" : "/training-request",
    label: isCoach ? "Requests" : "Coaches",
    icon: Users,
  },
  ...(isCoach ? [{ to: "/coach-profile", label: "Coach", icon: Dumbbell }] : []),
];

export const isNavItemActive = (pathname: string, item: NavItem) =>
  pathname === item.to || pathname.startsWith(`${item.to}/`);
