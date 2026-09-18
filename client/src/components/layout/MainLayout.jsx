import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl px-4 py-8 mx-auto sm:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
