import { modeCurrent, setModeCurrent } from "@skeletonlabs/skeleton";
import type { SideBarGroupProps } from "@type/components/sidebar.type";
import { Moon, Newspaper } from "lucide-svelte";
import { get } from "svelte/store";

export const SIDEBAR: SideBarGroupProps[] = [
	{
		group: "pages management",
		items: [
			{
				icon: Newspaper,
				group: "manage-pages",
				label: "Manage Static Pages",
				path: "/admin/manage-pages"
			},
			{
				icon: Newspaper,
				group: "announcements",
				label: "Manage Announcements",
				path: "/admin/manage-announcements"
			}
		]
	},
	{
		group: "additional",
		items: [
			{
				icon: Moon,
				label: "sidebar.appearance",
				group: "appearance",
				role: "",
				onClick: () => {
					console.log("enter here");
					const value = get(modeCurrent);
					setModeCurrent(!value);
					localStorage.setItem("modeCurrent", JSON.stringify(!value));
				}
			}
		]
	}
];
