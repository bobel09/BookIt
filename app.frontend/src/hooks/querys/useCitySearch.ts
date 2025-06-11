import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

// Update to v5 object signature
export const useCitySearch = ({
  country,
  query,
}: {
  country: string;
  query: string;
}) => {
  return useQuery({
    queryKey: ["citySearch", country, query],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/search-cities?country=${encodeURIComponent(
          country
        )}&query=${encodeURIComponent(query)}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      if (!res.ok) throw new Error("Failed to fetch cities");
      return res.json();
    },
    enabled: !!country && !!query,
    staleTime: 1000 * 60 * 5,
  });
};
