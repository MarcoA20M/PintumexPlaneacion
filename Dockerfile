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
# Usa una imagen base de Java
FROM eclipse-temurin:17-jdk-alpine

# Directorio de trabajo
WORKDIR /app

# Copia el archivo JAR (ajusta el nombre según tu proyecto)
COPY target/tu-backend-0.0.1-SNAPSHOT.jar app.jar

# Puerto expuesto
EXPOSE 5000

# Comando de ejecución
ENTRYPOINT ["java", "-jar", "app.jar"]