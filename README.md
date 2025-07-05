# Reffer

**Reffer** is an open-source SaaS web application designed to streamline the job referral process. Built with **Next.js (App Router)**, **TypeScript**, **Socket.IO**, and **Prisma**, Reffer allows job seekers to find employees at their target companies and send referral requests in just a few clicks—without the need for connection requests, long messages, or unnecessary delays.

---

## 🔗 Live Demo

Visit the live app here: [https://reffer.onrender.com](https://reffer.onrender.com)

---

## 📸 Features

- 🔐 **Google Authentication** via NextAuth.js  
- 👤 **User Profiles**: Personal, college, and job information, resume upload, LinkedIn, and profile pictures  
- 🔍 **Smart Search**: Search by role, company, and optional Job ID  
- 📨 **Referral Requests**: One-click referral request system  
- 💬 **Real-Time Chat**: Powered by Socket.IO for seamless communication  
- 📁 **File Upload**: Resume and profile image uploads via Cloudinary  
- 📱 **Responsive UI**: Fully mobile-compatible using Tailwind CSS  
- 🌐 **Public Profiles**: Discoverable and shareable user profiles  
- 💸 **Support the Platform**: Integrated donation option  

---

## 🧱 Tech Stack

### Frontend:
- [Next.js (App Router)](https://nextjs.org/docs/app)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### Backend:
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [NextAuth.js (Google OAuth)](https://next-auth.js.org/)
- [Socket.IO](https://socket.io/)

### Other:
- [Cloudinary](https://cloudinary.com/) – file hosting (resumes & profile images)
- [Render](https://render.com/) – hosting provider

---

## 🛠️ Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Cicada1107/Reffer.git
cd Reffer
```

### 2. install dependencies
```bash
npm install
```
### 3. Set up env variables
refer .env.local.example

### 4. Push Prisma schema and seed the database (optional)
```bash
npx prisma db push
```

### 5. Run the dev server locally
```bash
npm run dev
```
App should now be running at: http://localhost:3000

---

## 💻 Contributing

Contributions are welcome! If you’d like to improve a feature or fix a bug:
    - Fork the repo
    - Create a new branch (git checkout -b feature-xyz)
    - Make your changes
    - Push and open a PR
Please ensure code is clean, readable, and follows the existing architecture.


--- 

## 📜 License
This project is open-source and licensed under the MIT License.

---

## 🙋‍♂️ Author

- Arijit Dubey
- [LinkedIn](https://www.linkedin.com/in/arijit-dubey-85471028a/)
