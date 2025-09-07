import type { SideBarGroupProps } from "@type/components/sidebar.type";
import { Newspaper } from "lucide-svelte";

export const SIDEBAR: SideBarGroupProps[] = [
	{
		group: "pages management",
		items: [
			{
				icon: Newspaper,
				group: "about-us",
				label: "About Us",
				path: "/admin/about-us"
			}
		]
	}
];
