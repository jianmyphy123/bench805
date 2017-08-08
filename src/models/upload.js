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
        col4 date DEFAULT NULL,
        col5 varchar(64) DEFAULT NULL,
        col6 varchar(64) DEFAULT NULL,
        col7 varchar(64) DEFAULT NULL,
        col8 text DEFAULT NULL,
        col9 float DEFAULT NULL,
        col10 float DEFAULT NULL,
        col11 float DEFAULT NULL,
        col12 float DEFAULT NULL,
        col13 float DEFAULT NULL,
        col14 float DEFAULT NULL,
        col15 float DEFAULT NULL,
        col16 varchar(64) DEFAULT NULL,
        col17 varchar(64) DEFAULT NULL,
        col18 float DEFAULT NULL,
        col19 float DEFAULT NULL,
        col20 varchar(64) DEFAULT NULL,
        col21 varchar(64) DEFAULT NULL,
        col22 float DEFAULT NULL,
        col23 float DEFAULT NULL,
        col24 varchar(64) DEFAULT NULL,
        col25 varchar(64) DEFAULT NULL,
        col26 float DEFAULT NULL,
        col27 float DEFAULT NULL,
        col28 varchar(64) DEFAULT NULL,
        col29 varchar(64) DEFAULT NULL,
        col30 float DEFAULT NULL,
        col31 float DEFAULT NULL,
        col32 varchar(64) DEFAULT NULL,
        col33 varchar(64) DEFAULT NULL,
        col34 float DEFAULT NULL,
        col35 float DEFAULT NULL,
        col36 varchar(64) DEFAULT NULL,
        col37 varchar(64) DEFAULT NULL,
        col38 float DEFAULT NULL,
        col39 float DEFAULT NULL,
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

    if(val === 'na' || val === '-') {
      data.push("'"+"'");
      continue;
    }

    switch(i) {
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 18:
      case 19:
      case 22:
      case 23:
      case 26:
      case 27:
      case 30:
      case 31:
      case 34:
      case 35:
      case 38:
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



    if(row[0] == 'Lime Energy Co. (OTCPK:LIME)') {
      console.log(sql);
    }


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
