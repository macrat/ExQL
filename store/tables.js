import alasql from 'alasql';
import encoding from 'encoding-japanese';


export const state = () => ({
	list: [],
	stateID: 0,
});


export const mutations = {
	updated(state) {
		state.list = Object.keys(alasql.tables);
		state.stateID++;
	},
};


function loadCSV(name, data) {
	alasql('BEGIN TRANSACTION');
	try {
		alasql(`CREATE TABLE ${name}`);
		alasql(`SELECT * INTO ${name} FROM CSV(?, {headers:true,separator:","})`, encoding.convert(new Uint8Array(data), {type: 'string'}));
		alasql('COMMIT TRANSACTION');
	} catch(e) {
		alasql('ROLLBACK TRANSACTION');
		throw e;
	}
}


export const actions = {
	load({commit}, {name, type, data}) {
		switch (type) {
		case 'text/csv':
			loadCSV(name, data);
			break;
		default:
			throw 'unsupported type';
		}
		commit('updated');
	},
	async remove({commit}, {name}) {
		await alasql(`DROP TABLE ${name}`);
		commit('updated');
	},
};
