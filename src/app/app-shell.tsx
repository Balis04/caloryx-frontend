import { Outlet } from "react-router-dom";
import { Navbar } from "@/app-shell";

export function AppShell() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
