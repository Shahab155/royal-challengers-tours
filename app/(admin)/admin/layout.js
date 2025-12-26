import { redirect } from "next/navigation";
import { auth } from "../../api/auth/[...nextauth]/route";
import Sidebar from "./components/Sidebar";
import "../../(site)/globals.css"

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
