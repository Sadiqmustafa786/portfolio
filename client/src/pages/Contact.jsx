import { useState } from "react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { contactService } from "../services/contactService";
import { isRequired, isValidEmail } from "../utils/validators";

const INPUT_CLASS =
  "w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60 transition-colors";

const LABEL_CLASS =
  "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

/** Stagger delays (ms) for contact section animations */
const CONTACT_STAGGER = {
  HEADER: 0,
  CARD: 80,
  NAME: 120,
  EMAIL: 180,
  SUBJECT: 240,
  MESSAGE: 300,
  SUBMIT: 360,
  FOOTER: 420,
};

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!isRequired(formData.name)) {
      setError("Name is required.");
      return;
    }
    if (!isRequired(formData.email)) {
      setError("Email is required.");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!isRequired(formData.subject)) {
      setError("Subject is required.");
      return;
    }
    if (!isRequired(formData.message)) {
      setError("Message is required.");
      return;
    }

    setLoading(true);
    try {
      await contactService.send({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to send message.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: form */}
          <div className="order-2 lg:order-1">
            <header
              className="contact-animate mb-8 lg:mb-10"
              style={{
                animation: "contact-fade-up 0.6s ease-out both",
                animationDelay: `${CONTACT_STAGGER.HEADER}ms`,
              }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 border-b-2 border-primary pb-2 inline-block">
                Get in Touch
              </h1>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Send a message and I&apos;ll get back to you.
              </p>
            </header>

            <div
              className="contact-animate rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg shadow-slate-200/50 dark:shadow-none p-6 sm:p-8"
              style={{
                animation: "contact-fade-up 0.6s ease-out both",
                animationDelay: `${CONTACT_STAGGER.CARD}ms`,
              }}
            >
              {success && (
                <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <span className="shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Message sent
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-0.5">
                      I&apos;ll reply soon. Thanks for reaching out.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <span className="shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </span>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div
                  className="contact-animate"
                  style={{
                    animation: "contact-fade-up 0.5s ease-out both",
                    animationDelay: `${CONTACT_STAGGER.NAME}ms`,
                  }}
                >
                  <label htmlFor="name" className={LABEL_CLASS}>
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    className={INPUT_CLASS}
                  />
                </div>
                <div
                  className="contact-animate"
                  style={{
                    animation: "contact-fade-up 0.5s ease-out both",
                    animationDelay: `${CONTACT_STAGGER.EMAIL}ms`,
                  }}
                >
                  <label htmlFor="email" className={LABEL_CLASS}>
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className={INPUT_CLASS}
                  />
                </div>
                <div
                  className="contact-animate"
                  style={{
                    animation: "contact-fade-up 0.5s ease-out both",
                    animationDelay: `${CONTACT_STAGGER.SUBJECT}ms`,
                  }}
                >
                  <label htmlFor="subject" className={LABEL_CLASS}>
                    Subject
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="e.g. Project inquiry or collaboration"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={loading}
                    className={INPUT_CLASS}
                  />
                </div>
                <div
                  className="contact-animate"
                  style={{
                    animation: "contact-fade-up 0.5s ease-out both",
                    animationDelay: `${CONTACT_STAGGER.MESSAGE}ms`,
                  }}
                >
                  <label htmlFor="message" className={LABEL_CLASS}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={handleChange}
                    disabled={loading}
                    rows={5}
                    className={INPUT_CLASS + " resize-y min-h-[120px]"}
                  />
                </div>
                <div
                  className="contact-animate"
                  style={{
                    animation: "contact-fade-up 0.5s ease-out both",
                    animationDelay: `${CONTACT_STAGGER.SUBMIT}ms`,
                  }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:shadow-primary/30"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            <p
              className="contact-animate text-slate-500 dark:text-slate-400 text-sm mt-6"
              style={{
                animation: "contact-fade-up 0.5s ease-out both",
                animationDelay: `${CONTACT_STAGGER.FOOTER}ms`,
              }}
            >
              I usually reply within 24–48 hours.
            </p>
          </div>

          {/* Right: illustration */}
          <div
            className="contact-animate order-1 lg:order-2 flex justify-center lg:justify-end"
            style={{
              animation: "contact-scale-in 0.7s ease-out 0.1s both",
            }}
          >
            <div className="relative w-full max-w-md aspect-square">
              <svg
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-primary/90 dark:text-primary/80"
                aria-hidden
              >
                {/* Background circle */}
                <circle
                  cx="200"
                  cy="200"
                  r="160"
                  className="fill-primary/5 dark:fill-primary/10"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="120"
                  className="fill-primary/10 dark:fill-primary/15"
                />
                {/* Envelope */}
                <g transform="translate(100 120)">
                  <rect
                    x="0"
                    y="40"
                    width="200"
                    height="140"
                    rx="8"
                    className="fill-white dark:fill-slate-800 stroke-primary/30 dark:stroke-primary/50"
                    strokeWidth="2"
                  />
                  <path
                    d="M0 48 L100 128 L200 48"
                    className="fill-primary/10 dark:fill-primary/20 stroke-primary/40"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 58 L12 168 L188 168 L188 58"
                    className="fill-none stroke-primary/20"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                  />
                </g>
                {/* Decorative dots */}
                <circle cx="280" cy="100" r="8" className="fill-secondary/60" />
                <circle cx="320" cy="280" r="6" className="fill-primary/50" />
                <circle cx="80" cy="260" r="5" className="fill-secondary/40" />
                {/* Message lines (abstract) */}
                <line
                  x1="260"
                  y1="320"
                  x2="340"
                  y2="320"
                  className="stroke-primary/30"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="260"
                  y1="332"
                  x2="300"
                  y2="332"
                  className="stroke-primary/20"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
