import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { ROUTES } from "../../utils/constants";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../stores/authStore";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const successMessage = location.state?.message;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email?.trim() || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await authService.login({
        email: formData.email.trim(),
        password: formData.password,
      });
      const responseData = data?.data ?? data;
      const token = responseData?.token ?? data?.token ?? data?.accessToken;
      const rawUser = responseData?.user ?? responseData;
      const user = {
        _id: rawUser?._id ?? responseData?._id,
        name: rawUser?.name ?? responseData?.name,
        email: rawUser?.email ?? responseData?.email,
      };
      setUser(user, token);
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
          Admin login
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Sign in to access the admin panel.
        </p>

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60"
            />
          </div>
          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            to={ROUTES.ADMIN_REGISTER}
            className="font-medium text-slate-700 dark:text-slate-300 hover:text-primary"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
