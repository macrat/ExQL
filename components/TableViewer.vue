<template>
	<v-data-table :headers=headers :items=value>
		<template #items={item}>
			<td v-for="col in value.columns" :align="col.type === 'number' ? 'right' : 'left'">{{ item[col.name] }}</td>
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

			return this.value.columns.map(x => ({
				text: x.name,
				value: x.name,
				sortable: true,
			}));
		},
	},
};
</script>
