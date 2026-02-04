# Rutas de la API (Backend - NestJS)

> Generado a partir de los controllers/gateway actuales en `backend/src`.

## Convenciones

- **Base URL**: sin prefijo global (las rutas son tal cual aparecen en `@Controller(...)`).
- **Swagger**: `GET /api` (UI de Swagger).
- **Auth**: cuando aplique, enviar header:
  - `Authorization: Bearer <JWT>`
- **Validación**: existe `ValidationPipe` global con `whitelist=true` y `forbidNonWhitelisted=true`:
  - Si envías campos extra en el JSON, responde **400**.

---

## Auth

Controller: `AuthController` (`@Controller('auth')`)

| Método | Ruta | Auth / Rol | Parámetros | Body JSON | Acción |
|---|---|---|---|---|---|
| POST | `/auth/login` | Público | - | `{ "email": "juanpedro@gmail.com", "password": "12345678" }` | Valida credenciales y devuelve `{ token, ...user }`. |
| POST | `/auth/register` | Público | - | `{ "name": "Juan Pérez", "email": "juanpedro@gmail.com", "password": "12345678", "role": "Conductor" }` | Crea usuario (rol permitido: `Administrador` o `Conductor`). |
| GET | `/auth/a` | Bearer / `Administrador` | - | - | Verifica autenticación de admin (solo log). |
| GET | `/auth/c` | Bearer / `Conductor` | - | - | Verifica autenticación de conductor (solo log). |

---

## Dashboard

Controller: `DashboardController` (`@Controller('dashboard')`)

| Método | Ruta | Auth / Rol | Parámetros | Body JSON | Acción |
|---|---|---|---|---|---|
| GET | `/dashboard/occupancy` | (no declarado) | - | - | Retorna porcentaje de ocupación `{ occupancy: number }`. |
| GET | `/dashboard/free-spaces` | (no declarado) | - | - | Retorna espacios libres `{ freeSpaces: number }`. |
| GET | `/dashboard/monthly-income` | (no declarado) | - | - | Retorna ingresos por mes `{ [month: string]: number }`. |
| GET | `/dashboard/closed-incidents` | (no declarado) | - | - | Retorna total de incidencias cerradas `{ closedIncidents: number }`. |
| GET | `/dashboard/annual-income` | (no declarado) | - | - | Retorna ingreso anual `{ annualIncome: number }`. |

> Nota: estas rutas no tienen guards declarados en el controller actual.

---

## Parking (puestos) y Barreras

Controller: `ParkingController` (`@Controller('parking')`)

| Método | Ruta | Auth / Rol | Parámetros | Body JSON | Acción |
|---|---|---|---|---|---|
| POST | `/parking` | Bearer / `Administrador` | - | `{ "name": "PB-E1", "location": "Planta Baja, Estacionamiento 1" }` | Crea un puesto de estacionamiento (`occupied=false`). |
| DELETE | `/parking/:id` | Bearer / `Administrador` | Path: `{ "id": "<uuid>" }` | - | Elimina un puesto por id. |
| GET | `/parking` | Bearer / `Administrador` o `Conductor` | - | - | Lista puestos (incluye relación `vehicle`). |
| POST | `/parking/barrier` | Bearer / `Administrador` | - | `{ "name": "Entrada-PB", "status": "CLOSED" }` | Crea una barrera. |
| GET | `/parking/barrier` | Bearer / `Administrador` | - | - | Lista barreras. |
| DELETE | `/parking/barrier/:id` | Bearer / `Administrador` | Path: `{ "id": "<uuid>" }` | - | Elimina una barrera por id. |

---

## Vehicle (vehículos + movimientos)

Controller: `VehicleController` (`@Controller('vehicle')`)

| Método | Ruta | Auth / Rol | Parámetros | Body JSON | Acción |
|---|---|---|---|---|---|
| POST | `/vehicle` | Bearer / `Conductor` | - | `{ "plate": "ABC123", "rfidTag": "aaa-111-aaa" }` | Registra un vehículo para el usuario autenticado. |
| DELETE | `/vehicle/:id` | Bearer / `Conductor` | Path: `{ "id": "<uuid>" }` | - | Elimina un vehículo por id. |
| POST | `/vehicle/out/:rfidTag` | Bearer / `Administrador` o `Conductor` | Path: `{ "rfidTag": "aaa-111-aaa" }` | - | Registra salida: libera parking, cierra entry, y abre/cierra barrera `Salida-PB` (si existe entry). |
| GET | `/vehicle/entry` | Bearer / `Administrador` | - | - | Lista movimientos (entries) ordenados por `entryTime/exitTime` desc. |
| GET | `/vehicle` | Bearer / `Conductor` | - | - | Lista vehículos del usuario autenticado. |

---

## Tariff (tarifas)

Controller: `TariffController` (`@Controller('tariff')`)

