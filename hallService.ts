import { Hall, HallStatus, HallType } from '../types';
import { storageService } from './storageService';

/**
 * HallService encapsulates CRUD operations and querying for Halls.
 */
class HallService {
  public getAllHalls(): Hall[] {
    return storageService.getHalls();
  }

  public getHallById(hallId: string): Hall | undefined {
    const halls = storageService.getHalls();
    return halls.find(h => h.hallId === hallId);
  }

  public addHall(data: Omit<Hall, 'hallId'>): Hall {
    if (!data.hallName || data.hallName.trim().length === 0) {
      throw new Error('Hall name is required.');
    }
    if (!data.capacity || data.capacity <= 0) {
      throw new Error('Valid capacity is required.');
    }
    if (!data.location || data.location.trim().length === 0) {
      throw new Error('Location is required.');
    }

    const halls = storageService.getHalls();
    const newId = `HALL-${String(halls.length + 1).padStart(2, '0')}`;

    const newHall: Hall = {
      hallId: newId,
      hallName: data.hallName.trim(),
      capacity: Number(data.capacity),
      location: data.location.trim(),
      facilities: Array.isArray(data.facilities) ? data.facilities : [],
      description: data.description?.trim() || 'Modern academic venue equipped with state-of-the-art facilities.',
      image: data.image?.trim() || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      status: data.status || 'AVAILABLE',
      type: data.type || 'Seminar Hall',
      rules: data.rules || [
        'Prior reservation required',
        'Maintain cleanliness inside the hall',
        'Switch off AV equipment after use',
      ],
    };

    halls.push(newHall);
    storageService.saveHalls(halls);
    return newHall;
  }

  public updateHall(hallId: string, data: Partial<Hall>): Hall {
    const halls = storageService.getHalls();
    const index = halls.findIndex(h => h.hallId === hallId);

    if (index === -1) {
      throw new Error('Hall not found.');
    }

    halls[index] = {
      ...halls[index],
      ...data,
      capacity: data.capacity !== undefined ? Number(data.capacity) : halls[index].capacity,
    };

    storageService.saveHalls(halls);
    return halls[index];
  }

  public deleteHall(hallId: string): void {
    const halls = storageService.getHalls();
    const updated = halls.filter(h => h.hallId !== hallId);
    storageService.saveHalls(updated);
  }

  public filterHalls(params: {
    query?: string;
    type?: string;
    minCapacity?: number;
    facility?: string;
    status?: HallStatus;
  }): Hall[] {
    const halls = storageService.getHalls();
    return halls.filter(hall => {
      if (params.query) {
        const q = params.query.toLowerCase().trim();
        const matchesName = hall.hallName.toLowerCase().includes(q);
        const matchesLocation = hall.location.toLowerCase().includes(q);
        const matchesDesc = hall.description.toLowerCase().includes(q);
        if (!matchesName && !matchesLocation && !matchesDesc) return false;
      }

      if (params.type && params.type !== 'ALL' && hall.type !== params.type) {
        return false;
      }

      if (params.minCapacity && hall.capacity < params.minCapacity) {
        return false;
      }

      if (params.facility && params.facility !== 'ALL') {
        const hasFac = hall.facilities.some(f => f.toLowerCase() === params.facility?.toLowerCase());
        if (!hasFac) return false;
      }

      if (params.status && params.status !== hall.status) {
        return false;
      }

      return true;
    });
  }
}

export const hallService = new HallService();
