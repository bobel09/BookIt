import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Preferences } from "@shared/types/user";

const updateUserPreferences = async (
  userId: string,
  preferences: Preferences
): Promise<void> => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/preferences`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ preferences }),
    }
  );

  if (!res.ok) throw new Error("Failed to update preferences");
};

export const useUpdatePreferencesMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: Preferences) =>
      updateUserPreferences(userId, preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        alert("Failed to update preferences: " + error.message);
      } else {
        alert("Failed to update preferences: An unknown error occurred.");
      }
    },
  });
};
