export interface Preference {
  id: string;
  preferredTime: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  sessionLength: number;
  breakLength: number;
  weekendPreference: 'Heavy' | 'Light' | 'Free';
}
