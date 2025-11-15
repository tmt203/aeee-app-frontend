import { modeCurrent, setModeCurrent } from "@skeletonlabs/skeleton";
import type { SideBarGroupProps } from "@type/components/sidebar.type";
import { Blocks, BookCheck, BookOpenText, LibraryBig, Moon, Newspaper } from "lucide-svelte";
import { get } from "svelte/store";

export const SIDEBAR: SideBarGroupProps[] = [
	{
		group: "pages management",
		items: [
			{
				icon: BookOpenText,
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
		group: "articles management",
		items: [
			// {
			// 	icon: Blocks,
			// 	group: "manage-volumes-and-issues",
			// 	label: "Manage Volumes & Issues",
			// 	path: "/admin/manage-volumes-and-issues"
			// },
			// {
			// 	icon: BookCheck,
			// 	group: "manage-articles",
			// 	label: "Manage Articles",
			// 	path: "/admin/manage-articles"
			// },
			{
				icon: LibraryBig,
				group: "manage-early-access-articles",
				label: "Manage Early Access Articles",
				path: "/admin/manage-early-access-articles"
			}
			// {
			// 	icon: Newspaper,
			// 	group: "manage-article-files",
			// 	label: "Manage Article Files",
			// 	path: "/admin/manage-article-files"
			// }
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
					const value = get(modeCurrent);
					setModeCurrent(!value);
					localStorage.setItem("modeCurrent", JSON.stringify(!value));
				}
			}
		]
	}
];
