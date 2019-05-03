<template>
	<v-container fluid grid-list-md>
		<v-layout column>
			<query-card
				v-for="card in cards" :key=card.id
				:value=card.query
				@change="card.query = $event"
				@remove="remove(card.id)"
				:data-card-id=card.id />
		</v-layout>

		<v-fab-transition>
			<v-btn fab fixed bottom right light @click.stop="create()">
				<v-icon>add</v-icon>
			</v-btn>
		</v-fab-transition>
	</v-container>
</template>

<script>
import Vue from 'vue';

import QueryCard from '~/components/QueryCard';


export default {
	components: {QueryCard},
	data: () => ({
		cards: [
			{id: 0, query: '-- Write SQL here --\n\nSELECT NOW() AS date'},
		],
		lastId: 0,
	}),
	methods: {
		remove(id) {
			this.cards = this.cards.filter(x => x.id !== id);
		},
		focus(id) {
			this.$vuetify.goTo(this.$el.querySelector(`div[data-card-id="${id}"]`));
		},
		_createForce(query) {
			this.lastId++;
			this.cards.push({
				id: this.lastId,
				query: query,
			});
			Vue.nextTick(() => this.focus(this.lastId));
		},
		create(table) {
			if (!table) {
				this._createForce('');
				return;
			}

			const query = `SELECT * FROM ${table}`;

			const m = this.cards.filter(x => x.query === query);
			if (m.length > 0) {
				this.focus(m[0].id);
				return;
			}

			this._createForce(query);
		},
	},
};
</script>
