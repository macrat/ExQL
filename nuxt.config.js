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
		'@nuxtjs/pwa',
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
	manifest: {
		name: 'ExQL - Table data explorer for SQL freak',
		short_name: 'ExQL',
		lang: 'en',
		title: 'ExQL',
		'og:title': 'ExQL',
		description: 'Table data explorer for SQL freak',
		'og:description': 'Table data explorer for SQL freak',
		theme_color: '#ffffff',
		background_color: '#303030',
	},
	router: router,
};
