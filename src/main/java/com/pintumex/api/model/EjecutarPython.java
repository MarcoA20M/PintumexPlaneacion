package com.pintumex.api.model;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class EjecutarPython {

    public static String ejecutarPython() {
        StringBuilder output = new StringBuilder();
        try {
            // Comando para ejecutar python y script
            ProcessBuilder pb = new ProcessBuilder("python", "ruta/a/analiza_inventario.py");
            Process p = pb.start();

            // Leer salida estándar
            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            int exitCode = p.waitFor();
            if (exitCode != 0) {
                return "Error al ejecutar script Python";
            }
        } catch (Exception e) {
            return "Excepción: " + e.getMessage();
        }
        return output.toString();
    }
}
