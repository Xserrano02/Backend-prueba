const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');
const { Canvas, Image, ImageData } = canvas;

// Monkey-patch para usar canvas en Node.js
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const loadModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, 'models'));
  await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, 'models'));
  await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, 'models'));
};

const compareFaces = async (selfieBase64, documentBase64) => {
  await loadModels();

  // Convertir las imágenes base64 a buffer
  const selfieBuffer = Buffer.from(selfieBase64, 'base64');
  const documentBuffer = Buffer.from(documentBase64, 'base64');

  const imgSelfie = await canvas.loadImage(selfieBuffer);
  const imgDocument = await canvas.loadImage(documentBuffer);

  // Detectar los rostros en ambas imágenes
  const detectionsSelfie = await faceapi.detectSingleFace(imgSelfie).withFaceLandmarks().withFaceDescriptor();
  const detectionsDocument = await faceapi.detectSingleFace(imgDocument).withFaceLandmarks().withFaceDescriptor();

  if (!detectionsSelfie || !detectionsDocument) {
    throw new Error('No se detectaron rostros en una o ambas imágenes.');
  }

  // Comparar descriptores faciales
  const distance = faceapi.euclideanDistance(detectionsSelfie.descriptor, detectionsDocument.descriptor);
  return distance < 0.6;
};

module.exports = compareFaces;
