export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="">
      <h1> Header Dashboard</h1>
      {children}
    </main>
  );
}
