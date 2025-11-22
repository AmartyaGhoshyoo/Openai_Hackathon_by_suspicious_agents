import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  name: string;
  login: boolean;
  id: string;
  img: string;
}

const STORAGE_KEY = "loginUser";

// Load from localStorage
const loadFromStorage = (): IInitialState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {
      name: "",
      login: false,
      id: "",
      img: "",
    };
  } catch {
    return {
      name: "",
      login: false,
      id: "",
      img: "",
    };
  }
};

const saveToStorage = (state: IInitialState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

// Initial State (from localStorage)
const initialState: IInitialState = loadFromStorage();

const loginuserSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IInitialState>) => {
      Object.assign(state, action.payload);
      saveToStorage(state); // Save after update
    },
    clearUser: (state) => {
      const emptyState = {
        name: "",
        login: false,
        id: "",
        img: "",
      };
      Object.assign(state, emptyState);
      saveToStorage(emptyState); // Clear storage
    },
  },
});

export default loginuserSlice.reducer;
export const { clearUser, setUser } = loginuserSlice.actions;
