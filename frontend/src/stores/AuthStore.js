import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

//Define the store
export const AuthStore = create(
  persist(
    (set) => ({
      username: "John Doe",
      profilePicture: "imagem",
      admin: false,
      updateName: (username) => set({ username }),
      updatePhoto: (profilePicture) => set({ profilePicture }),
      updateAdmin: (admin) => set({ admin }),
      logout: () => set({ username: "", profilePicture: "" }),
    }),
    {
      name: "mystore",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
