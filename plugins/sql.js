import Vue from 'vue';
import TableLoader from 'sqljs-table-loader';
import initSqlJs from 'sql.js';
import xlsx from 'xlsx';
import encoding from 'encoding-japanese';


function decodeURL({type, url}) {
    if (type !== 'text/csv' && type !== 'text/plain') {
        return url;
    }

    return encoding.convert(encoding.base64Decode(url.replace(/^data:.*,/, '')), {from: 'auto', type: 'string'});
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


function convertData(table) {
	const {columns, values} = table;
	table = values;
	table.columns = columns;

	if (table.length === undefined) {
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
	initSqlJs().then(SQL => {
		const db = new SQL.Database();

		inject('sql', {
			execute(query, data) {
				return convertData(db.exec(query, data));
			},

			loadTable({name, type, data}, options) {
				new TableLoader(decodeURL({type, url})).importInto(db, name, data);
			},

			previewTable({type, data}, options) {
				return new TableLoader(decodeURL({type, data})).read(db, name, data).slice(0, 5);
			},

			dropTable(name) {
				db(`DROP TABLE ${name}`);
			},

			convertToCSV(name, data) {
				return xlsx.utils.sheet_to_csv(xlsx.utils.json_to_sheet(data.values));
			},

			get tables() {
				return Object.keys(alasql.tables);
			},
		});
	}).catch(e => console.error(e));
};
