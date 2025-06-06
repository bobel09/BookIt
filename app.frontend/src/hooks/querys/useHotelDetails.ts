import { useQuery } from "@tanstack/react-query";

interface HotelDetailsParams {
  hotel_id: string;
  arrival_date: string;
  departure_date: string;
  adults: string;
}

export const useHotelDetails = ({
  hotel_id,
  arrival_date,
  departure_date,
  adults,
}: HotelDetailsParams) => {
  return useQuery({
    queryKey: [
      "booking-hotel-details",
      hotel_id,
      arrival_date,
      departure_date,
      adults,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        hotel_id,
        arrival_date,
        departure_date,
        adults,
      });
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/stays/hotel-details?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch hotel details");
      return res.json();
    },
    enabled: !!hotel_id && !!arrival_date && !!departure_date && !!adults,
  });
};
