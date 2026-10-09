import SectionStars from "../common/SectionStars";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative py-16 px-4 bg-transparent dark:bg-slate-900 overflow-hidden"
    >
      <SectionStars count={7} />
      <div className="relative z-10 max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4 border-b-2 border-primary pb-2 inline-block">
          Get in Touch
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Have a project in mind? Send me a message.
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go to Contact Page
        </a>
      </div>
    </section>
  );
}
