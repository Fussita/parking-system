# Estructura de Entidades (TypeORM)

> Modelo de datos definido en `backend/src/core/entity/*.entity.ts`.

## Leyenda rápida

- `PK`: Primary Key
- `FK`: Foreign Key (relación)
- **Relaciones**:
  - `N:1` = ManyToOne
  - `1:N` = OneToMany

---

## Mapa general (alto nivel)

- `User` 1:N `Vehicle`
- `Vehicle` 1:N `VehicleEntry`
- `Vehicle` 1:N `Parking` *(en la práctica normalmente será 0..1 parking ocupado, pero el modelo permite varios)*
- `Parking` N:1 `Vehicle` (nullable)
- `User` 1:N `PaymentMethod`
- `User` 1:N `Payment`
- `User` 1:N `Recharge`
- `Recharge` N:1 `PaymentMethod`
- `User` 1:N `Incident`
- `Incident` 1:N `IncidentMessage`
- `IncidentMessage` N:1 `User` (sender)

---

## User

Entidad: `User`

**Campos**
- `id` (uuid, PK)
- `name` (string)
- `password` (string)
- `role` (string)
- `email` (string, unique)
- `accountBalance` (number, default `0`)

**Relaciones**
- 1:N `vehicles` → `Vehicle.user`
- 1:N `paymentMethods` → `PaymentMethod.user`
- 1:N `payments` → `Payment.user`
- 1:N `recharges` → `Recharge.user`
- 1:N `incidents` → `Incident.user`

---

## PaymentMethod

Entidad: `PaymentMethod`

**Campos**
- `id` (uuid, PK)
- `type` (enum) = `TRANSFERENCIA` | `CRYPTO` | `PAYPAL` | `PAGO MOVIL`
- `details` (jsonb, nullable)

**Relaciones**
- N:1 `user` → `User.paymentMethods`

---

## Vehicle

Entidad: `Vehicle`

**Campos**
- `id` (uuid, PK)
- `plate` (string, unique)
- `rfidTag` (string, unique)

**Relaciones**
- N:1 `user` → `User.vehicles`
- 1:N `entries` → `VehicleEntry.vehicle`
- 1:N `parkings` → `Parking.vehicle`

---

## VehicleEntry

Entidad: `VehicleEntry`

**Campos**
- `id` (uuid, PK)
- `entryTime` (timestamp, default `CURRENT_TIMESTAMP`)
- `exitTime` (timestamp, nullable)
- `status` (enum, default `IN`) = `IN` | `OUT`

**Relaciones**
- N:1 `vehicle` → `Vehicle.entries`

---

## Parking

Entidad: `Parking`

**Campos**
- `id` (uuid, PK)
- `name` (string)
- `location` (string)
- `occupied` (boolean, default `false`)

**Relaciones**
- N:1 `vehicle` (nullable) → `Vehicle.parkings`
  - Nota: aunque el uso típico es “un parking ocupado por 0..1 vehículo”, el modelo permite múltiples `Parking` apuntando al mismo `Vehicle`.

---

## Barrier

Entidad: `Barrier`

**Campos**
- `id` (uuid, PK)
- `name` (string)
- `status` (enum, default `CLOSED`) = `OPEN` | `CLOSED`
- `lastUpdated` (timestamp, default `CURRENT_TIMESTAMP`)

**Relaciones**
- (no tiene relaciones)

---

## Tariff

Entidad: `Tariff`

**Campos**
- `id` (uuid, PK)
- `name` (string, unique)
- `description` (string)
- `ratePerHour` (decimal)
- `active` (boolean, default `true`)

**Relaciones**
- (no tiene relaciones)

---

## Payment

Entidad: `Payment`

**Campos**
- `id` (uuid, PK)
- `amount` (decimal)
- `timestamp` (timestamp, default `CURRENT_TIMESTAMP`)

**Relaciones**
- N:1 `user` → `User.payments`

---

## Recharge

Entidad: `Recharge`

**Campos**
- `id` (uuid, PK)
- `amount` (decimal)
- `timestamp` (timestamp, default `CURRENT_TIMESTAMP`)

**Relaciones**
- N:1 `user` → `User.recharges`
- N:1 `method` → `PaymentMethod` *(la relación está definida como `ManyToOne(() => PaymentMethod, (pm) => pm.id)`)*

---

## Incident

Entidad: `Incident`

**Campos**
- `id` (uuid, PK)
- `description` (text)
- `status` (enum, default `OPEN`) = `OPEN` | `CLOSED`
- `createdAt` (timestamp, default `CURRENT_TIMESTAMP`)
- `closedAt` (timestamp, nullable)

**Relaciones**
- N:1 `user` → `User.incidents`
- 1:N `messages` → `IncidentMessage.incident`

---

## IncidentMessage

Entidad: `IncidentMessage`

**Campos**
- `id` (uuid, PK)
- `message` (text)
- `timestamp` (timestamp, default `CURRENT_TIMESTAMP`)

**Relaciones**
- N:1 `incident` → `Incident.messages`
- N:1 `sender` → `User` *(está definido como `(user) => user.id`)*

