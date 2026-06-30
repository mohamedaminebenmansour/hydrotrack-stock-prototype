import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'hydrotrack_theme';

  isDarkMode = signal<boolean>(false);

  constructor() {
    this.loadTheme();
    effect(() => {
      this.applyTheme();
    });
  }

  private loadTheme(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.isDarkMode.set(stored === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }
  }

  private applyTheme(): void {
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(this.STORAGE_KEY, this.isDarkMode() ? 'dark' : 'light');
  }

  toggleTheme(): void {
    this.isDarkMode.update(value => !value);
  }

  setDarkMode(isDark: boolean): void {
    this.isDarkMode.set(isDark);
  }
}
