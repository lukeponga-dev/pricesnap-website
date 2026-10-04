# 📸 PriceSnap — AI Resale Valuations for New Zealand

PriceSnap is a high-performance landing page for an AI-assisted resale valuation app. It helps New Zealanders turn photos of their second-hand items into accurate resale estimates in NZD, providing market evidence and condition insights to remove the guesswork from selling.

## 🌟 Key Features

- **AI-Driven Insights**: Showcases how AI identifies items and suggests price ranges based on market evidence.
- **Live Community Feed**: Integrates with Firebase Firestore to display real-time "Live Snaps" (recent valuations) from across Aotearoa.
- **NZ-Centric Design**: Tailored specifically for the New Zealand market with local currency (NZD) and regional context.
- **Performance First**: Built with semantic HTML5, modern CSS, and vanilla JavaScript for near-instant load times.
- **SEO & A11y Optimized**: Includes JSON-LD structured data, OpenGraph meta tags, and WCAG-compliant accessibility features.

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3 (Modern Grid/Flexbox), Vanilla JavaScript (ES Modules).
- **Backend/Database**: Firebase Firestore (NoSQL).
- **Server**: Node.js (for local serving).
- **Deployment**: Ready for static hosting (Firebase Hosting, Vercel, Netlify).

## 📂 Project Structure

```text
pricesnap-website/
├── firebase/               # Firebase deployment config
│   └── firestore.rules      # Database Security Rules
├── public/                 # Frontend Assets (The Website)
│   ├── assets/             # Images
│   ├── index.html          # Main landing page
│   ├── styles.css          # Brand design system and layout
│   ├── privacy.html        # Privacy Policy
│   └── data-deletion.html  # Data Deletion Request page
├── src/                    # Logic and Server
│   ├── firebase-manager.js  # Firebase SDK bridge and API helpers
│   └── server.js           # Local Node.js server
├── README.md               # Project Documentation
├── package.json            # Dependency Management
├── firebase.json            # Firebase CLI config
└── vercel.json             # Vercel deployment config
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- A Firebase Project configured with Firestore.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pricesnap-website.git
   cd pricesnap-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   Create a file named `public/firebase-applet-config.json` with your Firebase project API keys.

4. Run the local server:
   ```bash
   node src/server.js
   ```

5. Open your browser to `http://localhost:3000`.

## 📈 Future Roadmap
- [ ] **Image Optimization**: Migrate assets to WebP format for 30% faster loading.
- [ ] **Spam Protection**: Implement Firebase Cloud Functions for server-side form validation.
- [ ] **Dynamic Routing**: Transition to a framework (like Next.js) if content scales.

## 📄 License
© 2026 PriceSnap. All rights reserved.
