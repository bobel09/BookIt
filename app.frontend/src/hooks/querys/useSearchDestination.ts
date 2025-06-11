import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export const useSearchDestination = (query: string) => {
  return useQuery({
    queryKey: ["booking-destination", query],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/search-destination?query=${encodeURIComponent(query)}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      if (!res.ok) throw new Error("Failed to fetch destinations");
      return res.json();
    },
    enabled: !!query,
  });
};
