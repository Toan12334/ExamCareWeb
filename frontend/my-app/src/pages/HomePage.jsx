import React from "react";

const StarIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5z" />
  </svg>
);

const LeafCheckIcon = () => (
  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 4c-6.5.3-11.5 3.4-13.8 8.4C4.7 15.7 5.8 19 9 20c4.8 1.5 9.7-3.2 11-16z" />
    <path d="M8.5 13.2l2.2 2.2 5-6" />
  </svg>
);

const TrophyIcon = () => (
  <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
    <path d="M8 6H4v2a4 4 0 0 0 4 4" />
    <path d="M16 6h4v2a4 4 0 0 1-4 4" />
    <path d="M12 13v5" />
    <path d="M8 20h8" />
  </svg>
);

const GraphIcon = () => (
  <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19V5" />
    <path d="M4 19h16" />
    <path d="M7 15l4-4 3 3 5-7" />
    <path d="M17 7h2v2" />
  </svg>
);

const LockCameraIcon = () => (
  <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10V8a5 5 0 0 1 10 0v2" />
    <rect x="5" y="10" width="14" height="10" rx="3" />
    <path d="M12 14v2" />
    <path d="M8 5.5l-2-2" />
    <path d="M16 5.5l2-2" />
  </svg>
);

const BulbIcon = () => (
  <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M8.5 15.5A6 6 0 1 1 15.5 15c-.8.6-1.2 1.5-1.4 3h-4.2c-.2-1.3-.6-2-1.4-2.5z" />
    <path d="M12 2v2" />
    <path d="M4.9 4.9l1.4 1.4" />
    <path d="M19.1 4.9l-1.4 1.4" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

const PlayIcon = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8l6 4-6 4V8z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.5 2.5L16 9" />
  </svg>
);

const features = [
  {
    icon: TrophyIcon,
    title: "Fun Practice",
    description: "Turn revision into a friendly challenge with goals, streaks, and confidence boosts.",
    color: "from-amber-300 to-orange-400",
    shadow: "shadow-orange-200/70",
  },
  {
    icon: GraphIcon,
    title: "Real-time Analytics",
    description: "See progress instantly with simple charts that help students know what to improve next.",
    color: "from-indigo-400 to-violet-500",
    shadow: "shadow-indigo-200/70",
  },
  {
    icon: LockCameraIcon,
    title: "Secure Proctoring",
    description: "Keep exams fair with calm, secure monitoring designed to feel respectful and safe.",
    color: "from-mint-400 to-emerald-400",
    shadow: "shadow-emerald-200/70",
  },
  {
    icon: BulbIcon,
    title: "AI Question Bank",
    description: "Generate smart practice questions by topic, level, and learning objective in seconds.",
    color: "from-pink-300 to-peach-400",
    shadow: "shadow-pink-200/70",
  },
];

const steps = [
  { icon: UserIcon, title: "1. Register", text: "Create your student profile in seconds." },
  { icon: PlayIcon, title: "2. Practice", text: "Take friendly mock tests and learn at your pace." },
  { icon: CheckCircleIcon, title: "3. Succeed!", text: "Track growth, build confidence, and ace the real exam." },
];

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-indigo-500 text-white shadow-lg shadow-emerald-200">
            <LeafCheckIcon />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">ExamCare</span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-bold text-slate-600 md:flex">
          <a href="#features" className="hover:text-indigo-600">Features</a>
          <a href="#practice" className="hover:text-indigo-600">Practice</a>
          <a href="#results" className="hover:text-indigo-600">Results</a>
        </div>

        <a href="https://examcareweb-dockerdocker.onrender.com/user/manager" className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-emerald-500">
          Start Practice
        </a>
      </nav>
    </header>
  );
}

