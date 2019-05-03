import Vue from 'vue';
import alasql from 'alasql';
import xlsx from 'xlsx';

alasql['private'].externalXlsxLib = xlsx;


function selector(type, {columns}) {
	if (!columns) {
		return '*';
	}
	return Object.entries(columns).map(([from, to]) => `[${from}] as [${to}]`).join(',');
}


function loader(type, {headers, separator}) {
	switch (type) {
	case 'text/csv':
	case 'text/plain':
		return `CSV(?, {autoExt:false, headers:${headers}, separator:"${separator || ','}"})`;
	case 'text/tab-separated-values':
		return `TSV(?, {autoExt:false, headers:${headers}})`;
	case 'application/vnd.ms-excel':
		return `XLS(?, {autoExt:false, headers:${headers}})`;
	case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
		return `XLSX(?, {autoExt:false, headers:${headers}})`;
	default:
		throw 'unsupported type';
	}
}


export default ({app}, inject) => {
	inject('sql', {
		async execute(query, data) {
			return await alasql.promise(query, data);
		},

		async loadTable({name, type, url}, options) {
			await alasql.promise('BEGIN TRANSACTION');
			try {
				await alasql.promise(`CREATE TABLE ${name}`);
				await alasql.promise(`SELECT ${selector(type, options)} INTO ${name} FROM ${loader(type, options)}`, [url]);
				await alasql.promise('COMMIT TRANSACTION');
			} catch(e) {
				await alasql.promise('ROLLBACK TRANSACTION');
				throw e;
			}
		},

		async previewTable({type, url}, options) {
			return await alasql.promise(`SELECT * FROM ${loader(type, options)} LIMIT 5`, [url]);
		},

		async dropTable(name) {
			return await alasql.promise(`DROP TABLE ${name}`);
		},

		async saveAs(name, data) {
			return await alasql.promise(`SELECT * INTO CSV("${name}.csv", {headers:true, separator:","}) FROM ?`, [data]);
		},

		get tables() {
			return Object.keys(alasql.tables);
		},
	});
};
