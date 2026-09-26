import React, { useState } from 'react';
import { useToast } from '../../hooks';
import { validateEmail } from '../../utils/validationUtils';
import { KeyRound, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      error('Validation Error', 'Please enter a valid email address.');
      return;
    }

    setIsSubmitted(true);
    success('Reset Link Sent', `Password reset instructions sent to ${email} (Demo simulated).`);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/30 mb-2">
          <KeyRound className="h-6 w-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Reset Password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Enter your registered institutional email to receive a recovery link
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
        {isSubmitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 shadow-sm">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Instructions Sent</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              If an account exists for <strong className="text-slate-800 dark:text-slate-200">{email}</strong>, a password reset link has been dispatched.
            </p>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onNavigate('/login')}
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Registered Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              Send Reset Link
            </button>

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Return to sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
