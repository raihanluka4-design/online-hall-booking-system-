import React, { useState } from 'react';
import { Role, User, UserStatus } from '../../types';
import { authService } from '../../services/authService';
import { useToast } from '../../hooks';
import { Modal } from '../common/Modal';
import { UserCheck, Shield, Phone, Mail, Building } from 'lucide-react';

interface UserManagementModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  user,
  isOpen,
  onClose,
  onUserUpdated,
}) => {
  const { success, error } = useToast();
  const [role, setRole] = useState<Role>(user?.role || 'USER');
  const [status, setStatus] = useState<UserStatus>(user?.status || 'ACTIVE');

  React.useEffect(() => {
    if (user) {
      setRole(user.role);
      setStatus(user.status);
    }
  }, [user]);

  if (!user) return null;

  const handleSave = () => {
    try {
      authService.updateUserRole(user.userId, role);
      authService.updateUserStatus(user.userId, status);
      success('User Updated', `${user.name}'s permissions have been updated.`);
      onUserUpdated();
      onClose();
    } catch (err: any) {
      error('Update Failed', err.message || 'Unable to update user.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          Manage User: {user.name}
        </span>
      }
      description={`User ID: ${user.userId}`}
      maxWidth="md"
    >
      <div className="space-y-5 pt-2">
        {/* User Info Overview */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Mail className="h-3.5 w-3.5 text-brand-500" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Phone className="h-3.5 w-3.5 text-brand-500" />
            <span>{user.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Building className="h-3.5 w-3.5 text-brand-500" />
            <span>{user.department || 'AI & ML'}</span>
          </div>
        </div>

        {/* Role Toggle */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            System Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('USER')}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                role === 'USER'
                  ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 ring-2 ring-brand-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              Student / Staff (USER)
            </button>

            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                role === 'ADMIN'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Shield className="h-3.5 w-3.5 text-indigo-600" />
              Administrator (ADMIN)
            </button>
          </div>
        </div>

        {/* Status Toggle */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Account Status
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStatus('ACTIVE')}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                status === 'ACTIVE'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
              }`}
            >
              Active
            </button>

            <button
              type="button"
              onClick={() => setStatus('DISABLED')}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                status === 'DISABLED'
                  ? 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 ring-2 ring-rose-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
              }`}
            >
              Disabled / Suspended
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all"
          >
            Save User Settings
          </button>
        </div>
      </div>
    </Modal>
  );
};
