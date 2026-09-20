# Fixzy — Find the Friction. Fix the Experience.

Fixzy is an AI-powered behavioral diagnosis layer for digital products. Rather than presenting generic surface analytics (pageviews, bounce rates, clicks), Fixzy observes real user interaction kinematics, detects meaningful UX friction, compares successful and struggling journeys, explains likely root causes using behavioral evidence, and recommends what teams should fix next.

## Core Paradigm: Observe → Detect → Diagnose → Recommend → Validate

1. **Observe**: Captures micro-kinetics (cursor curvature, hesitation dwell, rapid retry cadence, dead clicks) without capturing sensitive PII.
2. **Detect**: Automatically identifies 8 core friction patterns (rage clicks, validation errors, excessive retries, backtracking, cognitive stalls, dead clicks, abandoned journeys).
3. **Diagnose**: Formulates behavioral root-cause hypotheses grounded in empirical disparities between successful and struggling user cohorts.
4. **Recommend**: Prescribes specific code interventions, form state caching, and UI adjustments.
5. **Validate**: Deploys controlled experiments and measures statistical lift in task completion and friction reduction.

---

## Required Features Implemented

- **Landing Page**: Modern SaaS aesthetic, hero section with tagline *"Find the Friction. Fix the Experience."*, 5-stage interactive diagnostic loop explainer, architectural comparison vs traditional analytics, and CTA to launch dashboard.
- **Dashboard Shell**: Persistent dark-mode sidebar with badge indicators, target application scope, and real-time diagnosis engine telemetry status.
- **Overview**: Overall Friction Score meter (68/100 Elevated), Abandonment Rate, Average Task Time, Error Rate, Rage Clicks, Sessions Analyzed, Session Behavioral Health distribution, and Funnel Stage progression summary.
- **Friction Issues**: Filterable and searchable catalog with 8 detected patterns (repeated clicks, rage clicks, dead clicks, excessive retries, long hesitation, validation errors, backtracking, abandoned journeys). Each issue displays friction score, affected users, behavioral evidence, severity, and status.
- **AI Diagnosis**: Detailed root-cause investigation module with empirical evidence comparison (e.g. Checkout Step 2 address desync: 18s vs 74s task time, 1.1 vs 3.7 shipping visits, 4% vs 61% errors), likely hypothesis (94% confidence), estimated impact, recommended fix, and ready-to-launch validation experiment.
- **User Journeys**: Interactive 8-step pipeline visualizer (`Landing → Login → Product → Cart → Checkout → Shipping → Payment → Success`) with critical friction hotspots highlighted at Shipping and Payment.
- **Successful vs Struggling**: Side-by-side behavioral matrix contrasting task completion time, page revisits, validation error rate, retry count, backtracking rate, click dispersion, and hesitation dwell.
- **Human vs AI-Agent**: Probabilistic classification separating organic human traffic from automated bots and AI scrapers with behavioral kinetic signals (cursor curvature, cadence jitter, scroll velocity, focus sequencing) and clear non-deterministic disclaimers.
- **Trends**: Interactive 14-day time-series SVG chart for Friction Rate, Abandonment Rate, Conversion Rate, Average Task Time, Error Rate, and Rage Clicks with milestone deployment markers.
- **Experiments**: Continuous diagnostic loop (`Problem Detected → Recommended Intervention → Experiment → Measure Outcome`) with active and completed A/B experiment cards.
- **Privacy**: Privacy-by-design policy, 5 zero-capture categories (passwords, cards, keystrokes, SSNs, PII), and an interactive client-side DOM masking sandbox.

---

## AWS Backend Readiness

Fixzy is structured with an API service layer (`src/services/api.js`) ready to integrate with your existing AWS infrastructure:
- **API Gateway**: `POST /events`
- **Lambda**: `FixzyEventIngestor`
- **DynamoDB**: `FixzyEvents`

To connect to your live AWS API Gateway:
1. Create a `.env` file (copied from `.env.example`).
2. Set `VITE_FIXZY_API_ENDPOINT=https://<your-api-id>.execute-api.<region>.amazonaws.com/<stage>`.
3. Fixzy will automatically stream real-time sanitized behavioral telemetry to your API Gateway.

---

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Run production build
npm run build

# Run linter
npm run lint
```
