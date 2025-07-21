FROM openjdk:17-jdk-alpine

RUN apk add --no-cache bash maven

WORKDIR /app

COPY mvnw .
COPY .mvn/ .mvn/
COPY . .

RUN chmod +x mvnw

EXPOSE 8082

CMD ["./mvnw", "spring-boot:run"]