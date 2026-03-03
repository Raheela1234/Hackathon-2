// T029: Sign up page with SignUpForm and navigation links


import Link from 'next/link';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0B0B12] text-[#EDEEF3] space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#EDEEF3]">Sign Up</h2>
        <p className="mt-2 text-sm text-[#9CA3AF]">
          Create an account to start managing your tasks.
        </p>
      </div>

      <SignUpForm />

      <div className="text-center text-sm">
        <span className="text-[#9CA3AF]">Already have an account? </span>
        <Link
          href="/signin"
          className="font-medium text-[#A78BFA] hover:bg-[#A78BFA]/10 px-2 py-1 rounded-lg transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
