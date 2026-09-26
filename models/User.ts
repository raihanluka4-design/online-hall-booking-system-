import { Role, User as IUser, UserStatus } from '../types';

/**
 * OOP Representation: User Model Class
 * Encapsulates user entity properties and role validation methods.
 */
export class UserModel implements IUser {
  userId: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: Role;
  status: UserStatus;
  department?: string;
  createdAt: string;

  constructor(data: IUser) {
    this.userId = data.userId;
    this.name = data.name;
    this.email = data.email.toLowerCase().trim();
    this.phone = data.phone;
    this.password = data.password;
    this.role = data.role;
    this.status = data.status || 'ACTIVE';
    this.department = data.department || 'AI & ML';
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  isActive(): boolean {
    return this.status === 'ACTIVE';
  }

  getDisplayName(): string {
    return this.name;
  }

  getMaskedEmail(): string {
    const parts = this.email.split('@');
    if (parts.length < 2) return this.email;
    const name = parts[0];
    const masked = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : name;
    return `${masked}@${parts[1]}`;
  }

  toJSON(): IUser {
    return {
      userId: this.userId,
      name: this.name,
      email: this.email,
      phone: this.phone,
      role: this.role,
      status: this.status,
      department: this.department,
      createdAt: this.createdAt,
    };
  }
}
