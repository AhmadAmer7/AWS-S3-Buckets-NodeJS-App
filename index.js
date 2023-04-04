require('dotenv').config();
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION
});

const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/upload', upload.single('image'), (req, res) => {
  s3.upload(
    {
      Bucket: process.env.BUCKET_NAME,
      Key: `images/${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    },
    (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Error uploading file' });
      } else {
        res.json({ message: 'File uploaded successfully', url: data.Location });
      }
    }
  );
});
app.get('/list', (req, res) => {
  s3.listObjectsV2(
    {
      Bucket: process.env.BUCKET_NAME,
      Prefix: 'images/'
    },
    (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Error listing files' });
      } else {
        res.json({ files: data.Contents.map(file => file.Key) });
      }
    }
  );
});

app.get('/download/:imageName', (req, res) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `images/${req.params.imageName}`
  };

  s3.getObject(params)
    .promise()
    .then(data => {
      res.set('Content-Type', data.ContentType);
      res.send(data.Body);
    })
    .catch(() => {
      res.status(500).json({ error: 'Error downloading file' });
    });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});