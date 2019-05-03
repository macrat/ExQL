const router = process.env.DEPLOY_ENV !== 'GH_PAGES' ? {} : {
	base: '/ExQL/',
};

export default {
	head: {
		title: 'ExQL - Table data explorer for SQL freak',
		meta: [
			{charset: 'utf-8'},
		],
	},
	modules: [
		'@nuxtjs/vuetify',
	],
	plugins: [
		{src: '~/plugins/vue-async-computed'},
		{src: '~/plugins/sql'},
		{src: '~/plugins/vue-codemirror', ssr: false},
	],
	vuetify: {
		theme: {
			primary: '#ffffff',
			accent: '#ffffff',
		},
	},
	router: router,
};
