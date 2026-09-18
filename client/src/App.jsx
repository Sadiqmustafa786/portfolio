import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import ThemeApply from "./components/common/ThemeApply";
import AnimatedCursor from "./components/common/AnimatedCursor";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import AboutPage from "./pages/About";
import ProjectsPage from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import ContactPage from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import ProjectsManage from "./pages/admin/ProjectsManage";
import ContactsManage from "./pages/admin/ContactsManage";
import CvManage from "./pages/admin/CvManage";
import AdminRegister from "./pages/admin/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ThemeApply />
      <AnimatedCursor />
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        <Route path="admin">
          <Route path="login" element={<AdminLogin />} />
          <Route path="register" element={<AdminRegister />} />

          <Route element={<ProtectedRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<ProjectsManage />} />
            <Route path="contacts" element={<ContactsManage />} />
            <Route path="cv" element={<CvManage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
