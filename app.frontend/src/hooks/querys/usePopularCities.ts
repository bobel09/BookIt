import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export const usePopularCities = (country: string) => {
  return useQuery({
    queryKey: ["popularCities", country],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/places/popular-cities?country=${encodeURIComponent(country)}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );

      if (!res.ok) throw new Error("Failed to fetch popular cities");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};
