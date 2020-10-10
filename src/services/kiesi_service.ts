// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Pool } = require('pg')
const pool = new Pool({
  user: 'tunkkibois',
  host: 'ddns2.jaantaponen.fi',
  database: 'tunkkidb',
  password: 'tunkkitunkki',
  port: 8081,
})

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const testConnection = async () => {
  try {
    const client = await pool.connect()
    try {
      //const res = await client.query('SELECT * FROM users WHERE id = $1', [1])
      const res = await client.query('SELECT NOW()')
      console.log(res.rows[0])
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.
      client.release()
    }
  } catch (err) {
    console.log(err.stack)
  }
}

export default { testConnection }