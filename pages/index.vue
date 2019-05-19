<template>
	<v-app dark>
		<app-header :drawer.sync=drawer />

		<app-drawer
			:drawer.sync=drawer
			@upload="$refs.loader.load()"
			@open="$refs.cards.create($event)" />

		<v-content>
			<query-card-list ref=cards />
		</v-content>

		<table-loader ref=loader @loaded="$refs.cards.create($event)" />
	</v-app>
</template>

<script>
import AppHeader from '~/components/AppHeader';
import AppDrawer from '~/components/AppDrawer';
import QueryCardList from '~/components/QueryCardList';
import TableLoader from '~/components/TableLoader';


export default {
	components: {AppHeader, AppDrawer, QueryCardList, TableLoader},
	data: () => ({
		drawer: true,
	}),
};
</script>
