import { create } from "zustand";

const useAuthStore = create((set) => ({
	user: JSON.parse(localStorage.getItem("user-info") || 'null'),
	login: (user) => {
		localStorage.setItem("user-info", JSON.stringify(user));
		set({ user });
	},
	logout: () => {
		localStorage.removeItem("user-info");
		set({ user: null });
	},
	setUser: (user) => {
		localStorage.setItem("user-info", JSON.stringify(user));
		set({ user });
	},
	updateUser: (update) => set((state) => {
		const updatedUser = { ...state.user, ...update };
		localStorage.setItem("user-info", JSON.stringify(updatedUser));
		return { user: updatedUser };
	}),
}));

export default useAuthStore;
