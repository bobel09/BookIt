import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface HotelDetailsParams {
  hotel_id: string;
  arrival_date: string;
  departure_date: string;
  adults: string;
  currency?: string; // Optional, defaults to "USD" if not provided
}

export const useHotelDetails = ({
  hotel_id,
  arrival_date,
  departure_date,
  adults,
  currency,
}: HotelDetailsParams) => {
  return useQuery({
    queryKey: [
      "booking-hotel-details",
      hotel_id,
      arrival_date,
      departure_date,
      adults,
      currency,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        hotel_id,
        arrival_date,
        departure_date,
        adults,
      });
      if (currency) params.append("currency", currency);
      const token = localStorage.getItem("token");
      const url = `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/stays/hotel-details?${params.toString()}`;
      const res = await fetchWithAuth(
        url,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      if (!res.ok) throw new Error("Failed to fetch hotel details");
      return res.json();
    },
    enabled: !!hotel_id && !!arrival_date && !!departure_date && !!adults,
    staleTime: 1000 * 60 * 5,
  });
};
