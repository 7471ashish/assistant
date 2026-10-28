# 🤖 Nexus AI — Next-Gen Virtual Voice Assistant

![Nexus AI Banner](frontend/src/assets/futuristic%20background.webp)

An intelligent, interactive virtual voice and text assistant powered by **Google Gemini AI**. Nexus AI combines real-time speech recognition, neural text-to-speech synthesis, custom visual personas, smart action routing, and an ultra-modern cyberpunk glassmorphic interface.

---

## 🌟 Key Features

* **🎙️ Smart Speech Interaction**:
  * **Tap-to-Talk**: One-click microphone interaction with live real-time transcript streaming.
  * **Wake-Word Mode**: Hands-free detection listening for your assistant's customized name (*e.g., "Nova", "Jarvis", "Aura"*).
  * **Echo-Free Synthesis**: Automatic microphone muting and cooling periods during text-to-speech playback to prevent audio feedback loops.
  * **Multi-Dialect Support**: Native voice synthesis in both **English (en-US)** and **Hindi (hi-IN)**.

* **🧠 Powered by Google Gemini AI**:
  * Intelligent intent classification and conversational responses under 20 words for natural voice replies.
  * Smart system command triggers:
    * 🔍 **Google Search**: Automatic search query dispatch.
    * 📺 **YouTube**: Direct search and video playback.
    * 🧮 **Calculator**: Quick computation tools.
    * ⛅ **Weather**: Real-time forecast searches.
    * 📱 **Social Shortcuts**: One-tap Instagram and Facebook access.
    * ⏰ **Clock & Calendar**: Real-time Date, Time, Day, and Month queries.

* **🎨 Cyberpunk Glassmorphism UI**:
  * Responsive layout styled with **Tailwind CSS v4** and modern Google Fonts (**Outfit** & **Plus Jakarta Sans**).
  * Animated holographic core with dynamic orbital glow rings reacting to **Idle**, **Listening**, **Thinking**, and **Speaking** states.
  * Dynamic audio equalizer wave bars.
  * Slide-over command history drawer with one-click prompt re-run.

* **🎭 Personalized Identity & Customization**:
  * Choose between multiple pre-configured neural avatars or upload your custom persona image (stored via Cloudinary).
  * Name your assistant and assign custom wake words.

* **🔒 Secure Authentication & Architecture**:
  * JWT-based authentication stored in secure `HTTP-only` cookies.
  * Password encryption via `bcryptjs`.
  * MongoDB Mongoose schemas with connection timeouts and IPv4 fallback.
  * Express 5 backend with dynamic CORS and health monitoring endpoint (`/api/health`).
  * Automated **GitHub Actions Keep-Alive Cron** to keep free-tier deployments awake.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework**: React 19 + Vite
* **Styling**: Tailwind CSS v4
* **Routing**: React Router DOM v7
* **Icons**: React Icons
* **HTTP Client**: Axios
* **Audio APIs**: Web Speech API (`SpeechRecognition` & `speechSynthesis`)

### **Backend**
* **Runtime**: Node.js (ES Modules)
* **Framework**: Express v5
* **Database**: MongoDB + Mongoose
* **AI Model**: Google Gemini API (`@google/genai`)
* **File Uploads**: Cloudinary + Multer
* **Authentication**: JSON Web Token (JWT) + Bcryptjs

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
* [Google Gemini API Key](https://aistudio.google.com/)
* [Cloudinary Account](https://cloudinary.com/) (For avatar uploads)

---

### 1. Clone the Repository

```bash
git clone https://github.com/7471ashish/assistant.git
cd assistant
```

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` folder:
   ```env
   PORT=8000
   MONGODB_URL="mongodb://127.0.0.1:27017/virtualAssistant"
   JWT_SECRET="your_jwt_secret_key"
   CLOUD_NAME="your_cloudinary_cloud_name"
   CLOUDINARY_API_KEY="your_cloudinary_api_key"
   CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
   GEMINI_API_KEY="your_google_gemini_api_key"
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:8000`.*

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 📡 API Endpoints

### **Authentication (`/api/auth`)**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user account |
| `POST` | `/api/auth/signin` | Log in and receive HTTP-only session cookie |
| `GET` | `/api/auth/logout` | Clear session cookie and sign out |

### **User & Assistant (`/api/user`)**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/user/current` | Retrieve currently logged-in user profile |
| `POST` | `/api/user/update` | Update assistant name & visual persona image |
| `POST` | `/api/user/asktoassistant` | Process voice/text query with Gemini AI |
| `POST` | `/api/user/clear-history` | Clear user's command interaction history |

### **Health Check**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Diagnostic check returning DB and server status |

---

## ⚡ Keep-Alive Cron Job (Render Deployment)

When deployed on Render's free tier, servers spin down after 15 minutes of inactivity. 

This repository includes a scheduled GitHub Action in [`.github/workflows/keep-alive.yml`](.github/workflows/keep-alive.yml) that automatically runs every **14 minutes** to ping your backend `/api/health` endpoint:

1. Add your deployed backend URL as a secret in GitHub:
   * **GitHub Repo** ➔ **Settings** ➔ **Secrets and variables** ➔ **Actions**
   * Key: `BACKEND_URL`
   * Value: `https://your-backend.onrender.com`
2. The workflow will run automatically in the background to ensure zero cold-start delays.

---

## 📄 License

This project is licensed under the [ISC License](backend/package.json).
