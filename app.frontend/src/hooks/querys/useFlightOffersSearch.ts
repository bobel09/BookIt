import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface FlightOffersParams {
  from: string;
  to: string;
  depart: string;
  returnDate?: string;
  adults: number;
  cabinClass?: string;
  currency?: string;
}

export const useFlightOffersSearch = ({
  from,
  to,
  depart,
  returnDate,
  adults,
  cabinClass,
  currency,
}: FlightOffersParams) => {
  return useQuery({
    queryKey: [
      "flightOffersSearch",
      from,
      to,
      depart,
      returnDate,
      adults,
      cabinClass,
      currency,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        from,
        to,
        depart,
        adults: adults.toString(),
      });
      if (returnDate) params.append("returnDate", returnDate);
      if (cabinClass) params.append("cabinClass", cabinClass);
      if (currency) params.append("currency", currency);
      const token = localStorage.getItem("token");
      const res = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/flight-offers-search?${params.toString()}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      console.log(res);
      if (!res.ok) throw new Error("Failed to fetch flight offers");
      return res.json();
    },
    enabled: !!from && !!to && !!depart && adults > 0,
    staleTime: 1000 * 60 * 5,
  });
};
