export interface Airport {
  // This file defines TypeScript interfaces for flight details, including airports, carriers, flight information, segments, baggage policies, and more.
  id: string;
  type: string;
  code: string;
  name: string;
  city: string;
  cityName: string;
  country: string;
  countryName: string;
  province?: string;
}

export interface CarrierData {
  name: string;
  code: string;
  logo: string;
}

export interface FlightInfo {
  facilities: string[];
  flightNumber: number;
  planeType: string;
  carrierInfo: {
    operatingCarrier: string;
    marketingCarrier: string;
    operatingCarrierDisclosureText: string;
  };
}

export interface Leg {
  departureTime: string;
  arrivalTime: string;
  departureAirport: Airport;
  arrivalAirport: Airport;
  cabinClass: string;
  flightInfo: FlightInfo;
  carriers: string[];
  carriersData: CarrierData[];
  totalTime: number;
  flightStops: any[];
  amenities: any[];
}

export interface Segment {
  departureAirport: Airport;
  arrivalAirport: Airport;
  departureTime: string;
  arrivalTime: string;
  legs: Leg[];
  totalTime: number;
  travellerCheckedLuggage: any[];
  travellerCabinLuggage: any[];
  isAtolProtected: boolean;
  isVirtualInterlining: boolean;
  showWarningDestinationAirport: boolean;
  showWarningOriginAirport: boolean;
}

export interface BaggagePolicy {
  code: string;
  name: string;
  url: string;
}

export interface PriceBreakdown {
  total: {
    currencyCode: string;
    units: number;
    nanos: number;
  };
  baseFare: {
    currencyCode: string;
    units: number;
    nanos: number;
  };
  fee: {
    currencyCode: string;
    units: number;
    nanos: number;
  };
  tax: {
    currencyCode: string;
    units: number;
    nanos: number;
  };
}

export interface FlightDetailsData {
  segments: Segment[];
  priceBreakdown: PriceBreakdown;
  baggagePolicies: BaggagePolicy[];
}

export interface TravellerCabinLuggage {
  travellerReference: string;
  luggageAllowance: {
    luggageType: string;
    maxPiece: number;
    maxWeightPerPiece: number;
    massUnit: string;
    sizeRestrictions: {
      maxLength: number;
      maxWidth: number;
      maxHeight: number;
      sizeUnit: string;
    };
  };
}

export interface ExtraProduct {
  type: string;
  priceBreakdown: {
    total: {
      currencyCode: string;
      units: number;
      nanos: number;
    };
  };
}

export interface FareRule {
  type: string;
  priceBreakdown: {
    total: {
      currencyCode: string;
      units: number;
      nanos: number;
    };
  };
}
