# 🚀 Nisha Portfolio — VS Code Setup Guide

## 📁 Project Structure
```
nisha-portfolio/
├── public/
│   ├── index.html       ← Main HTML (frontend)
│   ├── css/
│   │   └── style.css    ← All styles + animations
│   └── js/
│       └── main.js      ← Cursor, scroll, form logic
├── server.js            ← Node.js + Express backend
├── package.json         ← Dependencies
├── .env.example         ← Environment template
├── .env                 ← Your actual secrets (create this)
└── .gitignore
```

---

## ⚡ STEP 1 — VS Code mein Open karo

1. VS Code open karo
2. **File → Open Folder** click karo
3. `nisha-portfolio` folder select karo
4. Open ho jayega ✅

---

## ⚡ STEP 2 — Terminal mein Dependencies Install karo

VS Code mein **Ctrl + `** (backtick) dabao — terminal khulega

```bash
npm install
```

Wait karo... `node_modules` folder create ho jayega ✅

---

## ⚡ STEP 3 — .env file banao

Terminal mein type karo:
```bash
cp .env.example .env
```

Ya manually `.env` naam ki file banao aur likho:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/nisha-portfolio
```

---

## ⚡ STEP 4 — Frontend sirf dekhna hai? (Backend ke bina)

**Option A — Simple (No backend needed):**
```bash
# VS Code mein Live Server extension install karo
# phir public/index.html par right click karo
# "Open with Live Server" click karo
```
Browser mein `http://127.0.0.1:5500` pe portfolio dikhega! ✅

**Option B — npx se:**
```bash
npx live-server public --port=3000
```

---

## ⚡ STEP 5 — Full Backend ke saath chalana

**MongoDB pehle install/start karo:**
- Download: https://www.mongodb.com/try/download/community
- Ya MongoDB Atlas (free cloud): https://cloud.mongodb.com

**Phir server start karo:**
```bash
# Development mode (auto-restart):
npm run dev

# Ya simple:
npm start
```

Browser mein jaao: `http://localhost:5000` ✅

---

## ⚡ STEP 6 — VS Code Extensions (Recommended)

Install karo in extensions:
- **Live Server** — frontend instantly dekhne ke liye
- **Prettier** — code format karne ke liye
- **MongoDB for VS Code** — database dekhne ke liye
- **Thunder Client** — API test karne ke liye

---

## 🧪 API Test karo

Health check:
```
GET http://localhost:5000/api/health
```

Contact form test:
```
POST http://localhost:5000/api/contact
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@gmail.com",
  "message": "Hello Nisha!"
}
```

Saare messages dekhne ke liye:
```
GET http://localhost:5000/api/messages
```

---

## 🎨 Customization

### Apna GitHub link change karo
`public/index.html` mein search karo: `Nishapatel291205`
Apna GitHub username dalo

### Apni photo add karni hai?
1. Apni photo `public/images/nisha.jpg` mein rakho
2. `index.html` mein `.avatar-initials` wale div ko replace karo:
```html
<img src="images/nisha.jpg" alt="Nisha" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />
```

### Resume add karna
`public/` folder mein apna `resume.pdf` rakho — download button auto kaam karega!

---

## 🌐 GitHub Par Deploy karna (Free)

```bash
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/Nishapatel291205/portfolio.git
git push -u origin main
```

Phir **Vercel** (https://vercel.com) pe jaao:
- GitHub se connect karo
- Repository select karo
- Deploy! ✅

Free mein live ho jayega: `nisha-portfolio.vercel.app`

---

## ❓ Problems?

| Problem | Solution |
|---------|---------|
| `npm not found` | Node.js install karo: nodejs.org |
| `MongoDB connection error` | .env mein MONGO_URI check karo |
| `Port 5000 busy` | .env mein PORT=3001 karo |
| Contact form kaam nahi kar raha | Backend run karo ya email directly use karo |

---

**Made with ❤️ — Nisha Harshadbhai Patel**
*nishapatel291205@gmail.com*
