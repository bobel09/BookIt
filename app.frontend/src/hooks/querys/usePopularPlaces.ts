import { useQuery } from "@tanstack/react-query";

export const usePopularPlaces = (city: string) => {
  return useQuery({
    queryKey: ["popularPlaces", city],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/places/popular-places?city=${city}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
