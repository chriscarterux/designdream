import { Toaster } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto flex h-16 items-center px-8">
          <h1 className="text-xl font-bold">DesignDream Dashboard</h1>
        </div>
      </div>
      <main>{children}</main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
