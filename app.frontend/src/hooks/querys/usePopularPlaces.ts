import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export const usePopularPlaces = (city: string) => {
  return useQuery({
    queryKey: ["popularPlaces", city],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/places/popular-places?city=${encodeURIComponent(city)}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );

      if (!res.ok) throw new Error("Failed to fetch popular places");

      const places = await res.json();
      return places.map(
        (place: {
          name: string;
          photoReference?: string;
          address?: string;
        }) => ({
          name: place.name,
          photoReference: place.photoReference ?? "",
          address: place.address ?? "Address not available",
        })
      );
    },
    enabled: !!city,
    staleTime: 1000 * 60 * 5,
  });
};
