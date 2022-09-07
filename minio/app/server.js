var Minio = require('minio')

var minioClient = new Minio.Client({
    endPoint: 'minio-dev',
    port: 9000,
    useSSL: false,
    accessKey: 'devmix',
    secretKey: 'J]ji,%eq?vt0{P.f'
});

/**
 * Download File
 */
 var size = 0
 minioClient.fGetObject('documents', '0000000003-1648709833645.pdf', 'C:\\Users\\User\\Downloads\\Documents\\0000000003-1648709833645-minio.pdf', function(err) {
   if (err) {
     return console.log(err)
   }
   console.log('success')
 })

/**
 * Upload File
 */
// var file = 'C:\\Users\\User\\Downloads\\Documents\\0000000003-1648709833645.pdf'

// var metaData = {
//     'Content-Type': 'application/pdf',
//     'X-Amz-Meta-Testing': 1234,
//     'example': 5678
// }
// // Using fPutObject API upload your file to the bucket documents.
// minioClient.fPutObject('documents', '0000000003-1648709833645.pdf', file, metaData, function(err, etag) {
//   if (err) return console.log(err)
//   console.log('File uploaded successfully.')
// });

/**
 * Make Documents
 */
// Make a bucket called documents.
// minioClient.makeBucket('documents', 'us-east-1', function(err) {
//     if (err) return console.log(err)

//     console.log('Bucket created successfully in "us-east-1".')

//     var metaData = {
//         'Content-Type': 'application/pdf',
//         'X-Amz-Meta-Testing': 1234,
//         'example': 5678
//     }
//     // Using fPutObject API upload your file to the bucket documents.
//     minioClient.fPutObject('documents', '0000000003-1648709833645.pdf', file, metaData, function(err, etag) {
//       if (err) return console.log(err)
//       console.log('File uploaded successfully.')
//     });
// });