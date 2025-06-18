import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: '176.31.223.21',
  port: 3307,
  user: 'mediconnect',
  password: 'mediconnect',
  database: 'medi_connect'
})

export default pool
