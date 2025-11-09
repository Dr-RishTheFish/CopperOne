# Copper One

A financial education app for kids, built with React and Firebase. Help children learn about money management, saving, budgeting, and financial responsibility through an interactive, kid-friendly interface.

## Features

- 💰 **Balance Tracking** - Track income, expenses, and savings
- 🎯 **Goals System** - Set and achieve financial goals with progress tracking
- ✅ **Chores** - Complete chores to earn points and rewards
- 🎮 **Finance Quest Game** - Learn financial concepts through interactive gameplay
- 🤖 **Penny AI Assistant** - Get kid-friendly financial advice from Penny (powered by local Ollama)
- 📚 **Learning Modules** - Access Khan Academy financial literacy content
- 🏆 **Rewards System** - Earn points and unlock rewards
- 📊 **Analytics** - View spending patterns and financial insights
- 🔒 **PIN Protection** - Secure sensitive actions with a 4-digit PIN

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Firebase Functions, Firestore
- **AI**: Ollama (local LLM inference)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Firebase CLI (for backend deployment)
- Ollama installed and running (for Penny AI chat)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/copper-one.git
cd copper-one
```

2. Install frontend dependencies:
```bash
cd web
npm install
```

3. Install backend dependencies:
```bash
cd ../functions
npm install
```

4. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Copy your Firebase config to `web/src/context/AuthContext.tsx`
   - Update `firebase.json` with your project configuration

5. Set up Ollama for Penny AI:
   - Install Ollama from [ollama.com](https://ollama.com)
   - Start Ollama: `ollama serve`
   - Pull the required model: `ollama pull llama3.2:3b`
   - See `OLLAMA_SETUP.md` for detailed instructions

6. Start the development server:
```bash
cd web
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
copper-one/
├── web/                 # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── ai/          # AI/LLM integration
│   │   └── types/       # TypeScript type definitions
│   └── public/          # Static assets
├── functions/           # Firebase Cloud Functions
│   └── src/
│       └── index.ts     # API endpoints
└── firebase.json        # Firebase configuration
```

## Key Features Explained

### Penny AI Assistant

Penny uses a local Ollama model to provide kid-friendly financial advice. All processing happens on your computer - no data is sent to external servers.

**Setup:**
1. Install Ollama
2. Pull a model: `ollama pull llama3.2:3b`
3. Start Ollama: `ollama serve`
4. Penny will automatically connect when you open the chat

### Goals & Chores

- **Goals**: Parents can create financial goals with target amounts and point rewards
- **Chores**: Parents can create chores with point values; kids can complete them to earn points
- Both features are protected by PIN (if enabled in settings)

### Learning Modules

Access curated Khan Academy financial literacy content through the Learn section. Content is organized into modules covering:
- Saving and Budgeting
- Interest and Debt
- Investments and Retirement
- Income and Benefits
- Housing
- Car Expenses

## Environment Variables

Create a `.env` file in the `web` directory:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_OLLAMA_URL=http://localhost:11434  # Optional, defaults to localhost
```

## Building for Production

```bash
cd web
npm run build
```

The production build will be in the `web/build` directory.

## Deployment

### Firebase Hosting

```bash
firebase deploy --only hosting
```

### Firebase Functions

```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Financial education content powered by [Khan Academy](https://www.khanacademy.org)
- AI powered by [Ollama](https://ollama.com)
- Built with [React](https://react.dev) and [Firebase](https://firebase.google.com)

