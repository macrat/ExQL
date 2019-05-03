<template>
	<div>
		<bubble-chart :data=value :x=x :y=y :r=r :c=c />
		<v-layout>
			<v-spacer />
			<v-flex><v-select label="label" :items="value.columns.map(x => x.name)" :value=c @change="$emit('update:c', $event)" clearable /></v-flex>
			<v-flex><v-select label="x position" :items="value.columns.map(x => x.name)" :value=x @change="$emit('update:x', $event)" /></v-flex>
			<v-flex><v-select label="y position" :items="value.columns.map(x => x.name)" :value=y @change="$emit('update:y', $event)" /></v-flex>
			<v-flex><v-select label="circle size" :items="value.columns.map(x => x.name)" :value=r @change="$emit('update:r', $event)" clearable /></v-flex>
			<v-spacer />
		</v-layout>
	</div>
</template>

<script>
import BubbleChart from './charts/BubbleChart';


export default {
	props: ['value', 'x', 'y', 'r', 'c'],
	components: {BubbleChart},
};
</script>
