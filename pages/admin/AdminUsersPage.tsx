import React, { useState, useMemo } from 'react';
import { useBookingContext, useToast } from '../../hooks';
import { authService } from '../../services/authService';
import { User, Role, UserStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { UserManagementModal } from '../../components/admin/UserManagementModal';
import { formatDate } from '../../utils/dateUtils';
import { Users, Search, Shield, UserCheck, Edit3, UserX, UserPlus } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { bookings } = useBookingContext();
  const { success } = useToast();

  const [users, setUsers] = useState<User[]>(() => authService.getAllUsers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);

  const refreshUsers = () => {
    setUsers(authService.getAllUsers());
  };

  const handleToggleStatus = (user: User) => {
    const newStatus: UserStatus = user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    authService.updateUserStatus(user.userId, newStatus);
    success(
      `User ${newStatus === 'ACTIVE' ? 'Activated' : 'Disabled'}`,
      `${user.name}'s account is now ${newStatus.toLowerCase()}.`
    );
    refreshUsers();
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesId = u.userId.toLowerCase().includes(q);
        const matchesDept = (u.department || '').toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesId && !matchesDept) return false;
      }

      return true;
    });
  }, [users, roleFilter, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
            <Users className="h-3.5 w-3.5" /> User Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            User Accounts & Roles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage student and faculty accounts, privilege elevation, and account status.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users by name, email, or user ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">Role:</span>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white font-semibold"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="USER">Students / Staff</option>
            <option value="ADMIN">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-4 px-4">User ID</th>
                <th className="py-4 px-4">Name & Email</th>
                <th className="py-4 px-4">Phone</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Bookings</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map(user => {
                const userBookingCount = bookings.filter(b => b.userId === user.userId).length;

                return (
                  <tr
                    key={user.userId}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {user.userId}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {user.name}
                        {user.role === 'ADMIN' && (
                          <Shield className="h-3 w-3 text-indigo-500" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{user.email}</div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                      {user.phone}
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {user.department || 'AI & ML'}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          user.role === 'ADMIN'
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {userBookingCount}
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={user.status} size="sm" />
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUserForEdit(user)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl border text-xs font-semibold transition-colors ${
                            user.status === 'ACTIVE'
                              ? 'border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/40'
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/60 dark:hover:bg-emerald-950/40'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Management Modal */}
      {selectedUserForEdit && (
        <UserManagementModal
          isOpen={!!selectedUserForEdit}
          user={selectedUserForEdit}
          onClose={() => setSelectedUserForEdit(null)}
          onUserUpdated={refreshUsers}
        />
      )}
    </div>
  );
};
