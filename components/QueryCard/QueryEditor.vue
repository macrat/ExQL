<style>
.query-editor .CodeMirror {
	background-color: transparent !important;
	height: auto;
	width: 100%;
}
</style>

<template>
	<v-input
		class="query-editor v-text-field v-textarea"
		:class="{'v-input--is-focused': focused}"
		:error=error>

		<no-ssr>
			<codemirror
				:value=value
				style="width: 100%"
				ref=codemirror
				@input="$emit('input', $event)"
				@focus="focused = true"
				@blur="focused = false"
				:options=options />
		</no-ssr>
	</v-input>
</template>

<script>
export default {
	props: ['value', 'error'],
	data: () => ({
		focused: false,
	}),
	computed: {
		options: () => ({
			theme: 'zenburn',
			mode: 'sql',
			indentWithTabs: true,
			viewportMargin: Infinity,
		}),
	},
};
</script>
