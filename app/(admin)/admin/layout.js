// app/admin/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "../../api/auth/[...nextauth]/route"; // adjust path if needed
import Sidebar from "./components/Sidebar";
import "@/app/(site)/globals.css"; // or wherever your globals.css is

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-bg text-text antialiased">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        {/* 
          Padding is now handled ONLY in the page components 
          (more flexibility for different pages)
        */}
        {children}
      </main>
    </div>
  );
}