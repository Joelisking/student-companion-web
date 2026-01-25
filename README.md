# Student Companion

A smart scheduling web application for university students that analyzes your academic calendar, understands your scheduling preferences and study patterns, and automatically generates optimized study time blocks to help you stay on top of your coursework.

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Overview

Student Companion is an intelligent academic planning platform designed specifically for university students. The application serves as a personal academic assistant that understands your unique schedule, learning patterns, and preferences to create optimized study plans that maximize productivity while preventing burnout.

Unlike traditional calendar apps or to-do lists, Student Companion uses AI-powered algorithms to analyze your workload, understand the complexity of your tasks, and automatically schedule dedicated study time blocks when you're most likely to be productive.

## Problem Statement

University students face several challenges when managing their academic workload:

1. **Overwhelming Schedules**: Juggling multiple courses, each with their own assignments, quizzes, and exams, makes it difficult to know what to prioritize.

2. **Poor Time Estimation**: Students often underestimate how long assignments will take or when they should start studying for exams, leading to last-minute cramming.

3. **Ineffective Study Planning**: Without a structured approach, students may study at suboptimal times or fail to allocate enough time for difficult subjects.

4. **Reactive Rather Than Proactive**: Most students react to deadlines rather than planning ahead, resulting in stress, poor performance, and burnout.

5. **Lack of Personalization**: Generic scheduling tools don't account for individual preferences, energy levels throughout the day, or personal commitments.

## Solution

Student Companion addresses these challenges by providing:

- **Automated Study Scheduling**: The app analyzes your class schedule, deadlines, and free time to automatically create study blocks on your calendar.

- **Intelligent Deadline Management**: By understanding when assignments are due and their estimated complexity, the app tells you exactly when to start working on each task.

- **Personalized Recommendations**: The system learns your study patterns, preferred study times, and productivity peaks to schedule sessions when you'll be most effective.

- **Proactive Alerts**: Rather than just reminding you of deadlines, the app proactively notifies you when it's time to begin preparing for upcoming exams or assignments.

- **Workload Balancing**: The app distributes your study sessions evenly across available time, preventing the feast-or-famine cycle of procrastination followed by cramming.

## Key Features

### 1. Smart Schedule Import & Management

- **Course Schedule Import**: Easily import your class schedule by connecting to your university's calendar system, uploading an ICS file, or manually entering your classes.
- **Automatic Conflict Detection**: The system identifies scheduling conflicts and overlapping commitments.
- **Recurring Event Support**: Set up recurring classes, labs, and other regular commitments that automatically populate your schedule.
- **Break Time Recognition**: The app recognizes breaks between classes and can suggest quick review sessions or rest periods.

### 2. Assignment & Exam Tracking

- **Centralized Task Dashboard**: View all your upcoming assignments, quizzes, exams, and projects in one unified dashboard.
- **Deadline Management**: Add due dates for all academic tasks with support for specific times (e.g., "11:59 PM" submissions).
- **Priority Levels**: Assign priority levels (high, medium, low) to tasks based on their weight toward your final grade.
- **Complexity Estimation**: Rate the difficulty/complexity of each task to help the AI allocate appropriate study time.
- **Progress Tracking**: Mark tasks as not started, in progress, or completed to track your academic progress.
- **Subtask Support**: Break down large projects into smaller, manageable subtasks with their own mini-deadlines.

### 3. AI-Powered Study Block Generation

- **Automatic Time Blocking**: The AI analyzes your free time and automatically creates dedicated study blocks for each subject.
- **Spaced Repetition Integration**: For exam preparation, the app schedules multiple shorter study sessions spaced over time rather than one long cramming session.
- **Subject Rotation**: Prevents mental fatigue by rotating between different subjects rather than scheduling back-to-back sessions for the same course.
- **Buffer Time Inclusion**: Automatically adds buffer time between study blocks to account for transitions and breaks.
- **Flexible Rescheduling**: If you miss a study block, the AI automatically reschedules it to the next available slot.

### 4. Personalized Study Preferences

- **Preferred Study Times**: Specify when you prefer to study (morning, afternoon, evening, night) and the app will prioritize those times.
- **Session Duration Settings**: Set your ideal study session length (25 minutes, 45 minutes, 1 hour, etc.) based on your attention span.
- **Break Preferences**: Configure break duration and frequency (e.g., Pomodoro-style 5-minute breaks or longer 15-minute breaks).
- **Off-Limit Times**: Block out times when you're unavailable (work, gym, meals, social activities) so the app never schedules during those periods.
- **Weekend Preferences**: Choose whether weekends should be study-heavy, light, or completely free.
- **Energy Level Patterns**: Indicate when you typically have high vs. low energy so demanding tasks are scheduled during peak times.

