import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-900">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl px-4 py-8 mx-auto sm:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
