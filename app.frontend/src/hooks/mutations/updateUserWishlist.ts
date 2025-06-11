import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUserWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      wishlist,
    }: {
      userId: string;
      wishlist: string[];
    }) => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/wishlist`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ wishlist }),
        }
      );
      if (!res.ok) throw new Error("Failed to update wishlist");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
