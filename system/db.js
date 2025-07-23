const mysql = require('mysql');


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: process.env.DATABASE_NAME || 'watchlistmanager',
    connectionLimit: 50
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Nem sikerült csatlakozni az adatbázishoz:', err);
    } else {
        console.log('✅ Adatbázishoz csatlakozva (pool)');
        connection.release();
    }
});

// Export pool directly
module.exports =  pool




let dbUp = false;

function checkDbConnection() {
    pool.getConnection((err, connection) => {
        if (err) {
            if (dbUp) {
                console.error('❌ Adatbázis lecsatlakozva: ', err.code);
                dbUp = false;
            }

        } else {
            connection.release();
            if (!dbUp) {
                console.log('✅ Az adatbázishoz mükszik');
                dbUp = true;
            }
        }
    });
}

// Check DB connection
setInterval(checkDbConnection, 1200000);

checkDbConnection();




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
    const dumpCommand = `mysqldump --user=root ${DATABASE_NAME} > "${filePath}"`;

    exec(dumpCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`[❌] Backup sikertelen: ${error.message}`);
        } else {
            console.log(`[✅] Backup sikeresen létrehozva: ${fileName}`);
        }
    });


    // And we can delete older backups

    const MAX_DAYS = 7;
    const cutoff = Date.now() - MAX_DAYS * 24 * 60 * 60 * 1000;

    fs.readdir(BACKUP_DIR, (err, files) => {
        if (err) return console.error('Backup cleanup error:', err);

        files.forEach(file => {
            const filePath = path.join(BACKUP_DIR, file);
            fs.stat(filePath, (err, stats) => {
                if (!err && stats.mtime.getTime() < cutoff) {
                    fs.unlink(filePath, err => {
                        if (!err) console.log(`[🗑️] Régi mentés törölve: ${file}`);
                    });
                }
            });
        });
    });
});

console.log('[🚀] SQL Auto mentés bekapcsolva. Minden nap hajnali 03:00 kor ment egyet.');
