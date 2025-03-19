import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

//Define the store
export const AuthStore = create(
  persist(
    (set) => ({
      username: "John Doe",
      profilePicture: "imagem",
      updateName: (username) => set({ username }),
      updatePhoto: (profilePicture) => set({ profilePicture }),
      logout: () => set({ username: "", profilePicture: "" }),
    }),
    {
      name: "mystore", //name to use for the persisted data
      storage: createJSONStorage(() => localStorage),
    }
  )
);
