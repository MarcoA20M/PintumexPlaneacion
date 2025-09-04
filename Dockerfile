FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copiamos primero los archivos de Maven Wrapper para cachear dependencias
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Descargamos dependencias (esto aprovecha cache)
RUN ./mvnw dependency:go-offline

# Copiamos el resto del código
COPY src src

# Compilamos la aplicación
RUN ./mvnw clean package -DskipTests

# Ejecutamos la app
CMD ["java", "-jar", "target/pintumex-api-0.0.1-SNAPSHOT.jar"]
