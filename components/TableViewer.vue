<template>
	<v-data-table :headers=headers :items=value>
		<template v-slot:items=props>
			<td v-for="x in Object.values(props.item)">{{ x }}</td>
		</template>
	</v-data-table>
</template>

<script>
export default {
	props: ['value'],
	computed: {
		headers() {
			if (!this.value || this.value.length === 0) {
				return [];
			}

			return Object.keys(this.value[0]).map(x => ({
				text: x,
				value: x,
				sortable: true,
			}));
		},
	},
};
</script>
