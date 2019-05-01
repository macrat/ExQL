<template>
	<v-toolbar flat app clipped-left style="z-index: 100">
		<v-btn icon @click.stop="$emit('update:drawer', !drawer)">
			<v-icon v-if=drawer>chevron_left</v-icon>
			<v-icon v-else>menu</v-icon>
		</v-btn>
		<v-toolbar-title>ExQL</v-toolbar-title>
	</v-toolbar>
</template>

<script>
export default {
	props: ['drawer'],
};
</script>
