import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import Button from '../components/common/Button'

// ── Inline SVG illustrations ──────────────────────────────────────────────────

function TransferIllustration() {
  return (
    <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mx-auto mb-5" aria-hidden="true">
      <circle cx="40" cy="65" r="32" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
      <circle cx="120" cy="65" r="32" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
      <text x="40" y="62" fill="#34d399" fontSize="16" textAnchor="middle">₦</text>
      <text x="40" y="76" fill="#6ee7b7" fontSize="6" textAnchor="middle">SENDER</text>
      <text x="120" y="62" fill="#34d399" fontSize="16" textAnchor="middle">₦</text>
      <text x="120" y="76" fill="#6ee7b7" fontSize="6" textAnchor="middle">RECEIVER</text>
      <line x1="75" y1="65" x2="85" y2="65" stroke="#34d399" strokeWidth="2" />
      <polygon points="85,61 93,65 85,69" fill="#34d399" />
      <text x="80" y="55" fill="#6ee7b7" fontSize="7" textAnchor="middle">instant</text>
    </svg>
  )
}

function ShieldIllustration() {
  return (
    <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mx-auto mb-5" aria-hidden="true">
      <path d="M80 12 L128 32 L128 76 Q128 104 80 118 Q32 104 32 76 L32 32 Z" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
      <path d="M80 24 L116 40 L116 75 Q116 97 80 108 Q44 97 44 75 L44 40 Z" fill="#047857" />
      <text x="80" y="78" fill="#34d399" fontSize="30" textAnchor="middle">✓</text>
    </svg>
  )
}

function ChartIllustration() {
  return (
    <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mx-auto mb-5" aria-hidden="true">
      <rect x="14" y="14" width="132" height="96" rx="4" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
      {[35, 55, 75].map(y => <line key={y} x1="24" y1={y} x2="136" y2={y} stroke="#047857" strokeWidth="0.8" />)}
      {[
        { x: 28, h: 38, col: '#34d399' },
        { x: 51, h: 58, col: '#6ee7b7' },
        { x: 74, h: 26, col: '#34d399' },
        { x: 97, h: 62, col: '#6ee7b7' },
        { x: 120, h: 44, col: '#34d399' },
      ].map(({ x, h, col }) => (
        <rect key={x} x={x} y={100 - h} width="16" height={h} rx="2" fill={col} />
      ))}
    </svg>
  )
}

function CardIllustration() {
  return (
    <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mx-auto mb-5" aria-hidden="true">
      <rect x="28" y="22" width="112" height="70" rx="8" fill="#047857" />
      <rect x="18" y="32" width="112" height="70" rx="8" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
      <rect x="30" y="50" width="20" height="14" rx="2" fill="#34d399" opacity="0.85" />
      <line x1="30" y1="57" x2="50" y2="57" stroke="#065f46" strokeWidth="1.2" />
      <line x1="40" y1="50" x2="40" y2="64" stroke="#065f46" strokeWidth="1.2" />
      <text x="30" y="82" fill="#6ee7b7" fontSize="7" fontFamily="monospace" letterSpacing="1">**** **** 4821</text>
      <text x="30" y="95" fill="#34d399" fontSize="6" fontFamily="monospace">VALID THRU  12/29</text>
    </svg>
  )
}

