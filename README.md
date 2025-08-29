# 📖 Infinite Wiki

An AI-powered wiki where **every word is clickable** and generates new articles on-demand. Explore knowledge infinitely with each click opening new pathways to discovery.

## 🎯 Core Features

- **Clickable Words**: Every word in articles is a hyperlink
- **AI-Generated Content**: Powered by Gemini 2.5 Flash via LangChain
- **Infinite Exploration**: Each article opens new topics to explore
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Generation**: Articles generated instantly on click

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create `.env.local` with:
   ```
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

3. **Run the development server:**

3. **Run the development server:**

```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)** and start exploring!

## 🎮 How It Works

1. **Start** with the default "Knowledge" article
2. **Click** any word in the article text
3. **Watch** as a new AI-generated wiki page appears
4. **Continue** exploring infinitely - every word opens new worlds!

## 🔧 Tech Stack

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS
- **AI**: LangChain + Google Gemini 2.5 Flash
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/wiki/route.ts    # API endpoint for generating articles
│   ├── layout.tsx           # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── ClickableText.tsx    # Makes every word clickable
│   ├── LoadingSpinner.tsx   # Loading indicator
│   └── WikiPage.tsx        # Main wiki page component
└── ...
```

**Ready to explore infinite knowledge? Click any word and start your journey! 🚀**
# infinite-wiki-langchain
