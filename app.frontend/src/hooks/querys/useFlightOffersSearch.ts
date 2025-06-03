import { useQuery } from "@tanstack/react-query";

interface FlightOffersParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  travelClass?: string;
  nonStop?: boolean;
}

export const useFlightOffersSearch = ({
  originLocationCode,
  destinationLocationCode,
  departureDate,
  returnDate,
  adults,
  travelClass,
  nonStop,
}: FlightOffersParams) => {
  return useQuery({
    queryKey: [
      "flightOffersSearch",
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      travelClass,
      nonStop,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        originLocationCode,
        destinationLocationCode,
        departureDate,
        adults: adults.toString(),
      });
      if (returnDate) params.append("returnDate", returnDate);
      if (travelClass) params.append("travelClass", travelClass);
      if (nonStop) params.append("nonStop", "true");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/flights/offers?${params}`
      );

      if (!res.ok) throw new Error("Failed to fetch flight offers");

      return res.json();
    },
    enabled:
      !!originLocationCode &&
      !!destinationLocationCode &&
      !!departureDate &&
      adults > 0,
    staleTime: 1000 * 60 * 5,
  });
};
