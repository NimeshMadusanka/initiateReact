var admin = require('firebase-admin');

var serviceAccount = require('../config/firebase-key.json');

const BUCKET = 'mediaservice-f6142.appspot.com';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET,
});

const bucket = admin.storage().bucket();

function uploadImageAsPromise(imageFile) {
  const image = imageFile;
  const name = Date.now() + '.' + image.originalname.split('.').pop();

  const file = bucket.file(name);

  const stream = file.createWriteStream({
    metadata: {
      contentType: image.mimetype,
    },
  });

  stream.on('error', (e) => {
    throw new Error(e);
  });

  stream.on('finish', async () => {
    await file.makePublic();

    imageFile.firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${name}`;
  });

  stream.end(image.buffer);

  return (url = `https://storage.googleapis.com/${BUCKET}/${name}`);
}

const uploadMedia2 = (req, res, next) => {
  try {
    const media = [];

    for (let i = 0; i < req.files.length; i++) {
      let imageFile = req.files[i];

      let url = uploadImageAsPromise(imageFile);

      media.push({
        url: url,
        size: req.files[i].size,
        mimetype: req.files[i].mimetype,
        name: req.files[i].originalname,
      });
    }

    req.media = media;

    next();
  } catch (error) {
    return res.sendStatus(500);
  }
};

module.exports = uploadMedia2;
