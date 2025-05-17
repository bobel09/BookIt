import { useQuery } from "@tanstack/react-query";

export const usePopularCities = (country: string) => {
  return useQuery({
    queryKey: ["popularCities", country],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/places/popular-cities?country=${country}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch popular cities");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};
