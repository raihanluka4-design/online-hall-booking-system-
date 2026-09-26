import { Role, User, UserStatus } from '../types';
import { storageService } from './storageService';

/**
 * AuthService encapsulates all authentication and user identity operations.
 */
class AuthService {
  public async login(email: string, password: string): Promise<User> {
    const users = storageService.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    
    const user = users.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    if (user.status === 'DISABLED') {
      throw new Error('Your account has been deactivated. Please contact the administrator.');
    }

    // Save to active session
    const safeUser: User = { ...user };
    delete safeUser.password;
    storageService.setCurrentUser(safeUser);
    return safeUser;
  }

  public async register(params: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    department?: string;
    role?: Role;
  }): Promise<User> {
    const { name, email, phone, password, confirmPassword, department, role = 'USER' } = params;

    if (!name || name.trim().length < 2) {
      throw new Error('Please enter a valid full name (at least 2 characters).');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      throw new Error('Please enter a valid email address.');
    }

    if (!phone || phone.trim().length < 7) {
      throw new Error('Please enter a valid phone number.');
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match. Please re-enter.');
    }

    const users = storageService.getUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const newUser: User = {
      userId: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      password,
      role,
      status: 'ACTIVE',
      department: department || 'AI & ML',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    storageService.saveUsers(users);

    // Automatically sign in
    const safeUser = { ...newUser };
    delete safeUser.password;
    storageService.setCurrentUser(safeUser);
    return safeUser;
  }

  public logout(): void {
    storageService.setCurrentUser(null);
  }

  public getCurrentUser(): User | null {
    return storageService.getCurrentUser();
  }

  public async updateProfile(userId: string, data: { name: string; phone: string; department?: string }): Promise<User> {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.userId === userId);

    if (index === -1) {
      throw new Error('User not found.');
    }

    users[index] = {
      ...users[index],
      name: data.name.trim(),
      phone: data.phone.trim(),
      department: data.department || users[index].department,
    };

    storageService.saveUsers(users);

    const updatedUser = { ...users[index] };
    delete updatedUser.password;
    storageService.setCurrentUser(updatedUser);
    return updatedUser;
  }

  public async changePassword(userId: string, currentPass: string, newPass: string, confirmNewPass: string): Promise<void> {
    if (newPass.length < 6) {
      throw new Error('New password must be at least 6 characters.');
    }

    if (newPass !== confirmNewPass) {
      throw new Error('New passwords do not match.');
    }

    const users = storageService.getUsers();
    const user = users.find(u => u.userId === userId);

    if (!user) {
      throw new Error('User account not found.');
    }

    if (user.password !== currentPass) {
      throw new Error('Current password is incorrect.');
    }

    user.password = newPass;
    storageService.saveUsers(users);
  }

  public getAllUsers(): User[] {
    return storageService.getUsers();
  }

  public updateUserStatus(userId: string, status: UserStatus): void {
    const users = storageService.getUsers();
    const user = users.find(u => u.userId === userId);
    if (user) {
      user.status = status;
      storageService.saveUsers(users);
    }
  }

  public updateUserRole(userId: string, role: Role): void {
    const users = storageService.getUsers();
    const user = users.find(u => u.userId === userId);
    if (user) {
      user.role = role;
      storageService.saveUsers(users);
    }
  }
}

export const authService = new AuthService();
