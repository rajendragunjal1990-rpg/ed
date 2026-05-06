import {
  ArrowRight,
  Bike,
  Check,
  ChevronLeft,
  CreditCard,
  LocateFixed,
  Lock,
  Mail,
  MapPin,
  ShieldCheck,
  Smartphone,
  User,
} from 'lucide-react';

const signupSteps = [
  'Welcome',
  'Account',
  'Ride plan',
  'Unlock',
];

const nearbyStations = [
  { name: 'Market St', bikes: 8, left: '18%', top: '24%' },
  { name: 'Pier 7', bikes: 4, left: '68%', top: '34%' },
  { name: 'Civic Center', bikes: 12, left: '45%', top: '68%' },
];

function PhoneFrame({
  children,
  label,
  activeStep,
}: {
  children: React.ReactNode;
  label: string;
  activeStep: number;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-[245px] rounded-[2.2rem] border-[10px] border-slate-950 bg-slate-950 shadow-2xl shadow-blue-950/20">
        <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-950" />
        <div className="min-h-[512px] overflow-hidden rounded-[1.45rem] bg-slate-50">
          <div className="flex items-center justify-between px-5 pt-4 text-[10px] font-bold text-slate-900">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span className="h-2 w-3 rounded-sm border border-slate-900" />
              <span className="h-2 w-2 rounded-full bg-slate-900" />
            </div>
          </div>
          {children}
        </div>
      </div>
      <div className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
        {activeStep + 1}. {label}
      </div>
    </div>
  );
}

function ProgressDots({ activeStep }: { activeStep: number }) {
  return (
    <div className="flex items-center gap-2">
      {signupSteps.map((step, index) => (
        <div
          key={step}
          className={`h-1.5 rounded-full transition-all ${
            index <= activeStep ? 'w-7 bg-orange-500' : 'w-3 bg-blue-100'
          }`}
        />
      ))}
    </div>
  );
}

function WelcomeScreen() {
  return (
    <PhoneFrame label="Welcome" activeStep={0}>
      <div className="relative flex min-h-[488px] flex-col overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 px-5 pb-5 pt-8 text-white">
        <div className="absolute -right-16 top-16 h-40 w-40 rounded-full bg-orange-400/30 blur-2xl" />
        <div className="absolute -left-10 bottom-20 h-44 w-44 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 backdrop-blur">
            <Bike className="h-4 w-4 text-orange-300" />
            <span className="text-xs font-bold">VeloCity</span>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold">SF</span>
        </div>
        <div className="relative z-10 mt-12 rounded-[2rem] bg-white/10 p-5 shadow-2xl shadow-blue-950/20 backdrop-blur">
          <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-orange-400 shadow-xl shadow-orange-900/20">
            <Bike className="h-20 w-20 text-white" strokeWidth={1.7} />
          </div>
          <div className="mt-8 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-200">Bike sharing</p>
            <h2 className="text-4xl font-black leading-[0.95] tracking-tight">Ride the city in minutes.</h2>
            <p className="text-sm leading-6 text-blue-50/85">Create your account, choose a pass, and unlock bikes at 240+ nearby docks.</p>
          </div>
        </div>
        <div className="relative z-10 mt-auto space-y-4">
          <button className="flex w-full items-center justify-between rounded-2xl bg-orange-500 px-5 py-4 text-sm font-bold text-white shadow-xl shadow-orange-900/30">
            Get started
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="text-center text-xs text-blue-50/80">Already riding? Sign in</p>
        </div>
      </div>
    </PhoneFrame>
  );
}

function AccountScreen() {
  return (
    <PhoneFrame label="Account details" activeStep={1}>
      <div className="min-h-[488px] bg-white px-5 pb-5 pt-6">
        <div className="flex items-center justify-between">
          <ChevronLeft className="h-5 w-5 text-slate-500" />
          <ProgressDots activeStep={1} />
        </div>
        <div className="mt-8">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">Step 2 of 4</span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Create your rider profile</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">We will use this to keep rides safe and receipts organized.</p>
        </div>
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3">
            <User className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Full name</p>
              <p className="text-sm font-bold text-slate-800">Maya Chen</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-sm">
            <Mail className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Email</p>
              <p className="text-sm font-bold text-slate-800">maya@example.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-sm">
            <Lock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Password</p>
              <p className="text-sm font-bold text-slate-800">••••••••••</p>
            </div>
          </div>
        </div>
        <div className="mt-8 rounded-2xl bg-orange-50 p-4">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 flex-none text-orange-500" />
            <p className="text-xs leading-5 text-orange-900">Protected by two-factor verification before your first ride.</p>
          </div>
        </div>
        <button className="mt-7 w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20">Continue</button>
      </div>
    </PhoneFrame>
  );
}

