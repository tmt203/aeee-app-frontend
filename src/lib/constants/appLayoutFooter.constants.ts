import type { LinkGroup } from "@type/components/appLayoutFooter.type";

export const LINK_GROUPS: LinkGroup[] = [
	{
		title: "By Specialty",
		content: [
			{ text: "Contact Us", link: "/#" },
			{ text: "Careers @ AEEE", link: "/#" },
			{ text: "Get Help & Support", link: "/#" },
			{ text: "Right & Permissions", link: "/#" }
		]
	},
	{
		title: "Resources",
		content: [
			{ text: "Authors", link: "/#" },
			{ text: "Librarians", link: "/#" },
			{ text: "Sponsors & Advertisers", link: "/#" },
			{ text: "Press & Media", link: "/#" }
		]
	},
	{
		title: "Get In Touch",
		content: [
			{
				text: "Building FEI, 17.listopadu 2172/15 708 00 Ostrava-Poruba, Czech Republic.",
				link: "https://maps.app.goo.gl/scqC85VuY3n8n7uv8",
				icon: "uil uil-location-pin-alt"
			},
			{ text: "(+420) 597 325 845", link: "tel:(+420) 597 325 845", icon: "uil uil-outgoing-call" },
			{ text: "(+420) 59 732 1650", link: "tel:(+420) 59 732 1650", icon: "uil uil-outgoing-call" },
			{ text: "advances@vsb.cz", link: "mailto:advances@vsb.cz", icon: "uil uil-envelope" }
		]
	}
];
