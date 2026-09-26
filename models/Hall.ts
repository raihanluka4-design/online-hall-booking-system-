import { Hall as IHall, HallStatus, HallType } from '../types';

/**
 * OOP Representation: Hall Model Class
 * Encapsulates hall state, facility checking, and availability eligibility.
 */
export class HallModel implements IHall {
  hallId: string;
  hallName: string;
  capacity: number;
  location: string;
  facilities: string[];
  description: string;
  image: string;
  status: HallStatus;
  type: HallType;
  rules?: string[];

  constructor(data: IHall) {
    this.hallId = data.hallId;
    this.hallName = data.hallName;
    this.capacity = data.capacity;
    this.location = data.location;
    this.facilities = [...data.facilities];
    this.description = data.description;
    this.image = data.image;
    this.status = data.status || 'AVAILABLE';
    this.type = data.type;
    this.rules = data.rules || [
      'Prior booking of at least 2 hours is required',
      'Food and open drinks are strictly prohibited inside',
      'Ensure all equipment is turned off after use'
    ];
  }

  isAvailableForBooking(): boolean {
    return this.status === 'AVAILABLE';
  }

  hasFacility(facilityName: string): boolean {
    return this.facilities.some(
      f => f.toLowerCase().includes(facilityName.toLowerCase())
    );
  }

  canAccommodate(attendeeCount: number): boolean {
    return attendeeCount <= this.capacity;
  }

  toJSON(): IHall {
    return {
      hallId: this.hallId,
      hallName: this.hallName,
      capacity: this.capacity,
      location: this.location,
      facilities: this.facilities,
      description: this.description,
      image: this.image,
      status: this.status,
      type: this.type,
      rules: this.rules,
    };
  }
}
