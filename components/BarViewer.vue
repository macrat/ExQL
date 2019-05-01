<template>
	<div>
		<bar-chart :data=value :x=x :ys=ys />
		<v-layout>
			<v-spacer />
			<v-flex><v-select label="x axis" :items=value.columns :value=x @change="$emit('update:x', $event)" clearable /></v-flex>
			<v-flex><v-select label="bars" :items=value.columns :value=ys @change="$emit('update:ys', $event)" multiple /></v-flex>
			<v-spacer />
		</v-layout>
	</div>
</template>

<script>
import BarChart from './charts/BarChart';


export default {
	props: ['value', 'x', 'ys'],
	components: {BarChart},
};
</script>
