import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { profileService } from "../../services/profileService";
import heroImage from "../../assets/images/hero.jpeg";
import { ROUTES } from "../../utils/constants";

const HERO_STATS = [
  { value: "650+", label: "Projects Done" },
  { value: "99%", label: "Happy Client" },
  { value: "240+", label: "Fine Artworks" },
];

/** Stagger delays (ms) for hero entrance animations - single source of truth */
const HERO_STAGGER = {
  TITLE: "0ms",
  SUBTITLE: "120ms",
  CTAS: "220ms",
  STATS: "380ms",
  STAT_ITEM: [380, 450, 520],
};

export default function Hero() {
  const user = useAuthStore((state) => state.user);
  const [publicProfile, setPublicProfile] = useState(null);

  useEffect(() => {
    profileService
      .getPublic()
      .then((res) => {
        const data = res?.data?.data ?? res?.data;
        if (data && (data.name || data.email || data.hasCv)) setPublicProfile(data);
      })
      .catch(() => {});
  }, []);

  const displayName =
    user?.name ||
    user?.email ||
    publicProfile?.name ||
    publicProfile?.email ||
    "Your Name";
  const imageUrl = user?.image ?? user?.avatar ?? heroImage;
  const hasCv = !!publicProfile?.hasCv;
  const cvDownloadUrl = hasCv
    ? publicProfile?.cvDownloadUrl || profileService.getCvDownloadUrl()
    : null;

  return (
    <section
      className="min-h-[70vh] flex flex-col justify-center px-4 py-16 bg-white dark:bg-slate-900 relative overflow-hidden"
      aria-label="Hero introduction"
    >
      {/* Subtle background gradient for depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, var(--color-primary), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
        {/* Left: content */}
        <div className="text-center md:text-left order-2 md:order-1">
          <h1
            className="hero-animate text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-5 leading-tight"
            style={{
              animation: "hero-fade-up 0.65s ease-out both",
              animationDelay: HERO_STAGGER.TITLE,
            }}
          >
            MERN Stack{" "}
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Developer
            </span>{" "}
            Building Apps That Scale & Deliver
          </h1>
          <p
            className="hero-animate text-lg text-slate-600 dark:text-slate-300 max-w-xl mb-8 leading-relaxed"
            style={{
              animation: "hero-fade-up 0.65s ease-out both",
              animationDelay: HERO_STAGGER.SUBTITLE,
            }}
          >
            Hi, I'm {displayName}! I build full-stack web applications with
            MongoDB, Express, React & Node.js. Ready to be part of your next
            project!
          </p>
          <div
            className="hero-animate flex flex-wrap items-center gap-4 mb-10"
            style={{
              animation: "hero-fade-up 0.65s ease-out both",
              animationDelay: HERO_STAGGER.CTAS,
            }}
          >
            <Link
              to={ROUTES.CONTACT}
              className="inline-flex items-center px-6 py-3.5 bg-linear-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/30"
            >
              Hire Me
            </Link>
            {hasCv && (
              <a
                href={cvDownloadUrl}
                download={publicProfile?.cvFileName || "CV.pdf"}
                className="inline-flex items-center gap-2 px-6 py-3.5 border-2 border-primary text-primary dark:text-primary font-semibold rounded-lg hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download CV
              </a>
            )}
            <Link
              to={ROUTES.PROJECTS}
              className="group inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium hover:text-primary transition-colors duration-200"
            >
              Previous Works
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 17L17 7M17 7h-10v10"
                />
              </svg>
            </Link>
          </div>
          {/* Stats with staggered pop-in */}
          <div className="flex flex-wrap gap-8 sm:gap-12">
            {HERO_STATS.map(({ value, label }, i) => (
              <div
                key={label}
                className="hero-animate"
                style={{
                  animation: "hero-stat-in 0.5s ease-out both",
                  animationDelay: `${HERO_STAGGER.STAT_ITEM[i]}ms`,
                }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {value}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: image with decorative circle and floating badges */}
        <div className="order-1 md:order-2 relative flex justify-center md:justify-end">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96">
            <div
              className="hero-animate absolute inset-0 rounded-full bg-linear-to-br from-primary to-secondary p-2 sm:p-2.5"
              style={{
                animation:
                  "hero-scale-in 0.7s ease-out 0.15s both, hero-glow 4s ease-in-out 0.7s infinite",
              }}
            >
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-100 overflow-hidden shadow-xl">
                <img
                  src={imageUrl}
                  alt={displayName}
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>

            {/* Floating skill badges with staggered float animation */}
            <div
              className="hero-animate absolute -top-2 right-0 w-12 h-12 rounded-full border-2 border-primary/80 bg-white dark:bg-slate-100 flex items-center justify-center shadow-lg"
              style={{
                animation: "hero-float 3s ease-in-out infinite",
                animationDelay: "0s",
              }}
              title="Mobile-first"
              aria-hidden
            >
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div
              className="hero-animate absolute -left-[80px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-primary/80 bg-white dark:bg-slate-100 items-center justify-center shadow-lg max-sm:hidden sm:flex"
              style={{
                animation: "hero-float 3s ease-in-out infinite",
                animationDelay: "0.4s",
              }}
              title="Full-stack"
              aria-hidden
            >
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div
              className="hero-animate absolute -bottom-2 right-4 w-12 h-12 rounded-full border-2 border-primary/80 bg-white dark:bg-slate-100 flex items-center justify-center shadow-lg"
              style={{
                animation: "hero-float 3s ease-in-out infinite",
                animationDelay: "0.8s",
              }}
              title="UI/UX"
              aria-hidden
            >
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
