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

