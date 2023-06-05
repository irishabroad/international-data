const fs = require('fs');
const { default: Surreal } = require('surrealdb.js');

const db = new Surreal('http://127.0.0.1:8000/rpc');
const query = fs.readFileSync('./surrealdb.surql', 'utf-8');

async function main() {
    try {
        await db.signin({
            user: 'root',
            pass: 'root',
        });
        await db.use('irish', 'international');
		const result = await db.query(query);
		const firstCompetitiveStarts = result[0];
		console.table(firstCompetitiveStarts.result);
    } catch(e) {
        console.error('Error occured processing script:', e);
    } finally {
        db.close();
    }
}
main();
