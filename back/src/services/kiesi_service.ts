
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Pool } = require('pg')
const pool = new Pool({
  user: 'tunkkibois',
  host: 'ddns2.jaantaponen.fi',
  database: 'tunkkidb',
  password: 'tunkkitunkki',
  port: 8081,
})

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

const getUser = async (username: any, password: any) => {
  try {
    const client = await pool.connect()
    try {
      const res = await client.query('SELECT id FROM users WHERE username=$1 AND pwd=$2', [username, password])
      console.log(res)
      return res.rows[0]
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.
      client.release()
    }
  } catch (err) {
    console.log(err.stack)
  }
}

const getPools = async (userid: any) => {
  try {
    const client = await pool.connect()
    try {
      const res = await client.query('SELECT * FROM pool_route WHERE userid=$1', [userid])
      console.log(res.rows)
      return res.rows
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.
      client.release()
    }
  } catch (err) {
    console.log(err.stack)
  }
}

export default { testConnection, getUser, getPools }