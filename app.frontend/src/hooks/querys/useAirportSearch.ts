import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export const useAirportSearch = (keyword: string) => {
  return useQuery({
    queryKey: ["airportSearch", keyword],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/flights/search-location?keyword=${encodeURIComponent(keyword)}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      if (!res.ok) throw new Error("Failed to fetch airports");
      return res.json();
    },
    enabled: !!keyword && keyword.length >= 3,
    staleTime: 1000 * 60 * 5,
  });
};
