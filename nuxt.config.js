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
	],
	vuetify: {
		theme: {
			primary: '#ffffff',
			accent: '#ffffff',
		},
	},
};
