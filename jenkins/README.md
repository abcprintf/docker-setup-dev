## How to Setup

```sh
docker run jenkins/jenkins

docker run -p 8080:8080 -p 50000:50000 -d -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
```

(-p8080:8080) | Expose port 8080                                =>  By Default runs on that port
(-p 50000:50000) | Expose port 50000                            =>  Master / Slave Communication
(-d) | Run in detached mode                                     =>  Run container in backgrund
(-v jenkins_home:/var/jenkins_home) | Bind maned Valume         =>  Persist data of Jenkins

## Access Container
```sh
docker container exec -u 0 -it jenkins bash

// upgrade version jenkins
docker wget http://updates.jenkins-ci.org/download/war/2.341/jenkins.war
// link https://jimkang.medium.com/how-to-start-a-new-jenkins-container-and-update-jenkins-with-docker-cf628aa495e9

// restart container
docker container restart jenkins
```

## Note
```sh
Username: jenkins-user
Password: 12345678
```