# 📝 Sticky Note

The **Sticky Note** app is a modern, minimalistic, and user-friendly task management system built using the **PERN Stack (PostgreSQL, Express.js, React, and Node.js)**. Designed for efficiency, it enables users to organize their notes seamlessly with a **fingerprint-based authentication system** for a personalized experience.



## ✨ Features
- 🎯 **User-Specific Notes** secured with **Fingerprint ID** (via FingerprintJS)
- 🔄 **Full CRUD Functionality** (Create, Read, Update, Delete)
- ⚡ **Fast & Lightweight** with Vite for Frontend
- 🚀 **Deployed on Render & Vercel** for scalability
- 🛡️ **Built with TypeScript** for reliability
- 🎨 **Clean & Responsive UI**



## 🛠️ Tech Stack
- **Frontend:** React.js, TypeScript, Vite, TailwindCSS, Framer Motion, Lucide-React
- **Backend:** Node.js, Express.js, PostgreSQL
- **Database Hosting:** Render
- **Deployment:** Vercel (Frontend), Render (Backend)
- **Authentication:** FingerprintJS


## 🚀 Getting Started

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/sticky-note.git
cd sticky-note
```

### 2️⃣ Backend Setup
#### 📌 Install Dependencies
```sh
cd server
npm install
```

#### 📌 Configure Environment Variables
Create a `.env` file in the `server` directory and add:
```env
PG_USER=your_pg_user
PG_PASSWORD=your_pg_password
PG_HOST=your_pg_host
PG_PORT=5432
PG_DATABASE=your_database_name
PORT=4000
```

#### 📌 Initialize Database
```sh
psql -U your_pg_user -d your_database_name -h your_pg_host -p 5432
```
Then, run:
```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    fingerprintId VARCHAR(255) NOT NULL
);
```

#### 📌 Start the Server
```sh
npm run build  # Compile TypeScript
npm run start  # Run the server
```

### 3️⃣ Frontend Setup
#### 📌 Install Dependencies
```sh
cd ../client
npm install
```

#### 📌 Configure Environment Variables
Create a `.env` file in the `client` directory and add:
```env
VITE_BACKEND_API_URL=http://localhost:4000/api/notes
```

#### 📌 Start the Frontend
```sh
npm run dev
```
The app will be available at `http://localhost:5173/`



## 🚀 Deployment Guide
### 📡 Deploy Backend on Render
1. Push your code to GitHub.
2. Create a **Render Web Service**.
3. Connect the GitHub repository.
4. Set environment variables (`PG_USER`, `PG_PASSWORD`, etc.).
5. Use Build Command:
   ```sh
   npm install && npm run build
   ```
6. Use Start Command:
   ```sh
   npm run start
   ```

### 🌍 Deploy Frontend on Vercel
1. Push the frontend code to GitHub.
2. Create a **Vercel Project**.
3. Set Environment Variable:
   ```sh
   VITE_BACKEND_API_URL=https://your-backend-url.onrender.com/api/notes
   ```
4. Deploy!



## 📜 License
This project is open-source and available under the **MIT License**.



## 👤 Author
Developed by **Ranit Kumar Manik** 🚀

> [!NOTE]
> **Note from the Developer:**  
> Sticky Note was created solely for my personal use and is not built on a scalable architecture. This project is just me tinkering with my tech stack, so please don’t judge it too seriously! 😄
