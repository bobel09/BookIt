import { useQuery } from "@tanstack/react-query";

export const useSearchDestination = (query: string) => {
  return useQuery({
    queryKey: ["booking-destination", query],
    queryFn: async () => {
      const params = new URLSearchParams({ query });
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/stays/destinations?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch destinations");
      return res.json();
    },
    enabled: !!query,
  });
};
