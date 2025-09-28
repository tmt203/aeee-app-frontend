module.exports = {
	apps: [
		{
			name: "aeee_client",
			script: "build/index.js",
			env: {
				PORT: 3003,
				API_HOST: "http://api-aeee.trantri.site",
				PUBLIC_API_HOST: "${API_HOST}",
				PUBLIC_FAVICON_URL: "/favicon.png",
				PUBLIC_TINYMCE_API_KEY: "39twybya4n58l1bsrr0je5h2ujsovxz724ervmottbb06x3f"
			},
			env_production: {
				NODE_ENV: "production"
			}
		}
	]
};
