import type { Airport } from "./flightDetails";

export interface DayPlan {
  day: number;
  title: string;
  activities: Array<{
    time: string;
    type: string;
    description: string;
    location?: string;
  }>;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  city: string;
  country: string;
  dateFrom: string;
  dateTo: string;
  adults: number;
  fromAirport?: string;
  toAirport?: string;
  extraPreferences?: string;
  includeFlights: boolean;
  includeStays: boolean;
  selectedFlight?: any; // import { FlightOffer } from './flightDetails' if you want strict typing
  selectedStay?: any; // define StayHotel type if you want strict typing
  stayBookingUrl?: string;
  itinerary: DayPlan[];
  status: "draft" | "active" | "archived" | "deleted";
  createdAt: string;
}
