import Vue from 'vue';
import alasql from 'alasql';
import xlsx from 'xlsx';
import encoding from 'encoding-japanese';

alasql['private'].externalXlsxLib = xlsx;


function decodeURL({type, url}) {
    if (type !== 'text/csv' && type !== 'text/plain') {
        return url;
    }

    return encoding.convert(encoding.base64Decode(url.replace(/^data:.*,/, '')), {from: 'auto', type: 'string'});
}


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


function getType(obj) {
	const result = typeof obj;
	if (result !== 'object') {
		return result;
	}
	if(obj instanceof Date) {
		return 'date';
	}
	return result;
}


function withMetaData(table) {
	if (table.length === undefined) {
		return table;
	}
	if (table.length === 0) {
		table.columns = [];
		return table;
	}

	const cols = Object.entries(table[0]).map(([name, val]) => ({name: name, type: getType(val)}));
	for (let x in table.slice(1)) {
		for (let i in cols) {
			if (getType(x[cols[i].name]) !== cols[i].type && x[cols[i].name] !== null && x[cols[i].name] !== undefined) {

				cols[i].type = 'mixed';
			}
		}
	}

	table.columns = cols;

	return table;
}


export default ({app}, inject) => {
	inject('sql', {
		async execute(query, data) {
			return withMetaData(await alasql.promise(query, data));
		},

		async loadTable({name, type, url}, options) {
			await alasql.promise('BEGIN TRANSACTION');
			try {
				await alasql.promise(`CREATE TABLE ${name}`);
				await alasql.promise(`SELECT ${selector(type, options)} INTO ${name} FROM ${loader(type, options)}`, [decodeURL({type, url})]);
				await alasql.promise('COMMIT TRANSACTION');
			} catch(e) {
				await alasql.promise('ROLLBACK TRANSACTION');
				throw e;
			}
		},

		async previewTable({type, url}, options) {
			return withMetaData(await alasql.promise(`SELECT * FROM ${loader(type, options)} LIMIT 5`, [decodeURL({type, url})]));
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
