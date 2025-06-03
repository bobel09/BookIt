import { useQuery } from "@tanstack/react-query";

export const useAirportSearch = (keyword: string) => {
  return useQuery({
    queryKey: ["airportSearch", keyword],
    queryFn: async () => {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/flights/airports?keyword=${encodeURIComponent(keyword)}`
      );
      if (!res.ok) throw new Error("Failed to fetch airports");
      return res.json();
    },
    enabled: !!keyword,
    staleTime: 1000 * 60 * 5,
  });
};
