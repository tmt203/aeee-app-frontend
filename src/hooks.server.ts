import { sequence } from "@sveltejs/kit/hooks";
import { handleSession } from "svelte-kit-cookie-session";

const sessionHandler = handleSession({
	secret: "xctY7uxYPbN6MrB5mKrfV4J7kwtNgLC2",
	rolling: true,
	expires: 1,
	key: "aeee.session"
});

export const handle = sequence(sessionHandler, async ({ resolve, event }) => {
	const response = await resolve(event);
	response.headers.delete("link");
	return response;
});
