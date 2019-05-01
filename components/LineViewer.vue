<template>
	<div>
		<line-chart :data=value :x=x :ys=ys />
		<v-layout>
			<v-spacer />
			<v-flex><v-select label="x axis" :items=value.columns :value=x @change="$emit('update:x', $event)" clearable /></v-flex>
			<v-flex><v-select label="lines" :items=value.columns :value=ys @change="$emit('update:ys', $event)" multiple /></v-flex>
			<v-spacer />
		</v-layout>
	</div>
</template>

<script>
import LineChart from './charts/LineChart';


export default {
	props: ['value', 'x', 'ys'],
	components: {LineChart},
};
</script>
