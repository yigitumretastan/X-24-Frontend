module.exports = {
	crm: {
		input: "./openapi.json",
		output: {
			mode: "tags-split",
			target: "./src/api/generated",
			schemas: "./src/api/model",
			client: "react-query",
			mock: false,
			override: {
				mutator: {
					path: "./src/api/axios-instance.ts",
					name: "customInstance",
				},
			},
		},
	},
};
