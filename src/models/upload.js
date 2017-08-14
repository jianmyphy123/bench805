import mysql from 'mysql';
import { dbConfig, uploadConfig } from '../config';

const mysqlPool = mysql.createPool({
	host: dbConfig.host,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database
});

export const createTable = (rows, callback) => {
  mysqlPool.getConnection((err, connection) => {
		if(err) {
			connection.release();
			console.log(err);
			return;
		}



		connection.query('drop table if exists main', (err, results) => {
			if(err) {
				connection.release();
				console.log(err);
				return;
			}

      connection.query(`CREATE TABLE main (
        id int(11) NOT NULL AUTO_INCREMENT,
        col1 varchar(64) DEFAULT NULL,
        col2 varchar(64) DEFAULT NULL,
        col3 varchar(64) DEFAULT NULL,
        col4 varchar(64) DEFAULT NULL,
        col5 varchar(64) DEFAULT NULL,
        col6 varchar(64) DEFAULT NULL,
        col7 varchar(64) DEFAULT NULL,
        col8 text DEFAULT NULL,
        col9 varchar(64) DEFAULT NULL,
        col10 varchar(64) DEFAULT NULL,
        col11 varchar(64) DEFAULT NULL,
        col12 varchar(64) DEFAULT NULL,
        col13 varchar(64) DEFAULT NULL,
        col14 varchar(64) DEFAULT NULL,
        col15 varchar(64) DEFAULT NULL,
        col16 varchar(64) DEFAULT NULL,
        col17 varchar(64) DEFAULT NULL,
        col18 varchar(64) DEFAULT NULL,
        col19 varchar(64) DEFAULT NULL,
        col20 varchar(64) DEFAULT NULL,
        col21 varchar(64) DEFAULT NULL,
        col22 varchar(64) DEFAULT NULL,
        col23 varchar(64) DEFAULT NULL,
        col24 varchar(64) DEFAULT NULL,
        col25 varchar(64) DEFAULT NULL,
        col26 varchar(64) DEFAULT NULL,
        col27 varchar(64) DEFAULT NULL,
        col28 varchar(64) DEFAULT NULL,
        col29 varchar(64) DEFAULT NULL,
        col30 varchar(64) DEFAULT NULL,
        col31 varchar(64) DEFAULT NULL,
        col32 varchar(64) DEFAULT NULL,
        col33 varchar(64) DEFAULT NULL,
        col34 varchar(64) DEFAULT NULL,
        col35 varchar(64) DEFAULT NULL,
        col36 varchar(64) DEFAULT NULL,
        col37 varchar(64) DEFAULT NULL,
        col38 varchar(64) DEFAULT NULL,
        col39 varchar(64) DEFAULT NULL,
        col40 varchar(64) DEFAULT NULL,
        col41 varchar(64) DEFAULT NULL,
        col42 varchar(64) DEFAULT NULL,
        col43 varchar(64) DEFAULT NULL,
        col44 varchar(64) DEFAULT NULL,
        col45 varchar(64) DEFAULT NULL,

        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1`, (err, results) => {


        insertData(rows, () => {
          callback();
        });


        connection.release();
      });


		});

	});
}

const insertData = (rows, callback) => {
  if(rows.length == 0) {
    return callback();
  }

  let row = rows.shift();

  runSql(row, () => {
    insertData(rows, callback);
  });
}

export const convertRow = (row) => {
  let data = [];
  let i;

  for(i=1; i<=45; i++) {

    let val = row[i.toString()];

    if(val === undefined || val === null) {
      data.push("'"+"'");
      continue;
    }
    val = val.trim();

    switch(i) {
      case 39:
        val = val.replace(/\,/g,'');

        // if(val === 'Indefinite')

        data.push('"'+val+'"');
        break;
      default:
        data.push('"'+val+'"');
        break;
    }



  }
  return data;
}

const runSql = (row, callback) => {
  mysqlPool.getConnection((err, connection) => {
		if(err) {
			connection.release();
			console.log(err);
			return;
		}

    row = convertRow(row);



    let sql = 'insert into main (';

    let colArr = [];

    for(let i=1; i<=45; i++)
      colArr.push('col'+i);

    sql += colArr.toString();

    sql += ') values (';

    sql += row.toString() + ')';


    connection.query(sql, (err, results) => {

      callback();

      connection.release();

    });



  });
}

export const fetchTableData = (callback) => {
  mysqlPool.getConnection((err, connection) => {
		if(err) {
			connection.release();
			console.log(err);
			return;
		}

		connection.query('select * from main ', (err, results) => {
			if(err) {
				connection.release();
				console.log(err);
				return;
			}

			connection.release();

			callback(results);

		});

	});
}
