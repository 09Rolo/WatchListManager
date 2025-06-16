const mysql = require('mysql');

let connection;

function handleDisconnect() {
    connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "watchlistmanager"
    });

    connection.connect(function(err) {
        if (err) {
            console.log('Error connecting to DB:', err);
            setTimeout(handleDisconnect, 2000);
            return;
        }
        console.log("Adatbázishoz csatlakozva ✅");
    });

    connection.on('error', function(err) {
        console.log('DB error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

// Export a function that always returns the current connection
module.exports = {
    getConnection: () => connection
};




/*
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "watchlistmanager"
});


function handleDisconnect() {
    console.log("started")

    con.connect(function(err) {
        if(err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    con.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();


module.exports = con
*/