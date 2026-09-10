# AI Resume Viewer & SkillBridge Engine 🚀

An end-to-end AI-powered career intelligence platform and full-stack API engine built with **React 19**, **TypeScript**, **Express**, and **Google Gemini 3.8 Flash**. 

It transforms unstructured resumes into structured data, audits ATS compatibility across 5 scoring dimensions, identifies high-priority technical skill gaps, recommends targeted courses from top platforms (Coursera, freeCodeCamp, Udemy, edX), and rewrites weak bullets into high-impact Google XYZ bullet points.

---

## ✨ Features

- **📄 Intelligent Resume Parsing (`/api/resume/parse`)**
  - Converts unstructured plain text or pasted resumes into clean, strongly-typed JSON.
  - Accurately segments contact info, professional summary, work history, education, skills, and certifications.

- **🎯 ATS Readiness & Comprehensive Audit (`/api/resume/analyze`)**
  - Scores resumes across 5 critical dimensions:
    - **ATS Match Score** (parsing compatibility, section headers)
    - **Technical Depth** (frameworks, tooling, architecture)
    - **Quantified Impact & Metrics** (percentages, revenue, scale)
    - **Layout & Structure** (readability, typography, brevity)
    - **Tone & Action Verbs** (proactive ownership vs. passive tasks)
  - Predicts seniority level and estimated years of experience.

- **🎓 Skill Gaps & Recommended Courses (with D3.js Skill Radar Chart)**
  - Interactive **D3.js Skill Proficiency Radar Chart** comparing candidate skills against senior industry standards across 6-8 role-specific competencies.
  - Responsive SVG canvas with `ResizeObserver`, hover tooltips, and gap metric indicators.
  - Flags **High-Priority** and **Medium-Priority** skill gaps.
  - Recommends real-world courses (platform, course title, duration, free/paid audit flag, direct link).
  - Supplies **Portfolio Capstone Blueprints** with pre-formulated resume lines to close each gap.

- **⚡ Google XYZ Bullet Point Optimizer**
  - Detects passive, metric-deprived resume bullets.
  - Rewrites them according to the Google standard: *"Accomplished [X], as measured by [Y], by doing [Z]"*.

- **💼 Job Fit Matcher (`/api/resume/job-match`)**
  - Compares resume text against any target job description.
  - Yields a match percentage, keyword match breakdown, missing requirements, and tailored interview prep advice.

- **💬 Conversational AI Resume Assistant (`/api/resume/ask`)**
  - Real-time side drawer to ask questions about the resume (*"What are this candidate's biggest technical accomplishments?"*, *"Draft an executive summary for a Staff level role"*).

- **🌐 SkillBridge AI Portal (`/skillbridge`)**
  - Built-in portal featuring dark-mode UI with live metric cards, learning tabs, and interactive sample presets.

- **🛡️ Resilient Dual-Engine Architecture**
  - Powered primarily by Google's latest **Gemini 3.8 Flash** with automatic model fallback (`gemini-flash-latest`).
  - Equipped with an automated **Heuristic Resilient Engine** fallback so the system remains fully operational and responsive even if API quotas or network constraints occur.

---

## 🛠️ Tech Stack

