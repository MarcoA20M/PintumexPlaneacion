# Dockerfile corregido
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY . .
# Da permisos de ejecución al mvnw antes de usarlo
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/pintumex-api-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 5000
ENTRYPOINT ["java", "-jar", "app.jar"]