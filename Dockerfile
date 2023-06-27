FROM openjdk:17-alpine
WORKDIR /app
COPY target/uas-0.0.1-SNAPSHOT.jar uas.jar
EXPOSE 5001
CMD ["java", "-jar", "uas.jar"]