| Método | Ruta | Auth / Rol | Parámetros | Body JSON | Acción |
|---|---|---|---|---|---|
| POST | `/tariff` | Bearer / `Administrador` | - | `{ "name": "Tarifa por Día", "description": "Estacionamiento por un día", "ratePerHour": 14 }` | Crea tarifa (valida nombre único). |
| PUT | `/tariff/:id` | Bearer / `Administrador` | Path: `{ "id": "<uuid>" }` | `{ "name": "Tarifa nueva", "description": "Desc", "ratePerHour": 20, "active": true }` | Actualiza tarifa (campos opcionales). |
| DELETE | `/tariff/:id` | Bearer / `Administrador` | Path: `{ "id": "<uuid>" }` | - | Elimina tarifa por id. |
| GET | `/tariff` | Bearer / `Administrador` o `Conductor` | - | - | Lista tarifas. |

---

## Payment (pago + entrada al estacionamiento)

Controller: `PaymentController` (`@Controller('payment')`)

| Método | Ruta | Auth / Rol | Parámetros | Body JSON | Acción |
|---|---|---|---|---|---|
| POST | `/payment` | Bearer / `Conductor` | - | `{ "rfidTag": "aaa-111-aaa", "methodId": "<uuid>", "tariffId": "<uuid>" }` | Cobra tarifa (descuenta saldo), asigna un parking libre, crea `VehicleEntry`, abre/cierra barrera `Entrada-PB` y emite eventos WS. |
| GET | `/payment/user/:id` | Bearer / `Administrador` o `Conductor` | Path: `{ "id": "<uuid>" }` | - | Lista pagos del usuario `:id`. |

---

## User (perfil, métodos de pago, recargas)

Controller: `UserController` (`@Controller('user')`)

| Método | Ruta | Auth / Rol | Parámetros | Body JSON | Acción |
|---|---|---|---|---|---|
| POST | `/user/payment-method` | Bearer / `Conductor` | - | `{ "type": "PAGO MOVIL", "details": { "label": "Mi método" } }` | Agrega método de pago al usuario autenticado. |
| DELETE | `/user/payment-method/:id` | Bearer / `Conductor` | Path: `{ "id": "<uuid>" }` | - | Elimina método de pago por id (del usuario autenticado). |
| GET | `/user/payment-method` | Bearer / `Conductor` | - | - | Lista métodos de pago del usuario autenticado. |
| POST | `/user/recharges` | Bearer / `Conductor` | - | `{ "methodId": "<uuid>", "amount": 50 }` | Crea recarga e incrementa el saldo del usuario autenticado. |
| GET | `/user/recharges` | Bearer / `Conductor` | - | - | Lista recargas del usuario autenticado. |
| GET | `/user` | Bearer / `Conductor` o `Administrador` | - | - | Devuelve el usuario autenticado (objeto `user` del JWT guard). |
| GET | `/user/all` | Bearer / `Administrador` | - | - | Lista usuarios con role `Conductor`. |

---

## Incident (incidencias + chat HTTP)

Controller: `IncidentController` (`@Controller('incident')`)

| Método | Ruta | Auth / Rol | Parámetros | Body JSON | Acción |
|---|---|---|---|---|---|
| POST | `/incident` | Bearer / `Conductor` | - | `{ "title": "No abre la barrera", "description": "Estoy en la entrada y la barrera no sube" }` | Crea incidencia asociada al usuario autenticado y notifica por WS `newIncident`. |
| POST | `/incident/done/:id` | Bearer / `Administrador` o `Conductor` | Path: `{ "id": "<uuid>" }` | - | Marca incidencia como `CLOSED` y setea `closedAt`. |
| GET | `/incident` | Bearer / `Administrador` | - | - | Lista incidencias (con `user`, `messages`, `messages.sender`). |
| GET | `/incident/user/:id` | Bearer / `Administrador` o `Conductor` | Path: `{ "id": "<uuid>" }` | - | Lista incidencias por usuario id. |
| GET | `/incident/chat/:id` | Bearer / `Administrador` o `Conductor` | Path: `{ "id": "<uuid>" }` | - | Obtiene incidente + mensajes (relaciones `user`, `messages`). |

> Nota: en el controller actual, algunos métodos hacen `await service...` pero no retornan el valor (`createIncident`, `doneIncident`), así que la respuesta HTTP puede venir vacía aunque la operación se ejecute.

---

## WebSocket (Socket.IO) - IncidentGateway

Gateway: `IncidentGateway` (`@WebSocketGateway({ cors: true })`)

### Conexión

- El cliente debe conectarse enviando `userId` en `handshake.query`:
  - Ejemplo: `ws://<host>:<port>/socket.io/?userId=<uuid>` (la URL exacta depende del cliente Socket.IO).
- Si falta `userId` o el usuario no existe, el gateway desconecta.

### Mensajería

- **Cliente → Servidor**
  - Evento: `sendMessage`
  - Payload JSON:
    ```json
    {
      "incidentId": "<uuid>",
      "userId": "<uuid>",
      "message": "texto"
    }
    ```

- **Servidor → Cliente**
  - `newIncident` → `{ ...incident }`
  - `barriedMoved` → `{ "entry": { ...barrier } }`
  - `vehicleEntry` → `{ ...entry }`
  - `receiveMessage` → `{ ...messageEntity }`