### 5. Intelligent Recommendations Engine

- **Start Date Suggestions**: For each assignment or exam, the app calculates and recommends when you should begin based on complexity and your available time.
- **Workload Warnings**: Receive alerts when the app detects an unusually heavy workload in an upcoming week.
- **Study Strategy Tips**: Get personalized tips based on the type of task (e.g., "For essay assignments, consider outlining first" or "For math exams, focus on practice problems").
- **Pace Monitoring**: The app monitors whether you're on track with your study plan and adjusts recommendations if you fall behind.
- **Optimal Review Timing**: Suggests the best times to review material before exams based on memory retention research.

### 6. Calendar Integration & Visualization

- **Interactive Calendar View**: View your schedule in daily, weekly, or monthly formats with color-coded events.
- **Study Block Visualization**: Clearly distinguish between classes (fixed), study blocks (AI-generated), and personal events.
- **Drag-and-Drop Rescheduling**: Easily move study blocks to different times if the suggested slot doesn't work for you.
- **External Calendar Sync**: Two-way sync with Google Calendar, Outlook Calendar, and Apple Calendar.
- **Export Options**: Export your schedule to ICS format for use in other applications.

### 7. Progress Analytics & Insights

- **Study Time Tracking**: Automatically track how much time you spend studying each subject.
- **Weekly/Monthly Reports**: Receive detailed reports showing your study patterns, completed tasks, and productivity trends.
- **Subject Distribution**: Visualize how your study time is distributed across different courses.
- **Goal Achievement**: Set weekly study hour goals and track your progress toward them.
- **Streak Tracking**: Build motivation through study streaks (consecutive days of meeting your goals).
- **Historical Analysis**: Review past semesters to understand your patterns and improve future planning.

### 8. Notification & Reminder System

- **Smart Reminders**: Receive reminders before study blocks begin with enough time to prepare.
- **Deadline Alerts**: Get notifications at key intervals before deadlines (1 week, 3 days, 1 day, day-of).
- **Morning Briefings**: Optional daily summary of what's on your schedule and what you should focus on.
- **Weekly Planning Prompts**: Sunday evening prompts to review and adjust your upcoming week's schedule.
- **Customizable Notification Channels**: Choose how you receive notifications (in-app, email, push notifications).

### 9. Focus Mode & Study Sessions

- **Built-in Pomodoro Timer**: Start timed study sessions directly from the app with customizable work/break intervals.
- **Session Logging**: Automatically log completed study sessions and the topics covered.
- **Distraction Blocking Suggestions**: Integration suggestions for focus apps to minimize distractions during study blocks.
- **Session Notes**: Take quick notes during or after study sessions to track what you accomplished.
- **Early Completion Handling**: If you finish a session early, the app suggests what to do with the extra time.

### 10. Course & Semester Management

- **Course Profiles**: Create detailed profiles for each course including instructor, credits, grading breakdown, and difficulty level.
- **Semester Organization**: Organize courses by semester with automatic archiving of past semesters.
- **Grade Tracking**: Input your grades throughout the semester to see your current standing and what you need on remaining assignments.
- **GPA Calculator**: Calculate your current GPA and project future GPA based on expected grades.
- **Credit Hour Tracking**: Monitor your credit hours toward graduation requirements.

### 11. User Experience Features

- **Responsive Design**: Fully responsive interface that works seamlessly on desktop, tablet, and mobile devices.
- **Dark Mode**: Toggle between light and dark themes to reduce eye strain during late-night study sessions.
- **Customizable Dashboard**: Arrange dashboard widgets to show the information most important to you.
- **Quick Actions**: Keyboard shortcuts and quick-add buttons for rapidly creating tasks and events.
- **Onboarding Tutorial**: Guided setup process to configure preferences and import your first schedule.

### 12. Data & Privacy

- **Secure Authentication**: Secure user authentication with email/password and social login options.
- **Data Encryption**: All user data encrypted in transit and at rest.
- **Export Your Data**: Full data export capability for transparency and portability.
- **Privacy Controls**: Granular controls over what data is collected and how it's used.

## How It Works

### Step 1: Account Setup & Onboarding

When you first create an account, you'll go through a brief onboarding process:
1. Enter basic information (name, university, current semester)
2. Set your timezone and preferred language
3. Configure initial study preferences (preferred times, session lengths)
4. Connect your university calendar or manually add your class schedule

### Step 2: Add Your Courses & Schedule

