import type { SessionData } from "@type/api/auth.type";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: import("svelte-kit-cookie-session").Session<SessionData>;
			cookies: Record<string, string>;
		}
		interface PageData {
			session: SessionData;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
