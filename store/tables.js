export const state = () => ({
	list: [],
	stateID: 0,
});


export const mutations = {
	updated(state) {
		state.list = this.$sql.tables;
		state.stateID++;
	},
};



export const actions = {
	async load({commit}, {file, options}) {
		await this.$sql.loadTable(file, options);
		commit('updated');
	},
	async remove({commit}, {name}) {
		await this.$sql.dropTable(name);
		commit('updated');
	},
};
