import type { NavbarGroupProps } from "@type/components/navbar.type";

export const NAV_BAR_GROUPS: NavbarGroupProps[] = [
	{
		group: "main",
		items: [
			{
				group: "about",
				label: "about us",
				children: [
					{
						group: "aims-and-scopes",
						label: "aims & scopes",
						path: "/about-us/aims-and-scopes"
					},
					{
						group: "abstracting-and-indexing",
						label: "abstracting & indexing",
						path: "/about-us/abstracting-and-indexing"
					},
					{
						group: "publication-frequency",
						label: "publication frequency",
						path: "/about-us/publication-frequency"
					},
					{
						group: "journal-history",
						label: "journal history",
						path: "/about-us/journal-history"
					},
					{
						group: "open-access-policy",
						label: "APC & open access policy",
						path: "/about-us/open-access-policy"
					},
					{
						group: "contact",
						label: "Contact",
						path: "/about-us/contact"
					}
				]
			},
			{
				group: "editors",
				label: "editors",
				path: "/editors"
			},
			{
				group: "issues",
				label: "issues",
				children: [
					{
						group: "current-issues",
						label: "current issues",
						path: "/issues/current-issues"
					},
					{
						group: "archives",
						label: "archives",
						path: "/issues/archives"
					}
				]
			},
			{
				group: "early-access",
				label: "early access",
				path: "/early-access"
			},
			{
				group: "payment",
				label: "payment",
				path: "/payments/contact-form"
			},
			{
				group: "publish",
				label: "publish",
				children: [
					{
						group: "author-guidelines",
						label: "author guidelines",
						path: "/publish/author-guidelines"
					},
					{
						group: "publishing-procedure",
						label: "publishing procedure",
						path: "/publish/publishing-procedure"
					},
					{
						group: "peer-review-process",
						label: "peer review process",
						path: "/publish/peer-review-process"
					},
					{
						group: "copyright-and-privacy-statement",
						label: "copyright & privacy statement",
						path: "/publish/copyright-and-privacy-statement"
					}
				]
			},
			{
				group: "announcements",
				label: "announcements",
				path: "/announcements"
			}
		]
	}
];
