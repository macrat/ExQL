<template>
	<div>
		<doughnut-chart :data=value :label=label :values=values />
		<v-layout>
			<v-spacer />
			<v-flex><v-select label="label" :items="value.columns.map(x => x.name)" :value=label @change="$emit('update:label', $event)" clearable /></v-flex>
			<v-flex><v-select label="values" :items="value.columns.map(x => x.name)" :value=values @change="$emit('update:values', $event)" multiple /></v-flex>
			<v-spacer />
		</v-layout>
	</div>
</template>

<script>
import DoughnutChart from './charts/DoughnutChart';


export default {
	props: ['value', 'label', 'values'],
	components: {DoughnutChart},
};
</script>
