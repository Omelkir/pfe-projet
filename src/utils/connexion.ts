import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: '176.31.223.21',
  port: 3307,
  user: 'mediconnect', // Replace with your MySQL username
  password: 'mediconnect', // Replace with your MySQL password
  database: 'medi_connect' // Replace with your MySQL database name
})

export default pool
