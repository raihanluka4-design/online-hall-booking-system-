import React, { useState } from 'react';
import { useAuth, useToast } from '../../hooks';
import { validateEmail, validatePhone, validatePassword } from '../../utils/validationUtils';
import { Building2, UserPlus, Sparkles, ArrowRight } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('AI & ML');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      error('Validation Error', 'Please enter a valid full name (at least 2 characters).');
      return;
    }

    if (!validateEmail(email)) {
      error('Validation Error', 'Please enter a valid email address.');
      return;
    }

    if (!validatePhone(phone)) {
      error('Validation Error', 'Please enter a valid 10-digit phone number.');
      return;
    }

    const passCheck = validatePassword(password);
    if (!passCheck.isValid) {
      error('Validation Error', passCheck.message || 'Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      error('Validation Error', 'Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newUser = await register({
        name,
        email,
        phone,
        department,
        password,
        confirmPassword,
      });

      success('Registration Successful', `Welcome to HallBook, ${newUser.name}!`);
      onNavigate('/user/dashboard');
    } catch (err: any) {
      error('Registration Failed', err.message || 'Unable to complete registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/30 mb-2">
          <UserPlus className="h-6 w-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Create Your Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Register with your college details to start booking campus venues
        </p>
      </div>

      {/* Main Register Form Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Alex Mercer"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              College Department
            </label>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
            >
              <option value="AI & ML">AI & ML (Artificial Intelligence & ML)</option>
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Student Council">Student Council / Cultural Club</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" />
            {isSubmitting ? 'Registering Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('/login')}
            className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};