function FeatureCard({ title, desc, illustration }) {
  return (
    <div className="bg-white dark:bg-emerald-900 border border-gray-100 dark:border-emerald-800 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
      {illustration}
      <h3 className="text-gray-900 dark:text-white font-bold text-base mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-emerald-300 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function Step({ number, title, desc }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 bg-emerald-500 text-white font-bold text-lg flex items-center justify-center rounded-full shrink-0 shadow">
        {number}
      </div>
      <div>
        <h4 className="text-gray-900 dark:text-white font-semibold mb-1">{title}</h4>
        <p className="text-gray-500 dark:text-emerald-300 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

// Decorative phone mockup
function PhoneMockup() {
  return (
    <svg viewBox="0 0 220 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[180px] drop-shadow-2xl" aria-hidden="true">
      {/* Phone shell */}
      <rect x="6" y="6" width="208" height="408" rx="28" fill="#022c22" stroke="#34d399" strokeWidth="2" />
      <rect x="14" y="14" width="192" height="392" rx="22" fill="#065f46" />
      {/* Notch */}
      <rect x="72" y="10" width="76" height="14" rx="7" fill="#022c22" />
      {/* Screen content */}
      <rect x="20" y="38" width="180" height="360" rx="16" fill="#047857" />
      {/* Header */}
      <text x="34" y="64" fill="#34d399" fontSize="9" fontWeight="bold" letterSpacing="1.5">DIGITALBANK</text>
      <text x="168" y="64" fill="#6ee7b7" fontSize="8" textAnchor="end">⊞</text>
      {/* Balance card */}
      <rect x="26" y="76" width="168" height="96" rx="10" fill="#065f46" stroke="#34d399" strokeWidth="0.8" />
      <text x="38" y="100" fill="#6ee7b7" fontSize="7" letterSpacing="1">ACCOUNT BALANCE</text>
      <text x="38" y="122" fill="white" fontSize="20" fontWeight="bold" fontFamily="monospace">₦245,000</text>
      <text x="38" y="140" fill="#6ee7b7" fontSize="7" fontFamily="monospace">**** **** **** 4821</text>
      <text x="38" y="158" fill="#34d399" fontSize="6" letterSpacing="1">SAVINGS · ACTIVE</text>
      {/* Action buttons */}
      {[
        { x: 30, label: '⇄', sub: 'Send' },
        { x: 82, label: '↓', sub: 'Fund' },
        { x: 134, label: '↻', sub: 'Query' },
      ].map(({ x, label, sub }) => (
        <g key={x}>
          <rect x={x} y="184" width="44" height="44" rx="8" fill="#065f46" stroke="#34d399" strokeWidth="0.8" />
          <text x={x + 22} y="210" fill="#34d399" fontSize="14" textAnchor="middle">{label}</text>
          <text x={x + 22} y="222" fill="#6ee7b7" fontSize="5.5" textAnchor="middle">{sub}</text>
        </g>
      ))}
      {/* Transactions */}
      <text x="30" y="250" fill="#6ee7b7" fontSize="6.5" letterSpacing="1">RECENT ACTIVITY</text>
      {[
        { y: 270, label: 'Transfer · Emeka', amt: '-₦5,000', credit: false },
        { y: 295, label: 'Card Deposit', amt: '+₦20,000', credit: true },
        { y: 320, label: 'Transfer · Aisha', amt: '-₦2,500', credit: false },
      ].map(({ y, label, amt, credit }) => (
        <g key={y}>
          <rect x="26" y={y - 12} width="168" height="1" fill="#047857" opacity="0.6" />
          <text x="30" y={y + 2} fill="white" fontSize="7">{label}</text>
          <text x="190" y={y + 2} fill={credit ? '#34d399' : '#fca5a5'} fontSize="7" textAnchor="end">{amt}</text>
        </g>
      ))}
      {/* Bottom nav */}
      <rect x="20" y="346" width="180" height="1" fill="#047857" />
      {['⊞', '⇄', '↓', '☰'].map((icon, i) => (
        <text key={i} x={46 + i * 42} y={372} fill={i === 0 ? '#34d399' : '#6ee7b7'} fontSize="14" textAnchor="middle">{icon}</text>
      ))}
      {/* Home indicator */}
      <rect x="80" y="390" width="60" height="3" rx="2" fill="#34d399" opacity="0.5" />
    </svg>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="text-gray-900 dark:text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600 rounded-full opacity-10 blur-3xl translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500 rounded-full opacity-10 blur-3xl -translate-x-1/3 translate-y-1/3" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-emerald-800 border border-emerald-600 text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-7 tracking-widest uppercase">
              🇳🇬 Nigerian Digital Banking
            </span>
            <h1 className="text-5xl font-extrabold leading-tight mb-6 text-white">
              Banking that works<br />
              <span className="text-emerald-400">as fast as you do.</span>
            </h1>
            <p className="text-emerald-200 text-lg leading-relaxed mb-10 max-w-lg">
              Open a personal savings account in minutes. Send money, fund your wallet
              with any debit card, and track every transaction — all in one place.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link to={ROUTES.register}>
                <Button className="px-8 py-3.5 text-base bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg shadow-lg shadow-emerald-900/50">
                  Open an Account
                </Button>
              </Link>
              <Link to={ROUTES.login} className="text-emerald-300 hover:text-white text-sm font-medium transition-colors">
                Already have one? Sign in →
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mt-10">
              {[
                { icon: '🔒', label: 'Bank-grade encryption' },
                { icon: '⚡', label: 'Instant transfers' },
                { icon: '📱', label: 'Fully mobile-friendly' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 bg-emerald-800/60 border border-emerald-700 px-4 py-2 rounded-lg text-sm text-emerald-200">
                  <span aria-hidden="true">{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero photo + floating phone overlay */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Glow */}
              <div className="absolute inset-0 bg-emerald-400 opacity-20 blur-3xl rounded-full" aria-hidden="true" />

              {/* Real photo — woman doing mobile banking */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-emerald-700">
                <img
                  src="/images/hero.jpg"
                  alt="Two young Nigerians holding phones and smiling together in Lagos"
                  className="w-full object-cover"
                  style={{ maxHeight: 420 }}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                {/* Overlay tint */}
                <div className="absolute inset-0 bg-emerald-900 opacity-20 rounded-2xl" aria-hidden="true" />
              </div>

              {/* Floating phone mockup, bottom-right */}
              <div className="absolute -bottom-6 -right-4 w-32 drop-shadow-2xl hidden sm:block">
                <PhoneMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white dark:bg-emerald-950 border-b border-gray-100 dark:border-emerald-800">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '2 min',   label: 'Account opening time' },
            { value: 'Instant', label: 'Transfer speed' },
            { value: 'Tier 1',  label: 'Savings account type' },
            { value: '100%',    label: 'Online — no branch needed' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">{value}</p>
              <p className="text-gray-500 dark:text-emerald-300 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-gray-50 dark:bg-emerald-950 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
              Everything you need to bank smarter
            </h2>
            <p className="text-gray-500 dark:text-emerald-300 max-w-xl mx-auto text-base">
              DigitalBank gives you the tools to manage your money without ever stepping into a branch.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              illustration={<TransferIllustration />}
              title="Instant Transfers"
              desc="Send money to any DigitalBank account in seconds. No delays, no queues."
            />
            <FeatureCard
              illustration={<CardIllustration />}
              title="Card Deposits"
              desc="Fund your account using any Nigerian debit card, with immediate or pending flows."
            />
            <FeatureCard
              illustration={<ChartIllustration />}
              title="Transaction History"
              desc="Every deposit and transfer is logged. Re-query any pending transaction for its final status."
            />
            <FeatureCard
              illustration={<ShieldIllustration />}
              title="Secure by Design"
              desc="JWT authentication, encrypted data, NIN & BVN verification — your account stays safe."
            />
          </div>
        </div>
      </section>

      {/* ── PEOPLE IN ACTION ── */}
      <section className="bg-white dark:bg-emerald-950 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
              Real people, real transactions
            </h2>
            <p className="text-gray-500 dark:text-emerald-300 max-w-lg mx-auto text-sm">
              From instant transfers to card deposits — see how Nigerians use DigitalBank every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                src: '/images/transfers.jpg',
                label: 'Mobile Transfers',
                desc: 'Send money from anywhere, anytime',
              },
              {
                src: '/images/card-deposit.jpg',
                label: 'Card Deposits',
                desc: 'Fund your account with any debit card',
              },
              {
                src: '/images/tracking.jpg',
                label: 'Track Everything',
                desc: 'Full transaction history at your fingertips',
              },
            ].map(({ src, label, desc }) => (
              <div key={label} className="relative rounded-2xl overflow-hidden group shadow-md">
                <img
                  src={src}
                  alt={label}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.parentElement.style.background = '#065f46'
                    e.currentTarget.style.display = 'none'
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/10 to-transparent" />
                {/* Label */}
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="text-white font-bold text-base">{label}</p>
                  <p className="text-emerald-300 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white dark:bg-emerald-900">
        <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-extrabold mb-12 text-gray-900 dark:text-white">Get started in three steps</h2>
            <div className="flex flex-col gap-10">
              <Step number="1" title="Fill in your details"
                desc="Provide your name, email, phone, date of birth, and home address. Takes under 2 minutes." />
              <Step number="2" title="Receive your account number"
                desc="Your savings account is created instantly with a unique account number you can use immediately." />
              <Step number="3" title="Fund it and transact"
                desc="Deposit with your debit card, send money to other accounts, and upgrade your tier via KYC for higher limits." />
            </div>
            <div className="mt-12">
              <Link to={ROUTES.register}>
                <Button className="px-8 py-3.5 text-base">Create My Account</Button>
              </Link>
            </div>
          </div>

          {/* Real photo — person completing a card payment on phone */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-emerald-700">
                <img
                  src="/images/how-it-works.jpg"
                  alt="Nigerian person using their mobile phone for a transaction"
                  className="w-full object-cover"
                  style={{ maxHeight: 420 }}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-emerald-900 border border-gray-100 dark:border-emerald-700 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center text-emerald-600 text-lg font-bold">✓</div>
                <div>
                  <p className="text-gray-900 dark:text-white text-xs font-semibold">Transfer Successful</p>
                  <p className="text-gray-400 dark:text-emerald-400 text-xs">₦5,000 · Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-gray-50 dark:bg-emerald-950 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-14 text-gray-900 dark:text-white">
            What our customers say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'I opened my account in literally 2 minutes. Sending money to my sister in Abuja was instant.',
                name: 'Chinwe A.', location: 'Lagos',
                initials: 'CA',
                photo: '/images/avatar-chinwe.jpg',
              },
              {
                quote: 'The card deposit feature is seamless. I topped up my account from my GTBank card without any stress.',
                name: 'Emeka O.', location: 'Port Harcourt',
                initials: 'EO',
                photo: '/images/avatar-emeka.jpg',
              },
              {
                quote: "Finally a bank that works fully online. No branches, no queues — just my phone and I'm done.",
                name: 'Fatima M.', location: 'Kano',
                initials: 'FM',
                photo: '/images/avatar-fatima.jpg',
              },
            ].map(({ quote, name, location, initials, photo }) => (
              <div key={name} className="bg-white dark:bg-emerald-900 border border-gray-100 dark:border-emerald-800 rounded-xl p-6 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-emerald-500 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-emerald-200 text-sm leading-relaxed mb-5 italic">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    <span className="z-0">{initials}</span>
                    <img
                      src={photo}
                      alt={name}
                      className="absolute inset-0 w-full h-full object-cover z-10"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white text-sm font-semibold">{name}</p>
                    <p className="text-gray-400 dark:text-emerald-400 text-xs">{location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-emerald-700 dark:bg-emerald-800 py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-4 text-white">Ready to open your account?</h2>
          <p className="text-emerald-200 text-lg mb-10 leading-relaxed">
            Join thousands of Nigerians banking smarter. Takes less than 2 minutes. No branch visit required.
          </p>
          <Link
            to={ROUTES.register}
            className="inline-flex items-center justify-center px-10 py-4 text-lg bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-lg shadow-xl transition-colors"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

    </div>
  )
}
