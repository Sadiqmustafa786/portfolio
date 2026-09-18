import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../utils/constants";

export default function NotFound() {
  const location = useLocation();
  const isApiPath = location.pathname.startsWith("/api");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        404 - Not Found
      </h1>
      {isApiPath ? (
        <p className="text-slate-600 dark:text-slate-300 text-center max-w-md mb-4">
          <code className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
            {location.pathname}
          </code>{" "}
          is an API endpoint, not a page. Do not open it in the browser. Use the
          Register form at{" "}
          <Link
            to={ROUTES.ADMIN_REGISTER}
            className="font-medium text-slate-800 dark:text-slate-200 underline"
          >
            Admin → Register
          </Link>
          .
        </p>
      ) : (
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          This page does not exist.
        </p>
      )}
      <Link
        to={ROUTES.HOME}
        className="text-slate-800 dark:text-slate-200 font-medium underline hover:no-underline"
      >
        Go to Home
      </Link>
    </div>
  );
}
