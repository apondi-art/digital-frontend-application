import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import Button from '../components/common/Button'

// ── Inline SVG illustrations (aria-hidden — purely decorative) ───────────────

function PhoneMockup() {
  return (
    <svg viewBox="0 0 220 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[220px]" aria-hidden="true">
      <rect x="10" y="10" width="200" height="380" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
      <rect x="20" y="40" width="180" height="310" fill="#065f46" />
      <rect x="75" y="14" width="70" height="12" fill="#047857" />
      <rect x="28" y="50" width="40" height="6" fill="#34d399" opacity="0.4" />
      <rect x="160" y="50" width="30" height="6" fill="#34d399" opacity="0.4" />
      <rect x="28" y="72" width="164" height="90" fill="#047857" />
      <text x="38" y="95" fill="#6ee7b7" fontSize="8" fontFamily="monospace">Account Balance</text>
      <text x="38" y="115" fill="white" fontSize="18" fontWeight="bold" fontFamily="monospace">₦ 245,000</text>
      <text x="38" y="132" fill="#6ee7b7" fontSize="8" fontFamily="monospace">**** **** **** 4821</text>
      <text x="38" y="150" fill="#6ee7b7" fontSize="7" fontFamily="monospace">SAVINGS · ACTIVE</text>
      <rect x="28" y="174" width="46" height="46" fill="#065f46" stroke="#34d399" strokeWidth="1" />
      <text x="51" y="201" fill="#34d399" fontSize="16" textAnchor="middle">⇄</text>
      <text x="51" y="213" fill="#6ee7b7" fontSize="6" textAnchor="middle">Transfer</text>
      <rect x="83" y="174" width="46" height="46" fill="#065f46" stroke="#34d399" strokeWidth="1" />
      <text x="106" y="201" fill="#34d399" fontSize="16" textAnchor="middle">↓</text>
      <text x="106" y="213" fill="#6ee7b7" fontSize="6" textAnchor="middle">Deposit</text>
      <rect x="138" y="174" width="46" height="46" fill="#065f46" stroke="#34d399" strokeWidth="1" />
      <text x="161" y="201" fill="#34d399" fontSize="16" textAnchor="middle">↻</text>
      <text x="161" y="213" fill="#6ee7b7" fontSize="6" textAnchor="middle">Re-query</text>
      <text x="28" y="244" fill="#6ee7b7" fontSize="7" fontFamily="monospace">RECENT TRANSACTIONS</text>
      {[
        { label: 'Transfer to Emeka', amt: '-₦5,000', y: 260 },
        { label: 'Card Deposit',      amt: '+₦20,000', y: 278 },
        { label: 'Transfer to Aisha', amt: '-₦2,500', y: 296 },
      ].map(({ label, amt, y }) => (
        <g key={y}>
          <rect x="28" y={y - 10} width="164" height="1" fill="#047857" />
          <text x="30" y={y + 2} fill="white" fontSize="7">{label}</text>
          <text x="188" y={y + 2} fill={amt.startsWith('+') ? '#34d399' : '#fca5a5'} fontSize="7" textAnchor="end">{amt}</text>
        </g>
      ))}
      <rect x="20" y="330" width="180" height="1" fill="#047857" />
      {['⊞','⇄','↓','↻'].map((icon, i) => (
        <text key={i} x={51 + i * 40} y={355} fill={i === 0 ? '#34d399' : '#6ee7b7'} fontSize="14" textAnchor="middle">{icon}</text>
      ))}
      <rect x="75" y="382" width="70" height="3" fill="#34d399" opacity="0.5" />
    </svg>
  )
}

function TransferIllustration() {
  return (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 mx-auto mb-4" aria-hidden="true">
      <rect x="8" y="30" width="52" height="60" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
      <text x="34" y="58" fill="#34d399" fontSize="14" textAnchor="middle">₦</text>
      <text x="34" y="72" fill="#6ee7b7" fontSize="6" textAnchor="middle">SENDER</text>
      <rect x="100" y="30" width="52" height="60" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
      <text x="126" y="58" fill="#34d399" fontSize="14" textAnchor="middle">₦</text>
      <text x="126" y="72" fill="#6ee7b7" fontSize="6" textAnchor="middle">RECEIVER</text>
      <line x1="64" y1="60" x2="96" y2="60" stroke="#34d399" strokeWidth="2" />
      <polygon points="96,55 104,60 96,65" fill="#34d399" />
      <text x="80" y="52" fill="#6ee7b7" fontSize="7" textAnchor="middle">instant</text>
    </svg>
  )
}

