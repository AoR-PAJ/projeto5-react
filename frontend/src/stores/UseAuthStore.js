import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

//Define the store
export const useAuthStore = create(
  persist(
    (set) => ({
      username: "John Doe",
      profilePicture: "imagem",
      admin: false,
      updateName: (username) => set({ username }),
      updatePhoto: (profilePicture) => set({ profilePicture }),
      updateAdmin: (admin) => set({ admin }),
      logout: () => set({ username: "", profilePicture: "", admin: ""}),
    }),
    {
      name: "mystore",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
