const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4002;

app.use(express.json({ limit: '10mb' }));

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

// Permitir todas las conexiones con CORS
const corsOptions = {
  origin: '*', // Permitir todos los orígenes
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
  credentials: false // Si no necesitas compartir cookies o autorizaciones entre dominios
};

app.use(cors(corsOptions));

// Conectar a MongoDB
connectToMongoDB();

// Aplicar las rutas de la API
app.use('/api', userRoutes);

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
