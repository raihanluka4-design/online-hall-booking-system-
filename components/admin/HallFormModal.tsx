import React, { useState, useEffect } from 'react';
import { Hall, HallStatus, HallType } from '../../types';
import { useBookingContext, useToast } from '../../hooks';
import { Modal } from '../common/Modal';
import { Building2, Plus, Edit } from 'lucide-react';

interface HallFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  hallToEdit?: Hall | null;
}

const AVAILABLE_FACILITIES = [
  'Projector',
  'Air Conditioning',
  'Wi-Fi',
  'Sound System',
  'Stage',
  'Computers',
  'Parking',
  'Seating',
];

const PRESET_IMAGES = [
  { label: 'Auditorium Modern', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Seminar Hall', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Conference Room', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Computer Lab', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Mini Hall', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80' },
];

export const HallFormModal: React.FC<HallFormModalProps> = ({
  isOpen,
  onClose,
  hallToEdit,
}) => {
  const { addHall, updateHall } = useBookingContext();
  const { success, error } = useToast();

  const [hallName, setHallName] = useState('');
  const [capacity, setCapacity] = useState('100');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<HallType>('Seminar Hall');
  const [status, setStatus] = useState<HallStatus>('AVAILABLE');
  const [facilities, setFacilities] = useState<string[]>(['Projector', 'Air Conditioning']);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hallToEdit) {
      setHallName(hallToEdit.hallName);
      setCapacity(String(hallToEdit.capacity));
      setLocation(hallToEdit.location);
      setType(hallToEdit.type);
      setStatus(hallToEdit.status);
      setFacilities(hallToEdit.facilities);
      setDescription(hallToEdit.description);
      setImage(hallToEdit.image);
    } else {
      setHallName('');
      setCapacity('100');
      setLocation('');
      setType('Seminar Hall');
      setStatus('AVAILABLE');
      setFacilities(['Projector', 'Air Conditioning', 'Wi-Fi']);
      setDescription('');
      setImage(PRESET_IMAGES[1].url);
    }
  }, [hallToEdit, isOpen]);

  const toggleFacility = (facility: string) => {
    setFacilities(prev =>
      prev.includes(facility) ? prev.filter(f => f !== facility) : [...prev, facility]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hallName.trim()) {
      error('Please enter a hall name.');
      return;
    }
    if (!capacity || parseInt(capacity, 10) <= 0) {
      error('Please enter a valid seating capacity.');
      return;
    }
    if (!location.trim()) {
      error('Please specify the hall location/block.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (hallToEdit) {
        await updateHall(hallToEdit.hallId, {
          hallName,
          capacity: parseInt(capacity, 10),
          location,
          type,
          status,
          facilities,
          description,
          image,
        });
        success('Hall updated successfully', `${hallName} details have been saved.`);
      } else {
        await addHall({
          hallName,
          capacity: parseInt(capacity, 10),
          location,
          type,
          status,
          facilities,
          description: description || 'Equipped with modern audio-visual technology and academic infrastructure.',
          image: image || PRESET_IMAGES[0].url,
        });
        success('Hall created successfully', `${hallName} added to the system.`);
      }
      onClose();
    } catch (err: any) {
      error('Form Error', err.message || 'Failed to save hall details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          {hallToEdit ? `Edit Hall: ${hallToEdit.hallName}` : 'Add New Academic Hall'}
        </span>
      }
      description="Configure venue specifications, capacity, amenities and availability status."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Hall Name *
            </label>
            <input
              type="text"
              required
              value={hallName}
              onChange={e => setHallName(e.target.value)}
              placeholder="e.g. Science Block Auditorium"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Capacity (Seats) *
            </label>
            <input
              type="number"
              min="10"
              max="2000"
              required
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              placeholder="100"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Campus Location / Block *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Block C, 2nd Floor"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Hall Type
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value as HallType)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
            >
              <option value="Seminar Hall">Seminar Hall</option>
              <option value="Auditorium">Auditorium</option>
              <option value="Conference Hall">Conference Hall</option>
              <option value="Computer Lab">Computer Lab</option>
              <option value="Mini Hall">Mini Hall</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            Status
          </label>
          <div className="flex gap-4">
            {(['AVAILABLE', 'MAINTENANCE', 'INACTIVE'] as HallStatus[]).map(st => (
              <label key={st} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="radio"
                  name="hallStatus"
                  value={st}
                  checked={status === st}
                  onChange={() => setStatus(st)}
                  className="accent-brand-600"
                />
                <span className={st === 'AVAILABLE' ? 'text-emerald-600 font-bold' : st === 'MAINTENANCE' ? 'text-amber-600' : 'text-slate-500'}>
                  {st}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Facilities Checkboxes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Included Facilities & Amenities
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AVAILABLE_FACILITIES.map(fac => {
              const isChecked = facilities.includes(fac);
              return (
                <label
                  key={fac}
                  onClick={() => toggleFacility(fac)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                    isChecked
                      ? 'bg-brand-50 border-brand-400 text-brand-900 dark:bg-brand-950/40 dark:border-brand-600 dark:text-brand-200 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="accent-brand-600 rounded"
                  />
                  <span>{fac}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Overview of the venue features, acoustics, and suitability..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
          />
        </div>

        {/* Preset Image Picker */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Hall Cover Image URL / Preset
          </label>
          <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
            {PRESET_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setImage(preset.url)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                  image === preset.url
                    ? 'bg-brand-600 text-white border-brand-600 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <input
            type="url"
            value={image}
            onChange={e => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            {hallToEdit ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isSubmitting ? 'Saving...' : hallToEdit ? 'Save Changes' : 'Create Hall'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
