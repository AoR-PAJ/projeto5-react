import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


//Define the store
export const userStore = create(
  persist(
    (set) => ({
      username: "",
      profilePicture: "",
      updateName: (username) => set({username}), //function used to update the state variable
      updatePhoto: (profilePicture) => set({profilePicture}),
      logout: ()=> set({username: "", profilePicture: ""}) 
    }), 
    {
      name: "mystore", //name to use for the persisted data   
      storage: createJSONStorage(()=> sessionStorage)
    }
  )
)




