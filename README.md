# Student Companion

A smart scheduling web application for university students that analyzes your academic calendar, understands your scheduling preferences and study patterns, and automatically generates optimized study time blocks to help you stay on top of your coursework.

## What It Does

Student Companion takes the guesswork out of planning your study time:

- **Intelligent Schedule Analysis**: Import your class schedule, exam dates, quiz dates, and assignment deadlines
- **Personalized Study Planning**: Configure your scheduling preferences (preferred study times, session lengths, break patterns) and let the app learn your habits
- **Automated Time Blocking**: Generates study blocks on your calendar based on upcoming deadlines and your availability
- **Deadline-Aware Recommendations**: Tells you when to start working on assignments or studying for exams based on their due dates and complexity
- **AI-Powered Assistance**: Uses AI to optimize your study schedule and provide smart suggestions

## Key Features

- **Task & Assignment Tracking**: Keep all your coursework, deadlines, and exams in one place
- **Smart Calendar Integration**: Visualize your schedule with auto-generated study blocks
- **AI Scheduling Assistant**: Get personalized recommendations for when and what to study
- **Preference Learning**: The app adapts to your study patterns over time

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 16 (App Router)
- **Language**: TypeScript
- **UI**: React 19
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint 9

## Getting Started

### Prerequisites

- Node.js 18.18.0 or later (v20+ recommended)
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd student-companion-web

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
student-companion-web/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── public/                 # Static assets
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## License

This project is private.
