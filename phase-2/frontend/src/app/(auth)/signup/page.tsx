// T029: Sign up page with SignUpForm and navigation links

import Link from 'next/link';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
        <p className="mt-2 text-sm text-gray-600">Create an account to manage your tasks.</p>
      </div>

      <SignUpForm />

      <div className="text-center text-sm">
        <span className="text-gray-600">Already have an account? </span>
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