function StudentIllustration() {
  return (
    <div className="relative mx-auto max-w-xl">
      <div className="absolute -left-8 top-10 h-20 w-20 rounded-full bg-orange-200 blur-2xl" />
      <div className="absolute right-2 top-0 h-28 w-28 rounded-full bg-emerald-200 blur-2xl" />
      <div className="absolute -bottom-8 left-24 h-32 w-32 rounded-full bg-indigo-200 blur-3xl" />

      <div className="relative rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-indigo-200/50 backdrop-blur-xl">
        <div className="absolute -left-4 top-12 rounded-2xl bg-white px-4 py-3 text-amber-400 shadow-xl rotate-[-8deg]">
          <StarIcon />
        </div>
        <div className="absolute -right-4 top-24 rounded-2xl bg-white px-4 py-3 text-orange-400 shadow-xl rotate-[10deg]">💡</div>

        <div className="grid gap-5 sm:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col items-center justify-end rounded-3xl bg-gradient-to-b from-indigo-100 to-emerald-100 p-5">
            <div className="relative h-36 w-36 rounded-full bg-peach-200">
              <div className="absolute left-9 top-8 h-4 w-4 rounded-full bg-slate-800" />
              <div className="absolute right-9 top-8 h-4 w-4 rounded-full bg-slate-800" />
              <div className="absolute left-12 top-20 h-6 w-12 rounded-b-full border-b-4 border-slate-800" />
              <div className="absolute -left-5 top-12 h-10 w-7 rounded-full bg-indigo-500" />
              <div className="absolute -right-5 top-12 h-10 w-7 rounded-full bg-indigo-500" />
              <div className="absolute -right-8 top-20 h-10 w-10 rounded-full bg-emerald-400 text-white flex items-center justify-center text-xl shadow-lg">👍</div>
            </div>
            <div className="mt-4 h-20 w-44 rounded-t-[3rem] bg-gradient-to-r from-indigo-500 to-violet-500" />
          </div>

          <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-xl">
            <div className="mb-4 flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <div className="rounded-2xl bg-white p-4 text-slate-900">
              <p className="text-xs font-black uppercase tracking-widest text-indigo-500">Friendly Quiz</p>
              <h3 className="mt-2 text-xl font-black">Science Practice</h3>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">A. Photosynthesis ✅</div>
                <div className="rounded-2xl bg-indigo-50 p-3 text-sm font-bold text-indigo-700">B. Respiration</div>
                <div className="rounded-2xl bg-orange-50 p-3 text-sm font-bold text-orange-700">C. Evaporation</div>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-400 to-indigo-500" />
              </div>
              <p className="mt-2 text-right text-xs font-bold text-slate-500">75% complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(52,211,153,0.22),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_70%_90%,rgba(251,146,60,0.16),transparent_28%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-2 text-sm font-black text-emerald-600 shadow-sm">
            <StarIcon className="h-4 w-4 text-amber-400" /> Student-friendly online exams
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Ace Your Exams, <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 bg-clip-text text-transparent">Stress-Free!</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Your cheerful partner for joyful learning and secure testing. Build confidence, not stress.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a href="#practice" className="rounded-2xl bg-emerald-400 px-7 py-4 text-center font-black text-white shadow-xl shadow-emerald-200 transition-all hover:-translate-y-1 hover:bg-emerald-500">
              Start Practice Now
            </a>
            <a href="#mock" className="rounded-2xl border-2 border-indigo-200 bg-white/70 px-7 py-4 text-center font-black text-indigo-600 transition-all hover:-translate-y-1 hover:border-indigo-400 hover:bg-white">
              Take Mock Test
            </a>
          </div>

          <div className="mt-7 flex items-center gap-3 text-sm font-bold text-slate-600">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} className="h-5 w-5" />)}
            </div>
            Over 1M+ Confident Students
          </div>
        </div>

        <StudentIllustration />
      </div>
    </section>
  );
}

// eslint-disable-next-line no-unused-vars
function FeatureCard({ icon: Icon, title, description, color, shadow }) {
  return (
    <article className={`rounded-3xl border border-white/70 bg-white p-7 shadow-xl ${shadow} transition-all hover:-translate-y-2 hover:shadow-2xl`}>
      <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${color} text-white shadow-lg`}>
        <Icon />
      </div>
      <h3 className="text-2xl font-black text-slate-950">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{description}</p>
    </article>
  );
}

function Features() {
  return (
    <section id="features" className="px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-indigo-500">Key Features</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Learning tools that feel friendly</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">A cheerful EdTech experience that keeps exams secure while helping students feel calm and capable.</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="practice" className="px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-8 shadow-2xl shadow-indigo-100/60 lg:p-12">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-500">How It Works</p>
          <h2 className="mt-4 text-4xl font-black text-slate-950">Three simple steps to confidence</h2>
        </div>

        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          <div className="absolute left-[17%] right-[17%] top-12 hidden h-1 rounded-full bg-gradient-to-r from-emerald-300 via-indigo-300 to-orange-300 md:block" />
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-indigo-500 shadow-xl shadow-indigo-100">
                  <Icon />
                </div>
                <h3 className="mt-6 text-2xl font-black text-slate-950">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs leading-7 text-slate-600">{step.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-indigo-100 bg-white/80 px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-indigo-500 text-white">
            <LeafCheckIcon />
          </div>
          <span className="font-black text-slate-900">ExamCare</span>
        </div>
        <p className="text-sm font-semibold text-slate-500">© 2026 ExamCare. Made for joyful, confident learning.</p>
        <div className="flex gap-5 text-sm font-bold text-slate-600">
          <a href="#" className="hover:text-indigo-600">Privacy</a>
          <a href="#" className="hover:text-indigo-600">Terms</a>
          <a href="#" className="hover:text-indigo-600">Support</a>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-indigo-50/40 to-emerald-50/40 font-sans text-slate-950">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  );
}
