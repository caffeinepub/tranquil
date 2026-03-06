import { Outlet } from "@tanstack/react-router";
import React from "react";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full max-w-[430px] mx-auto flex flex-col min-h-screen relative">
        <Header />
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
