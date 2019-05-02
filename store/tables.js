import alasql from 'alasql';
import xlsx from 'xlsx';

alasql['private'].externalXlsxLib = xlsx;


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


function load(name, query, params) {
	alasql('BEGIN TRANSACTION');
	try {
		alasql(`CREATE TABLE ${name}`);
		alasql(query, params);
		alasql('COMMIT TRANSACTION');
	} catch(e) {
		alasql('ROLLBACK TRANSACTION');
		throw e;
	}
}


function loadCSV(name, url) {
	load(name, `SELECT * INTO ${name} FROM CSV(?, {autoExt:false,headers:true,separator:","})`, [url]);
}


function loadTSV(name, url) {
	load(name, `SELECT * INTO ${name} FROM TSV(?, {autoExt:false,headers:true})`, [url]);
}


function loadXLS(name, url) {
	load(name, `SELECT * INTO ${name} FROM XLS(?, {autoExt:false,headers:true})`, [url]);
}


function loadXLSX(name, url) {
	load(name, `SELECT * INTO ${name} FROM XLSX(?, {autoExt:false,headers:true})`, [url]);
}


export const actions = {
	load({commit}, {name, type, url}) {
		switch (type) {
		case 'text/csv':
		case 'text/plain':
			loadCSV(name, url);
			break;
		case 'text/tab-separated-values':
			loadTSV(name, url);
			break;
		case 'application/vnd.ms-excel':
			loadXLS(name, url);
			break;
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			loadXLSX(name, url);
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
