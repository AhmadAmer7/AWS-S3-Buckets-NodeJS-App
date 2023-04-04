# AWS-S3-Buckets-Simple-NodeJS-App

* simple Node-js image uploder application that uploads , download and list images 

* 
## Explaining End Point Code Mian Configurations 
* Image Upload endpoint (POST /upload)
* upload image : i used multer middleware to handle the the image upload , multer store the file in memory so i can use 'req.file.buffer'
* 
* 
* s3.upload : this method is from aws sdk those are the properities to set for upload 
   - Bucket_Name
   - Key : images/and original file name 
   - body : contain file data from req.file.   buffer
   - ACL : allow public access to the file 
   - app.post('/upload', upload.single('image'), (req, res) => {
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
- this end point handle post requests with path /upload 
* 
* 
* Image List (get /list) : 
    - s3.listObjectsv2() : list object is s3 bucket
    * app.get('/list', (req, res) => {
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
* 
* 
* Imgae Download (app.get /dwonload/.imageName)
   - s3.getObject(params) : this method come from aws sdk and its used to fetch data from s3 bucket 
   - promise() :  return request object and convert it to a promise so i can handle errors and response
   - Users can download images by making GET req to download/imageName 

* 
* Environment Variables : .env
   - set your env variables to cofigure the aws s3 :
   - ACCESS_KEY_ID: Your  access key ID.
   - SECRET_ACCESS_KEY: Your  secre access key.
   - REGION: The  region where your S3 bucket is located
   - BUCKET_NAME: The name of your S3 bucket.


* 
* AWS S3 Configuration:
   - AWS SDK package 
   - const s3 = new AWS.S3({
   accessKeyId: process.env.ACCESS_KEY_ID,
   secretAccessKey: process.env.   SECRET_ACCESS_KEY,
   region: process.env.REGION
   });

* 
* Multer Conf
  - used to handle file uploads 
  - const upload = multer({ storage: multer.memoryStorage() });

## steps to Deploy the application to ec2 instance 

* Create an EC2 instance :
   - choose required storage and os 
* Configure security groubs :
   - allow inbound traffic on port used by the application here its PORT : 5000
* install required packages Node.js and NPM
* install all required dependencies 
  - npm install will install all dependencis defined in package.json
* Transfer code to ec2 instance by copying it 
  - one way it to use SCP file transfer 
  - open terminal in the directory app 
  - scp -i <key-pair>.pem -r <app-directory> ubuntu@<public-ip>:~
* those are general and simple steps to deploy  the application to ec2 instance 




