import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import { ROUTES } from "../../utils/constants";
import { contactService } from "../../services/contactService";
import { formatDateTime } from "../../utils/formatters";

export default function ContactsManage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContacts = () => {
    setError("");
    setLoading(true);
    contactService
      .getAll()
      .then((res) => {
        const list = res.data?.data ?? res.data ?? [];
        setContacts(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Failed to load contacts.",
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleMarkRead = (id) => {
    contactService
      .markAsRead(id)
      .then(() => {
        setContacts((prev) =>
          prev.map((c) =>
            (c._id || c.id) === id ? { ...c, isRead: true } : c,
          ),
        );
      })
      .catch((err) => {
        alert(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Failed to mark as read.",
        );
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this contact message?")) return;
    contactService
      .delete(id)
      .then(() => {
        setContacts((prev) => prev.filter((c) => (c._id || c.id) !== id));
      })
      .catch((err) => {
        alert(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Delete failed.",
        );
      });
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <Link
            to={ROUTES.ADMIN_DASHBOARD}
            className="mb-1 inline-block text-sm text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
          >
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Manage Contacts
          </h1>
        </header>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Loading...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-red-400">
            {error}
          </div>
        ) : contacts.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            No contact messages yet.
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((c) => {
              const id = c._id || c.id;
              return (
                <div
                  key={id}
                  className={`rounded-xl border p-4 ${
                    c.isRead
                      ? "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                      : "border-slate-300 bg-slate-50/50 dark:border-slate-600 dark:bg-slate-800/80"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                          {c.name}
                        </span>
                        <a
                          href={`mailto:${c.email}`}
                          className="text-sm text-slate-600 hover:underline dark:text-slate-300"
                        >
                          {c.email}
                        </a>
                        {!c.isRead && (
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                        {c.subject}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                        {c.message}
                      </p>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {formatDateTime(c.createdAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {!c.isRead && (
                        <Button
                          type="button"
                          onClick={() => handleMarkRead(id)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
                        >
                          Mark read
                        </Button>
                      )}
                      <Button
                        type="button"
                        onClick={() => handleDelete(id)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
