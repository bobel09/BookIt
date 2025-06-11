import { useQuery } from "@tanstack/react-query";
import type { Trip } from "@shared/types/trip";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export const useTrips = () => {
  return useQuery<Trip[]>({
    queryKey: ["trips"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/trips`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      if (!res.ok) throw new Error("Could not fetch trips");
      return await res.json();
    },
  });
};
