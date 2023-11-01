FROM openjdk:20
LABEL maintainer="blog@example.com"
EXPOSE 8080

ADD backend/target/ReactBlog.jar app.jar

CMD [ "sh", "-c", "java -jar /app.jar" ]