function ShieldIllustration() {
  return (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 mx-auto mb-4" aria-hidden="true">
      <path d="M80 10 L130 30 L130 75 Q130 100 80 115 Q30 100 30 75 L30 30 Z" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
      <path d="M80 22 L118 38 L118 74 Q118 94 80 106 Q42 94 42 74 L42 38 Z" fill="#047857" />
      <text x="80" y="72" fill="#34d399" fontSize="28" textAnchor="middle">✓</text>
    </svg>
  )
}

function ChartIllustration() {
  return (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 mx-auto mb-4" aria-hidden="true">
      <rect x="20" y="20" width="120" height="80" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
      {[40, 60, 80].map(y => <line key={y} x1="30" y1={y} x2="130" y2={y} stroke="#047857" strokeWidth="0.5" />)}
      {[
        { x: 35, h: 30, col: '#34d399' },
        { x: 55, h: 50, col: '#6ee7b7' },
        { x: 75, h: 20, col: '#34d399' },
        { x: 95, h: 55, col: '#6ee7b7' },
        { x: 115, h: 40, col: '#34d399' },
      ].map(({ x, h, col }) => (
        <rect key={x} x={x} y={90 - h} width="14" height={h} fill={col} />
      ))}
    </svg>
  )
}

function CardIllustration() {
  return (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 mx-auto mb-4" aria-hidden="true">
      <rect x="30" y="25" width="110" height="68" fill="#047857" stroke="#34d399" strokeWidth="1" />
      <rect x="20" y="35" width="110" height="68" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
      <rect x="32" y="52" width="18" height="14" fill="#34d399" opacity="0.8" />
      <line x1="32" y1="59" x2="50" y2="59" stroke="#065f46" strokeWidth="1" />
      <line x1="41" y1="52" x2="41" y2="66" stroke="#065f46" strokeWidth="1" />
      <text x="32" y="82" fill="#6ee7b7" fontSize="7" fontFamily="monospace" letterSpacing="1">**** **** 4821</text>
      <text x="32" y="95" fill="#34d399" fontSize="6" fontFamily="monospace">VALID THRU  12/29</text>
    </svg>
  )
}

// ── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({ title, desc, illustration }) {
  return (
    <div className="bg-gray-100 border border-gray-200 dark:bg-emerald-800 dark:border-emerald-700 p-6 text-center">
      {illustration}
      <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-emerald-300 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

// ── Step card ────────────────────────────────────────────────────────────────

function Step({ number, title, desc }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 bg-emerald-500 dark:bg-emerald-400 text-white dark:text-emerald-900 font-bold text-lg flex items-center justify-center shrink-0">
        {number}
      </div>
      <div>
        <h4 className="text-gray-900 dark:text-white font-semibold mb-1">{title}</h4>
        <p className="text-gray-600 dark:text-emerald-300 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="text-gray-900 dark:text-white">

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-emerald-100 text-emerald-700 dark:bg-emerald-700 dark:text-emerald-300 text-xs font-semibold px-3 py-1 mb-6 tracking-widest uppercase">
            Nigerian Digital Banking
          </span>
          <h1 className="text-5xl font-bold leading-tight mb-6 text-gray-900 dark:text-white">
            Banking that works<br />
            <span className="text-emerald-600 dark:text-emerald-400">as fast as you do.</span>
          </h1>
          <p className="text-gray-600 dark:text-emerald-300 text-lg leading-relaxed mb-8 max-w-lg">
            Open a personal savings account in minutes. Send money, fund your wallet
            with any debit card, and track every transaction — all in one place.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link to={ROUTES.register}>
              <Button className="px-8 py-3 text-base">Open an Account</Button>
            </Link>
            <span className="text-emerald-600 dark:text-emerald-400 text-sm">Free · No card required</span>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mt-10">
            {[
              { icon: '🔒', label: 'Bank-grade security' },
              { icon: '⚡', label: 'Instant transfers' },
              { icon: '🇳🇬', label: 'Nigerian residents' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-gray-100 border border-gray-200 dark:bg-emerald-800 dark:border-emerald-700 px-3 py-2 text-sm text-gray-700 dark:text-emerald-200">
                <span aria-hidden="true">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phone illustration */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400 opacity-10 blur-3xl scale-75" aria-hidden="true" />
            <div className="relative w-56">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-t border-b border-gray-200 bg-gray-100 dark:border-emerald-700 dark:bg-emerald-800">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '2 min',   label: 'Account opening time' },
            { value: 'Instant', label: 'Transfer speed' },
            { value: '100%',    label: 'Online — no branch needed' },
            { value: 'Tier 1',  label: 'Savings account' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{value}</p>
              <p className="text-gray-600 dark:text-emerald-300 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">Everything you need to bank smarter</h2>
          <p className="text-gray-600 dark:text-emerald-300 max-w-xl mx-auto">
            DigitalBank gives you the tools to manage your money without ever stepping into a branch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-emerald-700">
          <FeatureCard
            illustration={<TransferIllustration />}
            title="Instant Transfers"
            desc="Send money to any DigitalBank account in seconds. No delays, no queues — just type the account number and confirm."
          />
          <FeatureCard
            illustration={<CardIllustration />}
            title="Card Deposits"
            desc="Fund your account using any Nigerian debit card. Supports both immediate and card-pending payment flows."
          />
          <FeatureCard
            illustration={<ChartIllustration />}
            title="Transaction Tracking"
            desc="Every deposit and transfer is logged with a full audit trail. Re-query any pending transaction to get its final status."
          />
          <FeatureCard
            illustration={<ShieldIllustration />}
            title="Secure Accounts"
            desc="Your account is protected with industry-standard encryption. NIN and BVN verification keep your identity safe."
          />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-gray-100 border-t border-gray-200 dark:bg-emerald-800 dark:border-emerald-700">
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">Get started in three steps</h2>
            <div className="flex flex-col gap-8">
              <Step number="1" title="Fill in your details"
                desc="Provide your name, email, phone number, date of birth, and home address. NIN and BVN are optional but help verify your identity." />
              <Step number="2" title="Receive your account number"
                desc="Your savings account is created instantly. You'll receive a unique account number you can use to receive transfers immediately." />
              <Step number="3" title="Fund it and start transacting"
                desc="Deposit funds with your debit card, send money to others, and use Re-query to confirm any pending transactions." />
            </div>
            <div className="mt-10">
              <Link to={ROUTES.register}>
                <Button variant="outline" className="px-8 py-3 text-base">Create My Account</Button>
              </Link>
            </div>
          </div>

          {/* Account card mockup */}
          <div className="flex justify-center">
            <svg viewBox="0 0 340 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm" aria-hidden="true">
              <rect x="20" y="30" width="300" height="170" fill="#047857" />
              <rect x="10" y="20" width="300" height="170" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
              <text x="28" y="50" fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="sans-serif" letterSpacing="2">DIGITALBANK</text>
              <rect x="28" y="62" width="30" height="22" fill="#34d399" opacity="0.7" />
              <line x1="28" y1="73" x2="58" y2="73" stroke="#065f46" strokeWidth="1.5" />
              <line x1="43" y1="62" x2="43" y2="84" stroke="#065f46" strokeWidth="1.5" />
              <path d="M80 68 Q88 73 80 78" stroke="#6ee7b7" strokeWidth="1.5" fill="none" />
              <path d="M84 64 Q96 73 84 82" stroke="#6ee7b7" strokeWidth="1.5" fill="none" />
              <text x="28" y="115" fill="white" fontSize="14" fontFamily="monospace" letterSpacing="3">**** **** **** 4821</text>
              <text x="28" y="150" fill="#6ee7b7" fontSize="10" fontFamily="monospace">ADA OKONKWO</text>
              <text x="240" y="150" fill="#6ee7b7" fontSize="10" fontFamily="monospace">12/29</text>
              <text x="28" y="175" fill="#34d399" fontSize="8" fontFamily="monospace" letterSpacing="1">SAVINGS  ·  TIER 1  ·  ACTIVE</text>
              <circle cx="270" cy="100" r="50" stroke="#34d399" strokeWidth="0.5" opacity="0.2" />
              <circle cx="270" cy="100" r="35" stroke="#34d399" strokeWidth="0.5" opacity="0.2" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Ready to open your account?</h2>
        <p className="text-gray-600 dark:text-emerald-300 text-lg mb-8 max-w-md mx-auto">
          Join thousands of Nigerians banking smarter. It takes less than 2 minutes.
        </p>
        <Link to={ROUTES.register}>
          <Button className="px-10 py-4 text-lg">Get Started — It's Free</Button>
        </Link>
      </section>

    </div>
  )
}
