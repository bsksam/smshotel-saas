"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

export function ResponsiveLayoutWrapper({
  sidebar,
  children
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Set initial sidebar state on mount depending on viewport size
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, []);

  // Close sidebar drawer automatically on route navigation only on mobile
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  // Listen for toggle click event from Header
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
      <div className={`fixed z-50 md:z-30 transition-transform duration-300 ease-in-out h-screen top-0 left-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {sidebar}
        
        {/* Mobile close button inside the sidebar container */}
        {sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(false)}
            className="absolute top-3.5 right-4 md:hidden p-1.5 rounded-xl border border-zinc-200 bg-white text-zinc-650 hover:bg-zinc-50 shadow-sm z-50"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        sidebarOpen ? "md:pl-64" : "pl-0"
      }`}>
        {children}
      </div>
    </div>
  );
}
