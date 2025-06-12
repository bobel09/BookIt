import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface FlightDetailsParams {
  token: string;
  currency?: string;
}

export const useFlightDetails = ({ token, currency }: FlightDetailsParams) => {
  return useQuery({
    queryKey: ["flightDetails", token, currency],
    queryFn: async () => {
      const params = new URLSearchParams({ token });
      if (currency) params.append("currency", currency);
      const url = `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/flights/details?${params.toString()}`;
      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error("Failed to fetch flight details");
      return res.json();
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
};
