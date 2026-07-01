import { Injectable, signal, computed } from '@angular/core';

export type UserRole = 'owner' | 'manager' | 'subcontractor' | null;

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly STORAGE_KEY = 'hydrotrack_role';
  private roleSignal = signal<UserRole>(this.loadRole());

  currentRole = computed(() => this.roleSignal());

  private loadRole(): UserRole {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'owner' || stored === 'manager' || stored === 'subcontractor') {
      return stored;
    }
    return null;
  }

  setRole(role: UserRole): void {
    this.roleSignal.set(role);
    if (role) {
      localStorage.setItem(this.STORAGE_KEY, role);
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  clearRole(): void {
    this.roleSignal.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return this.roleSignal() !== null;
  }
}
