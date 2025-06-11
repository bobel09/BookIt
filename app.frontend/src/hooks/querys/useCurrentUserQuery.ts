// hooks/useCurrentUserQuery.ts
import { User } from "@shared/types/user";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      if (!res.ok) throw new Error("User not authenticated");
      const user: User = await res.json();

      user.preferences = {
        currency: user.preferences?.currency ?? "USD",
        interests: user.preferences?.interests ?? [],
        budget: user.preferences?.budget ?? "",
        hotel: user.preferences?.hotel ?? "",
        food: user.preferences?.food ?? [],
        climate: user.preferences?.climate ?? "",
        tripStyle: user.preferences?.tripStyle ?? "",
      };

      return user;
    },
    staleTime: 1000 * 60 * 5,
  });
};
