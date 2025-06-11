import { useMutation, useQueryClient } from "@tanstack/react-query";

export const updateVisitedCountries = async (
  userId: string,
  countries: string[]
): Promise<void> => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/visited-countries`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ visitedCountries: countries }),
    }
  );

  if (!res.ok) throw new Error("Failed to update visited countries");
};

export const useUpdateVisitedCountries = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (countries: string[]) =>
      updateVisitedCountries(userId, countries),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        alert("Failed to update visited countries: " + error.message);
      } else {
        alert("Failed to update visited countries: An unknown error occurred.");
      }
    },
  });
};
