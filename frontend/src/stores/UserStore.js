import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


export const UserStore = create(
  persist(
    (set) => ({
      firstName:"John" ,
      lastName: "Doe",
      username: "johndoe",
      email: "john@gmail.com",
      phone: "123456789",
      photo: "imagem"
    }), {
      name: "userStore",
      storage:createJSONStorage(()=>sessionStorage),
    }
  )
)