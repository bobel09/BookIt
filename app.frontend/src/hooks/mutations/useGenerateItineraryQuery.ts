// hooks/querys/useGenerateItineraryQuery.ts
import { useMutation } from "@tanstack/react-query";

type GenerateItineraryPayload = {
  city: string;
  dateFrom: string;
  dateTo: string;
  adults: number;
  fromAirport: string | null;
  toAirport: string | null;
  extraPreferences?: string;
  includeFlights: boolean;
  includeStays: boolean;
  preferences: any;
};

type GenerateItineraryResponse = {
  itinerary: any; // string or object, depending on OpenAI response
  selectedFlight: any | null;
  selectedStay: any | null;
  stayBookingUrl: string | null; // URL for booking the stay
};

export function useGenerateItinerary() {
  return useMutation<
    GenerateItineraryResponse,
    Error,
    GenerateItineraryPayload
  >({
    mutationFn: async (payload) => {
      // Validate payload before sending
      if (
        !payload.city ||
        !payload.dateFrom ||
        !payload.dateTo ||
        !payload.adults ||
        !payload.preferences
      ) {
        throw new Error("Missing required fields in the payload");
      }
      console.log("Payload:", payload);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/itinerary/generate-itinerary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate itinerary");
      }

      // The response matches the controller: { itinerary, selectedFlight, selectedStay, flights?, stays? }
      return res.json();
    },
  });
}
