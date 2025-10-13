package com.rsnort;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

// Esta clase ahora solo verifica que el contexto se carga sin errores
@SpringBootTest(classes = RsnortBackendApplication.class)
class RsnortBackendApplicationTests {

    @Test
    void contextLoads() {
        // No hace nada, solo verifica que el contexto se levanta
    }
}
