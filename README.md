# 🛒 Aretécne Microcommerce (Hackathon Interledger - 2025)

Plataforma de microcomercio interoperable impulsada por Open Payments (Interledger)

Aretécne Microcommerce es una plataforma diseñada para habilitar pagos globales interoperables mediante el protocolo Open Payments. Permite vincular wallets compatibles con Interledger y procesar transacciones en múltiples divisas utilizando estándares abiertos. Busca acercar a todas las personas al mundo del comercio digital y se enfoca mas especificamente a gente con poca experiencia en el ambito de los negocios usando internet.

---

## 🏆 Contexto

Proyecto desarrollado durante el Hackathon Open Payments 2025 (Interledger), en un sprint intensivo de 24 horas.

---

## 👥 Equipo

- José Carlos Reynoso — Backend & Arquitectura
- Nicole Rosas — Frontend - Github -> https://github.com/rvnicole


---

## 🎯 Objetivo

Demostrar la integración real de infraestructura fintech interoperable en un sistema modular preparado para escalar hacia un marketplace global.

---

## 🛠 Stack

### Backend
- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- Open Payments API (Interledger)

### Frontend (en progreso)
- React
- Vite
- TypeScript
- Tailwind CSS

---

## 🧠 Arquitectura Backend

Estructura modular con separación de responsabilidades:

- `controllers/` → manejo de requests y responses  
- `services/` → lógica de negocio e integración externa  
- `middlewares/` → autenticación y validaciones  
- `models/` → esquemas de datos (Mongoose)  
- Manejo centralizado de errores  
- Configuración segura mediante variables de entorno  

### Integración Open Payments

Archivo principal de integración:

`src/services/openPayment.ts`

Capacidades actuales:

- Creación de cuentas de usuario
- Vinculación de wallet address de usuario
- Creación y listado de campañas de donación 
- Generación de solicitudes de pago  
- Procesamiento de donaciones  
- Persistencia de transacciones en MongoDB  

---

## 📸 Capturas

![Login microcommerce](https://res.cloudinary.com/domj6qqht/image/upload/v1771386776/microcomerce1_tkxm6h.gif)
![Perfil usuario](https://res.cloudinary.com/domj6qqht/image/upload/v1771386776/microcomerce2_iao5uz.gif)
![donacion](https://res.cloudinary.com/domj6qqht/image/upload/v1771387268/microcomerce3_p8hnbu.gif)

---

## 🔄 Flujo Implementado

1. Usuario se registra  
2. Vincula su wallet Open Payments  
3. Genera o recibe solicitud de donación  
4. Se procesa la transacción mediante Open Payments  
5. Se registra el resultado en MongoDB  

---

## ✨ Funcionalidades Implementadas

- Registro de usuarios
- Integración funcional con Open Payments  
- Solicitud y recepción de donaciones interoperables  
- Persistencia estructurada de transacciones  
- Base arquitectónica

---

## 🚧 Roadmap futuro

- Creación de tiendas virtuales  
- Gestión de productos  
- Carrito de compras  
- Mapa geolocalizado de negocios  
- Versión móvil  

---
