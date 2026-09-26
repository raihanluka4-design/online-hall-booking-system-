import React, { useState } from 'react';
import { useBookingContext, useToast } from '../../hooks';
import { Hall } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FacilityIcon } from '../../components/halls/FacilityIcon';
import { HallFormModal } from '../../components/admin/HallFormModal';
import { Modal } from '../../components/common/Modal';
import { Building2, Plus, Edit3, Trash2, MapPin, Users, AlertTriangle } from 'lucide-react';

export const AdminHallsPage: React.FC = () => {
  const { halls, deleteHall } = useBookingContext();
  const { success, error } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [hallToEdit, setHallToEdit] = useState<Hall | null>(null);
  const [hallToDelete, setHallToDelete] = useState<Hall | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const handleDeleteConfirm = async () => {
    if (!hallToDelete) return;
    try {
      await deleteHall(hallToDelete.hallId);
      success('Hall Deleted', `${hallToDelete.hallName} has been removed.`);
      setHallToDelete(null);
    } catch (err: any) {
      error('Delete Failed', err.message || 'Unable to delete hall.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-300 text-xs font-bold mb-2">
            <Building2 className="h-3.5 w-3.5" /> Campus Venues
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Hall & Auditorium Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure campus auditoriums, seminar halls, equipment, and maintenance modes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-900 shadow-sm text-brand-600' : 'text-slate-500'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-900 shadow-sm text-brand-600' : 'text-slate-500'
              }`}
            >
              Grid
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            Add New Hall
          </button>
        </div>
      </div>

      {/* View: Table Mode */}
      {viewMode === 'table' ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">Hall ID</th>
                  <th className="py-4 px-4">Venue & Photo</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Capacity</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Key Facilities</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {halls.map(hall => (
                  <tr key={hall.hallId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-4 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {hall.hallId}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={hall.image}
                          alt={hall.hallName}
                          className="h-10 w-14 rounded-lg object-cover shrink-0"
                        />
                        <span className="font-bold text-slate-900 dark:text-white">
                          {hall.hallName}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-600 dark:text-slate-300">
                      {hall.type}
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {hall.capacity} Seats
                    </td>

                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                      {hall.location}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {hall.facilities.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300"
                          >
                            {f}
                          </span>
                        ))}
                        {hall.facilities.length > 3 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{hall.facilities.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={hall.status} size="sm" />
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setHallToEdit(hall)}
                          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                          title="Edit Hall"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setHallToDelete(hall)}
                          className="p-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors"
                          title="Delete Hall"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View: Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map(hall => (
            <div
              key={hall.hallId}
              className="rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 p-5 shadow-sm space-y-4"
            >
              <div className="relative h-44 rounded-2xl overflow-hidden">
                <img
                  src={hall.image}
                  alt={hall.hallName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <StatusBadge status={hall.status} size="sm" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {hall.hallName}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" /> {hall.location}
                </p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mt-1">
                  <Users className="h-3 w-3" /> {hall.capacity} Capacity
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-mono text-slate-400">{hall.hallId}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setHallToEdit(hall)}
                    className="px-3 py-1 rounded-lg border text-xs font-semibold hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setHallToDelete(hall)}
                    className="px-3 py-1 rounded-lg border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Hall Modal */}
      {(isAddModalOpen || hallToEdit) && (
        <HallFormModal
          isOpen={isAddModalOpen || !!hallToEdit}
          hallToEdit={hallToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setHallToEdit(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {hallToDelete && (
        <Modal
          isOpen={!!hallToDelete}
          onClose={() => setHallToDelete(null)}
          title={
            <span className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" /> Delete Hall
            </span>
          }
          maxWidth="md"
        >
          <div className="space-y-4 pt-2">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Are you sure you want to delete <strong>{hallToDelete.hallName}</strong> ({hallToDelete.hallId})?
            </p>
            <p className="text-xs text-slate-500">
              This action will remove the hall from the directory and release its calendar slots.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setHallToDelete(null)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
