# Product Roadmap — Veritas Academy

Veritas Academy is built in five phases, each expanding the platform's intelligence, community, and commercial reach.

---

## Phase 1 — Core MVP

**Goal:** A working, fully functional exam prep platform with gamification.

**Status: ✅ Complete**

### Delivered

| Feature | Details |
|---|---|
| Authentication | OAuth login with JWT session cookies |
| Landing page | Full marketing page with Veritas branding, features, pricing, testimonials |
| Student dashboard | XP bar, level indicator, streak counter, quick-access widgets |
| Course catalog | Browseable courses with difficulty, hours, enrollment |
| Course detail | Module listing with type badges (study guide, flashcard set, quiz) |
| Interactive flashcards | Flip animation, spaced repetition (new / learning / mastered), progress tracking |
| Interactive quizzes | Multiple choice, timer, instant feedback, XP rewards, score summary |
| Study plans | Personalized plan viewer, module checklist, progress percentage |
| Achievements | 14+ achievement badges with XP rewards |
| Quiz results history | Full history with scores and XP earned |
| Admin panel | CRUD for courses, modules, users, orders |
| Full gamification backend | XP, levels, streaks, achievements, XP transaction log |
| Database schema | 16 tables: users, profiles, courses, modules, flashcards, quizzes, enrollments, progress, study plans, streaks, achievements, orders, XP transactions |
| Test suite | Vitest integration tests for all major procedures |

---

## Phase 2 — AI Personalization & Analytics

**Goal:** Make the platform smart — it knows what each student needs next.

**Status: Planned**

### Features

#### Adaptive Learning Engine
- Tracks performance across quizzes and flashcards
- Identifies weak topics and adjusts content recommendations
- Surfaces "review needed" modules based on spaced repetition intervals

#### Smart Study Plan Generator (AI-Powered)
- Student inputs exam date + target score
- AI generates an optimized day-by-day study plan
- Automatically adjusts as student progresses

#### Performance Analytics Dashboard
- Score trends over time (charts)
- Weak topics heatmap
- Study time tracking
- Comparison to platform average

#### Leaderboards
- Weekly XP rankings (global + per course)
- Streak leaderboards
- Achievement leaderboards

#### Enhanced Gamification
- Daily challenges (e.g. "Complete 3 flashcard sets today")
- Weekly missions with bonus XP
- Level-up animations and milestone rewards

---

## Phase 3 — Advanced AI Features

**Goal:** Veritas becomes an AI-powered personal tutor.

**Status: Planned**

### Features

#### Magic Notes
- Student uploads study materials (PDF, Word, text)
- AI automatically generates:
  - Flashcard sets
  - Quiz questions
  - Chapter summaries
  - Key concept highlights
- Saves to their personal content library

#### Veritas AI Tutor
- Chat interface powered by Claude (Anthropic)
- Explains concepts on demand
- Answers exam-style questions with step-by-step reasoning
- Context-aware: knows the student's enrolled courses and weak areas

#### AI-Driven Mock Exams
- Full-length timed mock exams
- Adaptive question selection (harder questions in strong areas, weaker in weak areas)
- Detailed post-exam analysis with explanations

#### Mind Map Creator
- AI generates visual mind maps from course content
- Student can expand / collapse nodes
- Export as PDF or image

---

## Phase 4 — Monetization & Community

**Goal:** Generate sustainable revenue and build a student community.

**Status: Planned**

### Subscription Tiers

| Tier | Price | Features |
|---|---|---|
| Free | $0/mo | 2 courses, basic flashcards, limited quizzes |
| Pro | $9.99/mo | All courses, AI study plans, performance analytics, priority support |
| Premium | $19.99/mo | Everything in Pro + AI Tutor, Magic Notes, mock exams, mind maps |

### Payment Integration

- **Primary:** Paystack + Flutterwave (Africa-first payments)
- **Alternative:** Payoneer (manual processing, already partially in codebase)
- Subscription management: upgrade, downgrade, cancel, billing history

### Collaborative Study Spaces
- Virtual study rooms (groups of 2–10 students)
- Shared flashcard decks
- Group quizzes with real-time leaderboards
- Scheduled group study sessions

### Community Forums
- Course-specific discussion boards
- Q&A with upvoting
- Student-to-student mentorship matching
- Instructor/admin-verified answers

### Certificates
- Auto-generated PDF certificates on course completion
- Shareable on LinkedIn

---

## Phase 5 — Production Launch & Scale

**Goal:** Go live at production scale with full monitoring and marketing.

**Status: Planned**

### Infrastructure
- Production deployment (Railway / Render / AWS)
- PostgreSQL migration (from MySQL dev setup)
- CDN for static assets and uploaded files
- Redis for session caching and rate limiting
- Background job queue (for AI processing, email, etc.)

### Monitoring & Reliability
- Error tracking (Sentry)
- Uptime monitoring
- Database query performance monitoring
- Alerting for critical failures

### Security Hardening
- Rate limiting on auth and API endpoints
- Input sanitization audit
- OWASP Top 10 review
- GDPR compliance (data export, deletion)

### Marketing Launch
- SEO optimization (meta tags, sitemap, structured data)
- Blog with exam tips and study guides
- Email drip campaigns for new signups
- Referral program
- Social media presence

---

## Technical Debt & Improvements (Ongoing)

| Item | Priority |
|---|---|
| Add E2E tests (Playwright) | High |
| CI/CD pipeline (GitHub Actions) | High |
| API rate limiting | Medium |
| Image optimization pipeline | Medium |
| Accessibility audit (WCAG 2.1 AA) | Medium |
| Dark mode completion | Low |
| PWA / offline support | Low |

---

## Version History

| Version | Date | Notes |
|---|---|---|
| 1.0.0 | Feb 2026 | Phase 1 MVP complete |
