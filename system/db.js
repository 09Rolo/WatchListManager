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




/* AUTO SAVE BACKUPS */

const cron = require('node-cron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Config
const DATABASE_NAME = process.env.DATABASE_NAME
const BACKUP_DIR = path.join(__dirname, "..", "sql_saves");


if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}


cron.schedule('0 3 * * *', () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const fileName = `backup-${DATABASE_NAME}-${date}.sql`;
    const filePath = path.join(BACKUP_DIR, fileName);

    // Dump command (no username/pass)
    const dumpCommand = `mysqldump ${DATABASE_NAME} > "${filePath}"`;

    exec(dumpCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`[❌] Backup sikertelen: ${error.message}`);
        } else {
            console.log(`[✅] Backup sikeresen létrehozva: ${fileName}`);
        }
    });
});

console.log('[🚀] SQL Auto mentés bekapcsolva. Minden nap hajnali 03:00 kor ment egyet.');
