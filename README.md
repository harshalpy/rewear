# 👕 ReWear – Clothing Exchange Platform (Backend)

**ReWear** is a community-driven clothing exchange platform that encourages sustainable fashion practices. Users can upload their pre-loved clothing, discover items shared by others, and either **swap** or **redeem** them using points.

This repository houses the **Node.js backend** for ReWear, built with **Express**, **MongoDB**, and integrated with **JWT authentication** and **Cloudinary** for media management.

---

## 🌟 Features

- 🔐 **JWT Authentication** – Signup, Login, Protected Routes
- 👕 **Product Upload** – Add images and item details
- 🔁 **Swap Handler** – Offer, request, and accept swaps
- 📦 **RESTful APIs** – Clean, scalable, and well-structured
- ☁️ **Cloudinary Integration** – For secure image storage
- 🧾 **Feedback System** – Users can leave feedback on exchanges
- 🛠️ **Admin Support** – Admin APIs for user/item moderation (WIP)

---

## 🛠️ Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** – For secure authentication
- **Cloudinary** – Media storage and delivery
- **Multer** – File upload handling
- **CORS**, **Helmet** – Security and cross-origin setup
- **Dotenv** – Environment variable configuration

---

## ⚙️ Getting Started

### 1. 🚀 Clone the Repository

```bash
git clone https://github.com/your-username/rewear-backend.git
cd rewear-backend
```

### 2. 📦 Install Dependencies

```bash
npm install
```

### 3. 📝 Set Up Environment Variables

Create a `.env` file in the root directory and configure it using the template below.

#### ✅ `.env` Example

```env
PORT=4000
MONGODB_URI=your-mongo-name
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
JWT_SECRET=your-jwt-secret
```

> ⚠️ Never commit your actual `.env` file to GitHub. Use `.env.example` for reference.

---

### 4. 🔧 Start Development Server

```bash
npm run dev
```

Your backend will be live at: [http://localhost:4000](http://localhost:4000)
