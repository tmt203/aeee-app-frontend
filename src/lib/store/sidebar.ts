import { writable } from "svelte/store";

export const sidebarExpanded = writable(true);
export const sidebarHoverExpanded = writable(true);

if (typeof window !== "undefined") {
	// Initialize state from localStorage or default to true
	const savedState = localStorage.getItem("sidebar-expanded");
	const hoverSavedState = localStorage.getItem("sidebar-hover-expanded");
	if (savedState !== null) {
		sidebarExpanded.set(JSON.parse(savedState));
	}
	if (hoverSavedState !== null) {
		sidebarHoverExpanded.set(JSON.parse(hoverSavedState));
	}

	// Subscribe to the store and update localStorage whenever the state changes
	sidebarExpanded.subscribe((value) => {
		localStorage.setItem("sidebar-expanded", JSON.stringify(value));
	});
	sidebarHoverExpanded.subscribe((value) => {
		localStorage.setItem("sidebar-hover-expanded", JSON.stringify(value));
	});
}
