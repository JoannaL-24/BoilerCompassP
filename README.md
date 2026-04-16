# BoilerCompass

BoilerCompass is a degree planning and advising platform designed for Purdue students and academic advisors. It helps students turn graduation requirements into clear semester-by-semester plans, while giving advisors a faster way to understand student progress and support schedule decisions.

The product is built around a simple goal: make academic planning easier to understand, easier to update, and easier to discuss.

## Table of Contents

- [Live Website](#live-website)
- [Product Overview](#product-overview)
- [Who It Serves](#who-it-serves)
- [Key Capabilities](#key-capabilities)
- [Product Value](#product-value)
- [Current Product Scope](#current-product-scope)
- [Getting Started](#getting-started)
- [Available Commands](#available-commands)
- [Deployment](#deployment)
- [Notes for Reviewers](#notes-for-reviewers)
- [License](#license)

## Live Website

BoilerCompass is deployed at:

```text
https://boilercompass-3135d.web.app/
```
For cost-control and pricing-limit reasons, the deployed version may restrict or disable course search during review.

## Product Overview

Academic planning often requires students to balance degree requirements, course availability, prerequisites, credit loads, graduation timelines, and advisor feedback across several disconnected tools. BoilerCompass brings those planning activities into one shared workspace.

Students can build and adjust schedules visually. Advisors can review student information and schedules in a centralized view. Together, the experience reduces confusion around course planning and gives both sides a clearer picture of progress toward graduation.

## Who It Serves

### Students

BoilerCompass helps students:

- Create a personalized academic profile.
- Plan courses across multiple semesters.
- Search for Purdue courses while building a schedule.
- Track planned and completed coursework.
- View degree progress in a more digestible format.
- Estimate GPA outcomes based on planned grades.
- Share schedules with friends for comparison and collaboration.

### Advisors

BoilerCompass helps advisors:

- Maintain a list of students they support.
- Search and sort students quickly.
- Review student profile details.
- View student schedules during advising conversations.
- Support more informed course planning decisions.

## Key Capabilities

### Guided Onboarding

New users can create an account, choose their role, and complete a profile tailored to either the student or advisor experience. Students provide academic planning information such as major, minor, start year, and expected graduation year. Advisors provide department and college information.

### Student Degree Planning

Students can create academic schedules that span their time at Purdue. Courses can be added to semester blocks, moved between terms, and adjusted as plans change.

### Purdue Course Search

The planner includes course search so students can find Purdue courses while building their schedule. This keeps planning focused inside the product instead of requiring users to jump between multiple tools.

### Progress Tracking

BoilerCompass summarizes progress toward degree requirements and separates completed coursework from planned coursework. This gives students a quick understanding of where they stand and what still needs attention.

### GPA Support

Students can enter grade information to view cumulative and expected GPA estimates. This supports better planning around workload, performance goals, and future semesters.

### Schedule Sharing

Students can connect with friends, send and accept requests, view shared schedules, and copy schedules when useful. This supports peer planning and makes it easier to compare academic paths.

### Advisor Dashboard

Advisors can search for students, organize student lists, and view student details and schedules. This helps make advising sessions more focused and productive.

### Profile and Account Management

Users can update profile information, upload a profile picture, switch between light and dark mode, sign out, and manage account data.

## Product Value

BoilerCompass provides value by:

- Reducing uncertainty around graduation planning.
- Helping students see the long-term impact of course choices.
- Creating a shared planning reference for students and advisors.
- Making schedule changes easier to explore.
- Supporting collaboration between peers.
- Giving advisors quicker access to relevant student planning information.


## Getting Started

These instructions are for running BoilerCompass locally for review, development, or demonstration.

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- A Firebase project configuration for local development

Optional, depending on which supporting services you want to test:

- Firebase CLI for deployment or emulator workflows
- Python 3 and Tesseract OCR for the profile image moderation function

### Install Dependencies

From the project root:

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root and add your Firebase configuration values:

```env
REACT_APP_FIREBASE_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_FIREBASE_APP_ID=your-app-id
REACT_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

Do not commit real Firebase keys, service account files, or production secrets.

### Start the App

```bash
npm start
```

The app will open at:

```text
http://localhost:3000
```

### Build the App

```bash
npm run build
```

This creates a production-ready build in the `build/` folder.

### Run Tests

```bash
npm test
```

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Runs the local development server |
| `npm run build` | Creates a production build |
| `npm test` | Runs the test suite |
| `npm run eject` | Ejects the Create React App configuration |

## Deployment

If Firebase CLI is configured for the project, build and deploy with:

```bash
npm run build
firebase deploy --only hosting
```

To deploy Firebase rules or functions, use the relevant Firebase CLI commands for the connected project.

## Notes for Reviewers

- The product currently depends on Firebase configuration to support account-based workflows.
- Some features require live service access, such as authentication, database reads/writes, storage, and course data lookup.
- Course search may be restricted in the deployed version to control usage costs and stay within pricing limits.
- Guest usage is available for parts of the student experience, but account-based use gives the most complete product demonstration.
- The current degree progress experience is centered on the modeled Computer Science requirement set.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
