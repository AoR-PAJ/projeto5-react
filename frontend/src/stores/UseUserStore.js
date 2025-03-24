import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const UseUserStore = create(
  persist(
    (set) => ({
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "john@gmail.com",
      phone: "123456789",
      photo: "imagem",
    }),
    {
      name: "UseUserStore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
