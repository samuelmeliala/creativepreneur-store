import Sidebar from "../../component/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#DBE2EF] flex flex-col md:flex-row">
      {/* Sidebar:
          - on mobile: only top bar + drawer are visible
          - on desktop: left sidebar
      */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}