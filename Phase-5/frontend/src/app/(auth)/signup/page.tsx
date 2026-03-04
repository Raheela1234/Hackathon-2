// T029: Sign up page with SignUpForm and navigation links

import Link from 'next/link';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white/90">Sign Up</h2>
        <p className="mt-2 text-sm text-white">Create an account to manage your tasks.</p>
      </div>

      <SignUpForm />

      <div className="text-center text-sm">
        <span className="text-white">Already have an account? </span>
        <Link
          href="/signin"
          className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
