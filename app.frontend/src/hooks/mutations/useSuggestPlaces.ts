import { useMutation } from "@tanstack/react-query";

export type SuggestPlacesPayload = {
  preferences: any;
};

export type SuggestPlacesResponse = {
  suggestions: string[]; // Array of "City, Country"
};

export function useSuggestPlaces() {
  return useMutation<SuggestPlacesResponse, Error, SuggestPlacesPayload>({
    mutationFn: async (payload) => {
      if (!payload.preferences) {
        throw new Error("Missing user preferences");
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/itinerary/suggest-destinations`,
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
        throw new Error(error.error || "Failed to get suggestions");
      }
      return res.json();
    },
  });
}