- **Frontend:**
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Lucide React](https://lucide.dev/) (Icons)
  - [Motion](https://motion.dev/) (Smooth animations)
- **Backend:**
  - [Express](https://expressjs.com/) (Node.js runtime)
  - [Vite 6](https://vitejs.dev/) with development middleware mode
  - [esbuild](https://esbuild.github.io/) for bundling the server into a single production `.cjs`
  - [tsx](https://github.com/privatenumber/tsx) for zero-compilation TypeScript dev execution
- **AI & LLM:**
  - [@google/genai SDK](https://www.npmjs.com/package/@google/genai)
  - **Gemini 3.8 Flash** with structured JSON schema enforcement (`responseSchema`)

---

## 📁 Project Structure

```text
├── public/
│   ├── assets/              # Static assets & illustrations
│   └── skillbridge.html     # Dedicated standalone SkillBridge AI web portal
├── src/
│   ├── components/
│   │   ├── AiChatDrawer.tsx    # Interactive conversational Q&A side-drawer
│   │   ├── ApiExplorer.tsx     # Built-in live API request tester & cURL generator
│   │   ├── AtsAuditPanel.tsx   # ATS readiness breakdown & skill gaps panel
│   │   ├── JobMatcherPanel.tsx # Job description fit scoring & gap analysis
│   │   ├── Navbar.tsx          # Top navigation bar with sample switcher & API modal
│   │   ├── ResumeViewer.tsx    # Clean formatted document layout & course cards
│   │   └── UploadModal.tsx     # File/text resume importer modal
│   ├── data/
│   │   └── sampleResumes.ts    # Pre-configured benchmark resumes across roles
│   ├── types.ts                # TypeScript interfaces for resumes, gaps, and audits
│   ├── App.tsx                 # Main application entry and view router
│   ├── index.css               # Tailwind CSS entrypoint
│   └── main.tsx                # React DOM mount point
├── .env.example             # Documented environment variables template
├── metadata.json            # AI Studio applet configuration & permissions
├── package.json             # Dependencies and build scripts
├── server.ts                # Express backend + Vite middleware + Gemini AI routes
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** v20 or higher
- **npm** or **bun** / **yarn** / **pnpm**
- A [Google Gemini API Key](https://aistudio.google.com/)

### 2. Clone and Install

```bash
git clone https://github.com/your-username/ai-resume-viewer-api.git
cd ai-resume-viewer-api
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

> *Note: If no API key is provided, the application will automatically fall back to its internal heuristic parsing and scoring engine so you can still test the UI and workflows locally.*

### 4. Run Development Server

```bash
npm run dev
```

The application will be running at:
- **Main React Application:** [http://localhost:3000](http://localhost:3000)
- **SkillBridge AI Portal:** [http://localhost:3000/skillbridge](http://localhost:3000/skillbridge)
- **API Health Check:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

### 5. Production Build

To build the client SPA and bundle the backend TypeScript server into a self-contained production bundle:

```bash
npm run build
npm start
```

---

## 📡 API Reference

### 1. Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "service": "AI Resume Viewer & SkillBridge API",
  "geminiConfigured": true,
  "model": "gemini-3.8-flash"
}
```

---

### 2. SkillBridge Analysis (Gaps, Scores, Courses & Rewrites)
```http
POST /api/analyze
Content-Type: application/json
```
**Request Body:**
```json
{
  "resumeText": "Alex Morgan\nSoftware Engineer...\n- Worked on the backend API and made it faster.",
  "role": "Senior Full-Stack SDE"
}
```

**Example Response:**
```json
{
  "score": 78,
  "match_level": "Moderate Fit",
  "extracted_skills": ["React", "Node.js", "TypeScript"],
  "sub_scores": {
    "ats_match": 85,
    "tech_depth": 76,
    "impact_metrics": 52,
    "formatting": 92,
    "tone_clarity": 84
  },
  "skill_gaps": [
    {
      "skill": "Containerization & Cloud Orchestration (Docker & Kubernetes)",
      "priority": "high",
      "description": "Senior roles require packaging microservices into container images and managing multi-node clusters.",
      "course": {
        "platform": "freeCodeCamp",
        "title": "Docker & Kubernetes Full Course for Beginners",
        "duration": "4 hours",
        "free": true,
        "url": "https://www.freecodecamp.org/news/learn-docker-and-kubernetes-hands-on-course/"
      },
      "capstone_title": "Production-Grade Kubernetes Deployment with GitOps",
      "capstone_line": "Containerized multi-tier Node.js services with Docker and orchestrated rolling zero-downtime releases on AWS EKS."
    }
  ],
  "bullet_rewrites": [
    {
      "original": "Worked on the backend API and made it faster.",
      "rewritten": "Optimized high-throughput Node.js backend REST API endpoints and query indices, reducing p95 server response latency by 42% for 250,000 active users.",
      "issue": "Lacks measurable metrics, technical methodology, and proactive ownership."
    }
  ]
}
```

---

### 3. Parse Raw Resume to JSON
```http
POST /api/resume/parse
Content-Type: application/json

{
  "rawText": "Jane Doe\nStaff Engineer\njane@example.com..."
}
```

---

### 4. Comprehensive ATS Audit
```http
POST /api/resume/analyze
Content-Type: application/json

{
  "resume": { /* Parsed resume object or raw text */ }
}
```

---

### 5. Job Description Matcher
```http
POST /api/resume/job-match
Content-Type: application/json

{
  "resume": "Alex Morgan...",
  "jobDescription": "We are seeking a Lead Backend Engineer with Go, Kafka, and Kubernetes..."
}
```

---

### 6. Conversational Q&A
```http
POST /api/resume/ask
Content-Type: application/json

{
  "resume": "Alex Morgan...",
  "question": "What is the candidate's strongest quantified metric?"
}
```

---

## 💻 Example cURL Command

Test the SkillBridge analyzer directly from your terminal:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Senior Full-Stack SDE",
    "resumeText": "Alex Morgan\nSoftware Engineer | Full-Stack Developer\nalex.morgan@email.com\n\nEXPERIENCE:\nSoftware Developer | TechCorp Inc. (2023 - Present)\n- Worked on the backend API and made it faster.\n- Responsible for building the user dashboard in React.\n- Fixed bugs and helped test new features before launch."
  }'
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
