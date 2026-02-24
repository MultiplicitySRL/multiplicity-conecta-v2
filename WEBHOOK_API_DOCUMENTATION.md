# Documentación API Webhook - Creación de Usuarios Nuevos

## Endpoint

```
POST /api/accounts/new
```

## Descripción

Este endpoint recibe solicitudes para crear usuarios nuevos en el sistema del cliente. Al recibir la solicitud:

1. Valida la autenticación mediante Bearer token
2. Llama al API del cliente para crear el usuario
3. Recibe el `temporary_password` generado por el sistema del cliente
4. Envía un email de bienvenida con las credenciales (próximamente)
5. Retorna los datos del usuario creado incluyendo el password temporal

## Autenticación

El endpoint requiere autenticación mediante Bearer Token en el header `Authorization`.

```
Authorization: Bearer <tu-token-secreto>
```

El token debe ser proporcionado por el administrador de la API y configurado en la variable de entorno `WEBHOOK_TOKEN`.

## Request

### Headers

| Header | Valor | Requerido |
|--------|-------|-----------|
| `Content-Type` | `application/json` | Sí |
| `Authorization` | `Bearer <token>` | Sí |

### Body Parameters

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `email` | string | **Sí** | Email del usuario nuevo. Debe tener formato válido. |
| `name` | string | **Sí** | Nombre completo del usuario. No puede estar vacío. |
| `username` | string | **Sí** | Username del usuario. No puede estar vacío. |
| `company_id` | number | **Sí** | ID de la empresa asociada. Debe ser un número positivo. |

### Ejemplo de Request

```bash
curl -X POST https://tu-dominio.com/api/accounts/new \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu_token_secreto_aqui" \
  -d '{
    "email": "juan.perez@ejemplo.com",
    "name": "Juan Pérez",
    "username": "jperez",
    "company_id": 123
  }'
```

### Ejemplo con JavaScript/TypeScript

```typescript
const response = await fetch('https://tu-dominio.com/api/accounts/new', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer tu_token_secreto_aqui'
  },
  body: JSON.stringify({
    email: 'juan.perez@ejemplo.com',
    name: 'Juan Pérez',
    username: 'jperez',
    company_id: 123
  })
});

const data = await response.json();
console.log(data);
```

### Ejemplo con Python

```python
import requests

url = 'https://tu-dominio.com/api/accounts/new'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer tu_token_secreto_aqui'
}
payload = {
    'email': 'juan.perez@ejemplo.com',
    'name': 'Juan Pérez',
    'username': 'jperez',
    'company_id': 123
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

## Responses

### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Usuario creado exitosamente. Email de bienvenida enviado.",
  "data": {
    "account": {
      "id": 952,
      "username": "jperez",
      "email": "juan.perez@ejemplo.com",
      "name": "Juan Pérez",
      "companies_count": 1,
      "created_at": "2026-02-24T00:24:37.728-04:00"
    },
    "temporary_password": "08f9c45d2daf2655e698"
  }
}
```

**Nota importante:** El `temporary_password` es generado por el sistema del cliente y debe ser enviado al usuario en el email de bienvenida.

### Errores

#### 401 Unauthorized - Token Faltante

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Token de autenticación requerido. Use: Authorization: Bearer <token>"
}
```

#### 401 Unauthorized - Token Inválido

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Token de autenticación inválido"
}
```

#### 400 Bad Request - Body Inválido

```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Body de la petición inválido. Debe ser JSON válido."
}
```

#### 400 Bad Request - Email Faltante

```json
{
  "success": false,
  "error": "Bad Request",
  "message": "El campo 'email' es requerido y debe ser un string no vacío"
}
```

#### 400 Bad Request - Email Formato Inválido

```json
{
  "success": false,
  "error": "Bad Request",
  "message": "El campo 'email' debe tener un formato válido"
}
```

#### 400 Bad Request - Name Faltante

```json
{
  "success": false,
  "error": "Bad Request",
  "message": "El campo 'name' es requerido y debe ser un string no vacío"
}
```

#### 400 Bad Request - Username Faltante

```json
{
  "success": false,
  "error": "Bad Request",
  "message": "El campo 'username' es requerido y debe ser un string no vacío"
}
```

#### 400 Bad Request - Company ID Faltante o Inválido

```json
{
  "success": false,
  "error": "Bad Request",
  "message": "El campo 'company_id' es requerido y debe ser un número positivo"
}
```

