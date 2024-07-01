const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

// Configuración de la base de datos
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'likeme',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connected successfully:', result.rows[0].now);
  }
});

// Ruta: GET Todos los Posts
app.get('/posts', async (req, res) => {
  try {
    const query = 'SELECT * FROM posts';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

// Ruta: POST Nuevo Post
app.post('/posts', async (req, res) => {
  const { titulo, img, descripcion, likes } = req.body;
  try {
    const query = 'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [titulo, img, descripcion, likes];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating new post:', error);
    res.status(500).json({ error: 'Failed to create new post' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
