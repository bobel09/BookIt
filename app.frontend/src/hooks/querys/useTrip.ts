import { useQuery } from "@tanstack/react-query";
import type { Trip } from "@shared/types/trip";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export const useTrip = (id: string) => {
  return useQuery<Trip>({
    queryKey: ["trip", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/trips/${id}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      if (!res.ok) throw new Error("Could not fetch trip");
      return await res.json();
    },
    enabled: !!id,
  });
};