#### 400 Bad Request - Error de Validación del Cliente

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Email already exists"
}
```

#### 404 Not Found - Empresa No Encontrada

```json
{
  "success": false,
  "error": "Not Found",
  "message": "Empresa con ID 320 no encontrada"
}
```

#### 504 Gateway Timeout

```json
{
  "success": false,
  "error": "Timeout",
  "message": "Tiempo de espera agotado al conectar con el servidor del cliente"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Error interno del servidor"
}
```

#### 500 Server Error - Configuración

```json
{
  "success": false,
  "error": "Server Error",
  "message": "Error de configuración del servidor"
}
```

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| `200` | Usuario creado exitosamente |
| `400` | Datos de entrada inválidos, faltantes, o error de validación del cliente |
| `401` | Token de autenticación inválido o faltante |
| `404` | Empresa no encontrada en el sistema del cliente |
| `500` | Error interno del servidor |
| `504` | Timeout al conectar con el servidor del cliente |

## Flujo Completo

```mermaid
sequenceDiagram
    participant Dev as Desarrollador
    participant Webhook as Tu API Webhook
    participant ClientAPI as API Cliente (staging)
    participant Email as Email Service
    
    Dev->>Webhook: POST /api/accounts/new
    Note over Dev,Webhook: Bearer token + datos usuario
    
    Webhook->>Webhook: Validar Bearer token
    
    alt Token inválido
        Webhook-->>Dev: 401 Unauthorized
    else Token válido
        Webhook->>ClientAPI: POST /companies/320/accounts
        Note over Webhook,ClientAPI: API_KEY + account data
        
        alt Error al crear
            ClientAPI-->>Webhook: 400/404/500
            Webhook-->>Dev: Error correspondiente
        else Usuario creado
            ClientAPI-->>Webhook: account + temporary_password
            Note over Webhook: TODO: Implementar envío
            Webhook->>Email: Enviar credenciales
            Webhook-->>Dev: 200 + datos completos
        end
    end
```

## Notas de Implementación

1. **Seguridad**: El token debe ser generado de forma segura y compartido únicamente con el desarrollador autorizado.

2. **Validaciones**: El endpoint valida:
   - Presencia del Bearer token
   - Formato JSON válido en el body
   - Campos obligatorios: `email`, `name`, `username`, `company_id`
   - Formato de email válido
   - `company_id` debe ser número positivo

3. **Integración con API del Cliente**:
   - URL: `https://staging.multiplicityassess.com/api/admin/companies/{company_id}/accounts`
   - Autenticación: Bearer token usando `API_KEY` del `.env`
   - Timeout: 15 segundos

4. **Logging**: Cada usuario nuevo se registra en los logs del servidor con timestamp y detalles.

5. **Email**: El envío de email de bienvenida está preparado en el código pero pendiente de implementación. Ver comentario TODO en el código. El `temporary_password` debe ser incluido en el email.

6. **Idempotencia**: El endpoint no valida duplicados. El API del cliente retornará un error si el email o username ya existe.

## Configuración

### Variables de Entorno

Asegúrate de configurar la siguiente variable en tu archivo `.env`:

```bash
WEBHOOK_TOKEN=tu_token_secreto_aqui
```

**Recomendación**: Genera un token seguro usando:

```bash
# Opción 1: OpenSSL
openssl rand -hex 32

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opción 3: Python
python -c "import secrets; print(secrets.token_hex(32))"
```

## Testing

### Test con cURL (Desarrollo Local)

```bash
curl -X POST http://localhost:3000/api/accounts/new \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu_token_secreto_aqui" \
  -d '{
    "email": "test@ejemplo.com",
    "name": "Usuario Test",
    "username": "usertest"
  }'
```

### Test con Postman

1. Crear nueva request POST
2. URL: `http://localhost:3000/api/accounts/new`
3. Headers:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer tu_token_secreto_aqui`
4. Body (raw JSON):
```json
{
  "email": "test@ejemplo.com",
  "name": "Usuario Test",
  "username": "usertest",
  "company_id": 123
}
```

## Próximos Pasos

Para completar la implementación del envío de emails:

1. Elegir un servicio de email (Resend, SendGrid, etc.)
2. Instalar la dependencia correspondiente
3. Configurar las credenciales del servicio
4. Implementar la función de envío en la sección TODO del código
5. Crear la plantilla del email de bienvenida

## Soporte

Para cualquier duda o problema con la integración, contactar al equipo de desarrollo.
