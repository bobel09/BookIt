// shared/types/user.ts

export type Preferences = {
  currency?: string;
  interests?: string[];
  budget?: string;
  hotel?: string;
  food?: string[];
  climate?: string;
  tripStyle?: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  preferences: Preferences;
  visitedCountries: string[];
};
