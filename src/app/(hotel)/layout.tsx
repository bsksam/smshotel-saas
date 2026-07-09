import { HotelSidebar } from "@/components/layout/HotelSidebar";
import { Header } from "@/components/layout/Header";
import { ResponsiveLayoutWrapper } from "@/components/layout/ResponsiveLayoutWrapper";
import { PWARegister } from "@/components/pwa/PWARegister";

export default function HotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResponsiveLayoutWrapper sidebar={<HotelSidebar />}>
      <PWARegister />
      <Header />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </ResponsiveLayoutWrapper>
  );
}
