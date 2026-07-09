"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function ResponsiveLayoutWrapper({
  sidebar,
  children
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar drawer automatically on route navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Listen for mobile toggle click event from Header
  useEffect(() => {
    const handleToggle = () => setSidebarOpen(prev => !prev);
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden relative">
      {/* Backdrop overlay for mobile drawer */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-zinc-950/45 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar container */}
      <div className={`fixed z-50 md:z-30 transition-transform duration-300 ease-in-out md:translate-x-0 h-screen top-0 left-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {sidebar}
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
