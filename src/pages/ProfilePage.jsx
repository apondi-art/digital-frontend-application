import { useState, useEffect } from "react";
import { getUserProfile } from "../api/accountApi";
import { useAccount, setAccount } from "../hooks/useAccount";
import { formatDate } from "../utils/format";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";

function TierBadge({ tier }) {
  const styles = {
    TIER_1:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    TIER_2: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    TIER_3:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  };
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-bold rounded ${styles[tier] ?? "bg-gray-100 text-gray-700"}`}
    >
      {tier ?? "Unknown"}
    </span>
  );
}

function ProfileField({ label, value, mono = false }) {
  if (!value) return null;
  return (
    <div className='flex flex-col gap-1'>
      <span className='text-xs font-semibold text-gray-400 dark:text-emerald-500 uppercase tracking-widest'>
        {label}
      </span>
      <span
        className={`text-sm text-gray-900 dark:text-white ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function SensitiveField({ label, value }) {
  const [revealed, setRevealed] = useState(false);
  if (!value) return null;
  return (
    <div className='flex flex-col gap-1'>
      <span className='text-xs font-semibold text-gray-400 dark:text-emerald-500 uppercase tracking-widest'>
        {label}
      </span>
      <div className='flex items-center gap-3'>
        <span className='text-sm font-mono text-gray-900 dark:text-white'>
          {revealed ? value : "•".repeat(Math.min(value.length, 11))}
        </span>
        <button
          type='button'
          onClick={() => setRevealed((v) => !v)}
          className='text-xs text-emerald-600 dark:text-emerald-400 hover:underline'
          aria-label={revealed ? `Hide ${label}` : `Reveal ${label}`}
        >
          {revealed ? "Hide" : "Reveal"}
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const account = useAccount();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUserProfile()
      .then((res) => {
        const data = res.data;
        if (data) {
          setProfile(data);
          // Keep session state fresh
          setAccount({
            accountId: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            dateOfBirth: data.dateOfBirth,
            address: data.address,
            nin: data.nin,
            bvn: data.bvn,
          });
        }
      })
      .catch(() => {
        // Fall back to session state if profile fetch fails
        setProfile(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const data = profile ?? account;

  if (loading) {
    return (
      <div className='max-w-2xl space-y-4'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='h-16 bg-gray-100 dark:bg-emerald-900 rounded-xl animate-pulse'
          />
        ))}
      </div>
    );
  }

  return (
    <div className='max-w-2xl space-y-6'>
      <div>
        <h2 className='text-2xl font-extrabold text-gray-900 dark:text-white'>
          My Profile
        </h2>
        <p className='text-gray-500 dark:text-emerald-300 text-sm mt-1'>
          Your account information and verification status.
        </p>
      </div>

      {/* Personal Details */}
      <Card>
        <h3 className='text-sm font-bold text-gray-700 dark:text-emerald-300 uppercase tracking-widest mb-4'>
          Personal Details
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          <ProfileField label='First Name' value={data.firstName} />
          <ProfileField label='Last Name' value={data.lastName} />
          <ProfileField label='Email Address' value={data.email} />
          <ProfileField label='Phone Number' value={data.phoneNumber} mono />
          <ProfileField label='Gender' value={data.gender} />
          <ProfileField
            label='Date of Birth'
            value={new Intl.DateTimeFormat("en-US", {
              dateStyle: "long",
            }).format(new Date(data.dateOfBirth))}
          />
          <div className='sm:col-span-2'>
            <ProfileField label='Address' value={data.address} />
          </div>
        </div>
      </Card>

      {/* Account Details */}
      <Card>
        <h3 className='text-sm font-bold text-gray-700 dark:text-emerald-300 uppercase tracking-widest mb-4'>
          Account Details
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          <ProfileField
            label='Account Number'
            value={data.accountNumber}
            mono
          />
          <div className='flex flex-col gap-1'>
            <span className='text-xs font-semibold text-gray-400 dark:text-emerald-500 uppercase tracking-widest'>
              Account Tier
            </span>
            <TierBadge tier={profile?.accountDto.accountTier} />
          </div>
          <div className='flex flex-col gap-1'>
            <span className='text-xs font-semibold text-gray-400 dark:text-emerald-500 uppercase tracking-widest'>
              Role
            </span>
            <span className='text-sm text-gray-900 dark:text-white'>
              {data.role ?? "—"}
            </span>
          </div>
        </div>
      </Card>

      {/* KYC / Identity Verification */}
      <Card>
        <h3 className='text-sm font-bold text-gray-700 dark:text-emerald-300 uppercase tracking-widest mb-4'>
          Identity Verification (KYC)
        </h3>
        <div className='space-y-4'>
          <SensitiveField
            label='NIN (National Identification Number)'
            value={data.nin}
          />
          <SensitiveField
            label='BVN (Bank Verification Number)'
            value={data.bvn}
          />
          {!data.nin && !data.bvn && (
            <p className='text-sm text-gray-400 dark:text-emerald-500'>
              No KYC documents submitted yet. Go to{" "}
              <a
                href='/kyc'
                className='text-emerald-600 dark:text-emerald-400 hover:underline'
              >
                Upgrade Tier
              </a>{" "}
              to submit your NIN or BVN.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
