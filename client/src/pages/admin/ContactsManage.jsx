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
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link
            to={ROUTES.ADMIN_DASHBOARD}
            className="text-slate-600 hover:text-slate-800 text-sm mb-1 inline-block"
          >
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Manage Contacts</h1>
        </header>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-600">
            Loading...
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-red-600">
            {error}
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-600">
            No contact messages yet.
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((c) => {
              const id = c._id || c.id;
              return (
                <div
                  key={id}
                  className={`bg-white rounded-xl border p-4 ${
                    c.isRead
                      ? "border-slate-200"
                      : "border-slate-300 bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-800">
                          {c.name}
                        </span>
                        <a
                          href={`mailto:${c.email}`}
                          className="text-sm text-slate-600 hover:underline"
                        >
                          {c.email}
                        </a>
                        {!c.isRead && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-700 mt-1">
                        {c.subject}
                      </p>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                        {c.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        {formatDateTime(c.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {!c.isRead && (
                        <Button
                          type="button"
                          onClick={() => handleMarkRead(id)}
                          className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
                        >
                          Mark read
                        </Button>
                      )}
                      <Button
                        type="button"
                        onClick={() => handleDelete(id)}
                        className="px-3 py-1.5 text-sm border border-red-200 text-red-700 rounded-lg hover:bg-red-50"
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