function PlanScreen() {
  return (
    <PhoneFrame label="Choose pass" activeStep={2}>
      <div className="min-h-[488px] bg-slate-50 px-5 pb-5 pt-6">
        <div className="flex items-center justify-between">
          <ChevronLeft className="h-5 w-5 text-slate-500" />
          <ProgressDots activeStep={2} />
        </div>
        <div className="mt-8">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">Popular plans</span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Pick a pass that fits today.</h2>
        </div>
        <div className="mt-7 space-y-3">
          <div className="rounded-[1.5rem] border-2 border-orange-400 bg-white p-4 shadow-xl shadow-orange-500/10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-black text-slate-950">Day Explorer</p>
                <p className="mt-1 text-xs text-slate-500">Unlimited 30-minute rides</p>
              </div>
              <div className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-white">$9</div>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Check className="h-4 w-4 text-orange-500" /> Best for errands and sightseeing
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-blue-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-black text-slate-950">Monthly Commuter</p>
                <p className="mt-1 text-xs text-slate-500">45-minute rides + e-bike perks</p>
              </div>
              <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">$24</div>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-blue-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-black text-slate-950">Pay as you go</p>
                <p className="mt-1 text-xs text-slate-500">Unlock fee + minutes used</p>
              </div>
              <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">$1</div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-blue-600 p-4 text-white">
          <CreditCard className="h-5 w-5 text-orange-300" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-100">Payment</p>
            <p className="text-sm font-black">Apple Pay ready</p>
          </div>
        </div>
        <button className="mt-5 w-full rounded-2xl bg-orange-500 py-4 text-sm font-bold text-white shadow-xl shadow-orange-600/20">Confirm pass</button>
      </div>
    </PhoneFrame>
  );
}

function UnlockScreen() {
  return (
    <PhoneFrame label="Find & unlock" activeStep={3}>
      <div className="min-h-[488px] bg-white px-5 pb-5 pt-6">
        <div className="flex items-center justify-between">
          <ChevronLeft className="h-5 w-5 text-slate-500" />
          <ProgressDots activeStep={3} />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">You are ready</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Unlock nearby bikes</h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
            <Smartphone className="h-6 w-6 text-orange-500" />
          </div>
        </div>
        <div className="relative mt-7 h-64 overflow-hidden rounded-[1.75rem] bg-blue-50">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(90deg,#bfdbfe_1px,transparent_1px),linear-gradient(#bfdbfe_1px,transparent_1px)] [background-size:34px_34px]" />
          <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 ring-2 ring-blue-500/20" />
          <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 shadow-xl shadow-blue-600/30">
            <LocateFixed className="h-6 w-6 text-white" />
          </div>
          {nearbyStations.map((station) => (
            <div
              key={station.name}
              className="absolute rounded-2xl bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-lg"
              style={{ left: station.left, top: station.top }}
            >
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-orange-500" />
                {station.name}
              </div>
              <p className="mt-1 text-[10px] text-blue-600">{station.bikes} bikes</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-blue-100 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-slate-950">Market St Station</p>
              <p className="text-xs text-slate-500">2 min walk · 8 bikes</p>
            </div>
            <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-white">Open</span>
          </div>
        </div>
        <button className="mt-5 w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20">Scan to unlock</button>
      </div>
    </PhoneFrame>
  );
}

export default function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eff6ff_45%,#fff7ed_100%)] px-6 py-8 text-slate-950 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm backdrop-blur">
              <Bike className="h-4 w-4 text-orange-500" />
              Mobile onboarding canvas
            </div>
            <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-950 md:text-7xl">
              Bike share signup flow
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              A simple four-screen iOS onboarding concept using a modern blue and orange palette, designed to get riders from discovery to unlocking a nearby bike.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/80 bg-white/70 p-5 shadow-xl shadow-blue-950/10 backdrop-blur">
            <p className="text-sm font-bold text-slate-500">Flow goal</p>
            <p className="mt-2 text-2xl font-black text-blue-700">Sign up → Pick pass → Ride</p>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/80 bg-white/55 p-6 shadow-2xl shadow-blue-950/10 backdrop-blur xl:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-orange-500">Canvas</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Primary signup screens</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {signupSteps.map((step, index) => (
                <span key={step} className="rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                  {index + 1}. {step}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-4">
            <WelcomeScreen />
            <AccountScreen />
            <PlanScreen />
            <UnlockScreen />
          </div>
        </div>
      </section>
    </main>
  );
}
