import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface SearchParams {
  currency: string;
  dest_id: string;
  checkin_date: string;
  checkout_date: string;
  adults: number;
  room_qty: number;
}

export const useSearchHotels = (
  params: SearchParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["booking-hotels", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        dest_id: params.dest_id,
        checkin_date: params.checkin_date,
        checkout_date: params.checkout_date,
        adults: params.adults.toString(),
        room_qty: params.room_qty.toString(),
        currency: params.currency || "USD",
      });
      const token = localStorage.getItem("token");
      const res = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/stays/hotels?${searchParams.toString()}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      if (!res.ok) throw new Error("Failed to fetch hotels");
      return res.json();
    },
    enabled,
  });
};
