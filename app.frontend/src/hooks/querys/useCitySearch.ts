import { useQuery } from "@tanstack/react-query";

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
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/cities/search?country=${encodeURIComponent(
          country
        )}&query=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to fetch cities");
      return res.json();
    },
    enabled: !!country && !!query,
    staleTime: 1000 * 60 * 5,
  });
};
