const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; 

    if (!apiKey) {
        return res.status(403).json({ message: 'No se proporcionó una clave de API' });
    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ message: 'Clave de API no válida' });
    }

    next();
};

module.exports = verifyApiKey;
