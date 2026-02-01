import { Preference } from '../models/preference.model';

export class PreferenceService {
  private preference: Preference | null = null;

  public getPreferences(): Preference | null {
    return this.preference;
  }

  public savePreferences(data: Omit<Preference, 'id'>): Preference {
    this.preference = {
      id: 'user-pref-1', // Singleton ID for now
      ...data,
    };
    return this.preference;
  }

  public updatePreferences(
    updates: Partial<Omit<Preference, 'id'>>
  ): Preference | null {
    if (!this.preference) return null;
    this.preference = { ...this.preference, ...updates };
    return this.preference;
  }

  public deletePreferences(): boolean {
    if (!this.preference) return false;
    this.preference = null;
    return true;
  }
}