Once onboarded, you'll set up your academic profile:
1. Add each course you're taking this semester with details (course code, name, credits)
2. Import or enter your class schedule (lecture times, lab sessions, tutorials)
3. Add office hours, study groups, or other recurring academic commitments

### Step 3: Input Assignments & Exams

As your professors assign work, add them to the system:
1. Create a new task and select the associated course
2. Enter the due date and time
3. Estimate the complexity (simple, moderate, complex)
4. Optionally add notes, links to resources, or subtasks

### Step 4: AI Generates Your Study Plan

With your schedule and tasks entered, the AI takes over:
1. Analyzes your free time between classes and commitments
2. Considers your stated preferences and energy patterns
3. Calculates how much time each task requires based on complexity
4. Generates optimized study blocks and adds them to your calendar
5. Schedules review sessions before exams using spaced repetition principles

### Step 5: Follow Your Plan & Adapt

As you go through your week:
1. Receive reminders before each study block
2. Use the built-in timer to track your sessions
3. Mark tasks as complete as you finish them
4. If plans change, drag and drop to reschedule or let the AI re-optimize
5. The system learns from your behavior and improves recommendations over time

### Step 6: Review & Improve

At regular intervals:
1. Review your weekly analytics to see how you spent your time
2. Check if you're meeting your study goals
3. Adjust preferences if the current schedule isn't working
4. Prepare for the next week with the Sunday planning prompt

## User Roles

### Students (Primary Users)

The primary users of Student Companion are university students who want to:
- Better manage their academic workload
- Stop procrastinating and start studying proactively
- Reduce stress around deadlines
- Improve their academic performance
- Build consistent study habits

### Administrators (Future)

In future versions, administrators (such as academic advisors or university staff) may have access to:
- Aggregate analytics on student usage (anonymized)
- Ability to push university-wide academic calendar events
- Integration management with university systems

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org) 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint 9

### Backend (Planned)
- **API**: Next.js API Routes / Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI/ML**: OpenAI API for intelligent recommendations

### Infrastructure (Planned)
- **Hosting**: Vercel
- **Database Hosting**: Supabase or PlanetScale
- **File Storage**: AWS S3 or Cloudflare R2
- **Monitoring**: Vercel Analytics, Sentry for error tracking

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

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL=your_database_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# AI Services
OPENAI_API_KEY=your_openai_api_key

# Calendar Integration (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot-reload |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint to check for code issues |

## Project Structure

```
student-companion-web/
├── app/                        # Next.js App Router
│   ├── (auth)/                # Authentication routes (login, register)
│   ├── (dashboard)/           # Protected dashboard routes
│   │   ├── calendar/          # Calendar view
│   │   ├── courses/           # Course management
│   │   ├── tasks/             # Task/assignment management
│   │   ├── analytics/         # Progress analytics
│   │   └── settings/          # User settings
│   ├── api/                   # API routes
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/                 # Reusable UI components
│   ├── ui/                    # Base UI components (buttons, inputs, etc.)
│   ├── calendar/              # Calendar-specific components
│   ├── tasks/                 # Task-related components
│   └── layout/                # Layout components (header, sidebar, etc.)
├── lib/                       # Utility functions and configurations
│   ├── db/                    # Database utilities and Prisma client
│   ├── auth/                  # Authentication utilities
│   ├── ai/                    # AI/ML integration utilities
│   └── utils/                 # General utility functions
├── hooks/                     # Custom React hooks
├── types/                     # TypeScript type definitions
├── prisma/                    # Prisma schema and migrations
├── public/                    # Static assets
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## Future Enhancements

The following features are planned for future releases:

### Phase 2: Collaboration Features
- **Study Groups**: Create and join study groups with classmates
- **Shared Calendars**: View and coordinate schedules with study partners
- **Resource Sharing**: Share notes, links, and study materials within groups

### Phase 3: Advanced AI Features
- **Performance Prediction**: Predict likely grades based on study patterns and historical data
- **Adaptive Difficulty**: Automatically adjust study recommendations based on quiz/exam performance
- **Natural Language Input**: Add tasks using natural language (e.g., "Math homework due Friday")

### Phase 4: University Integration
- **LMS Integration**: Direct integration with Canvas, Blackboard, and Moodle to auto-import assignments
- **University Calendar Sync**: Automatic sync with university academic calendars (add/drop dates, holidays)
- **Advisor Dashboard**: Allow academic advisors to view student progress (with permission)

### Phase 5: Mobile Applications
- **iOS App**: Native iOS application with push notifications
- **Android App**: Native Android application with widget support
- **Offline Mode**: Access schedule and log study sessions without internet connection

## License

This project is private and proprietary. All rights reserved.
