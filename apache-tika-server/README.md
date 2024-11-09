## Apache Tika Server

### Building
```sh
docker build -t apache-tika-server .
```

### Running
```sh
docker run -d -p 9998:9998 apache-tika-server
```

### Using
```sh
// -T = --upload-file
curl -T file.pdf http://localhost:9998/tika

// parses the content of the file
curl -T file.pdf http://localhost:9998/tika --header "Accept: text/plain"

// parses details of the file
curl -T file.pdf http://localhost:9998/meta
```