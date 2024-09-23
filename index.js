const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4002;

app.use(express.json({ limit: '50mb' }));

const uri = process.env.DB_URI;

async function connectToMongoDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: { version: '1', strict: true, deprecationErrors: true }
    });
    mongoose.connection.on('connected', () => {
        console.log('Conectado a MongoDB');
      });      

    console.log("Conexión a MongoDB Atlas exitosa");

    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } catch (err) {
    console.error('Error al conectar a MongoDB Atlas:', err);
  }
}

const allowedOrigins = [
  'http://localhost:3000',
  'https://frontend-prueba-jade.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

connectToMongoDB();

app.use('/api', userRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
