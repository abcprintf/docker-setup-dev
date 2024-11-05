import 'dotenv/config';
import * as Minio from 'minio';

// Instantiate the MinIO client with the object store service
// endpoint and an authorized user's credentials
// play.min.io is the MinIO public test cluster
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
})

// File to upload
const sourceFile = './tests/aaa.pdf'

// Destination bucket
const bucket = 'dms'

// Destination object name
const destinationObject = 'API/aaa.pdf'

// Check if the bucket exists
// If it doesn't, create it
const exists = await minioClient.bucketExists(bucket)
if (exists) {
  console.log('Bucket ' + bucket + ' exists.')
} else {
  await minioClient.makeBucket(bucket, 'us-east-1')
  console.log('Bucket ' + bucket + ' created in "us-east-1".')
}

// Set the object metadata
var metaData = {
  'Content-Type': 'application/pdf',
  'X-Amz-Meta-Testing': 1234, // User-defined metadata
  example: 5678,
}

// Upload the file with fPutObject
// If an object with the same name exists,
// it is updated with new data
await minioClient.fPutObject(bucket, destinationObject, sourceFile, metaData)
console.log('File ' + sourceFile + ' uploaded as object ' + destinationObject + ' in bucket ' + bucket)