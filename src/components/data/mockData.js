// Fixzy Realistic Behavioral Diagnostic Mock Data
// Structured to easily map to AWS API Gateway (POST /events -> Lambda FixzyEventIngestor -> DynamoDB)

export const overviewMetrics = {
  overallFrictionScore: 68, // 0-100 (Higher = more friction)
  frictionStatus: "Elevated Friction",
  abandonmentRate: 34.2,
  abandonmentRateChange: -2.4, // delta vs last week
  avgTaskTime: "2m 14s",
  avgTaskTimeSeconds: 134,
  avgTaskTimeChange: "+18s",
  errorRate: 8.4,
  errorRateChange: "+1.2%",
  rageClicks: 1428,
  rageClicksChange: "-8.5%",
  sessionsAnalyzed: 48290,
  sessionsAnalyzedChange: "+14.3%",
  
  // Distribution of session quality
  healthDistribution: [
    { label: "Friction-Free", percentage: 54, count: 26076, color: "#10b981" },
    { label: "Mild Hesitation", percentage: 28, count: 13521, color: "#f59e0b" },
    { label: "Severe Obstacles", percentage: 18, count: 8693, color: "#ef4444" },
  ],

  funnelSummary: [
    { stage: "Discovery", completion: "94%", drop: "6%", friction: "Low" },
    { stage: "Selection", completion: "81%", drop: "13%", friction: "Moderate" },
    { stage: "Checkout Setup", completion: "62%", drop: "19%", friction: "High" },
    { stage: "Payment/Shipping", completion: "42%", drop: "20%", friction: "Critical" },
    { stage: "Confirmation", completion: "38%", drop: "4%", friction: "Low" }
  ]
};

export const frictionIssues = [
  {
    id: "FRIC-01",
    type: "Rage clicks",
    title: "Payment Authorization Button Stalls",
    page: "/checkout/payment",
    element: "button#submit-payment",
    frictionScore: 92,
    severity: "Critical",
    affectedUsers: 1890,
    impactValue: "$84,200 / wk",
    status: "Investigating",
    evidence: "Average of 7.8 rapid clicks (cadence < 180ms) per user when payment tokenization iframe hangs.",
    detectedAgo: "2 hours ago",
    category: "Payment",
    metrics: {
      avgClicksInWindow: 7.8,
      abandonmentFollowing: "71%",
      avgFreezeDuration: "4.2s"
    }
  },
  {
    id: "FRIC-02",
    type: "Validation errors",
    title: "Silent Address Re-render on Zip Mismatch",
    page: "/checkout/shipping",
    element: "input#postal-code",
    frictionScore: 88,
    severity: "Critical",
    affectedUsers: 3420,
    impactValue: "$126,500 / wk",
    status: "Investigating",
    evidence: "Form state silently resets upon asynchronous tax recalculation failure with zero inline prompt.",
    detectedAgo: "4 hours ago",
    category: "Forms",
    metrics: {
      avgRetries: 3.7,
      abandonmentFollowing: "64%",
      errorRate: "61%"
    }
  },
  {
    id: "FRIC-03",
    type: "Excessive retries",
    title: "Password Rule Feedback Delay",
    page: "/auth/signup",
    element: "input#password",
    frictionScore: 81,
    severity: "High",
    affectedUsers: 5320,
    impactValue: "2,400 dropoffs",
    status: "In Progress",
    evidence: "Complexity criteria (symbol + uppercase) only validated on submit instead of inline keystroke blur.",
    detectedAgo: "1 day ago",
    category: "Auth",
    metrics: {
      avgRetries: 3.2,
      abandonmentFollowing: "44%",
      avgHesitation: "28s"
    }
  },
  {
    id: "FRIC-04",
    type: "Backtracking",
    title: "Shipping Fee Surprise Triggers Cart Return",
    page: "/checkout/shipping",
    element: "button#back-to-cart",
    frictionScore: 76,
    severity: "High",
    affectedUsers: 2940,
    impactValue: "$52,000 / wk",
    status: "In Progress",
    evidence: "42% of users navigate back to cart to edit quantities after unexpected threshold shipping rate is revealed.",
    detectedAgo: "2 days ago",
    category: "Navigation",
    metrics: {
      revisitCount: 3.1,
      abandonmentFollowing: "38%",
      dwellShift: "+32s"
    }
  },
  {
    id: "FRIC-05",
    type: "Repeated clicks",
    title: "Non-responsive Promo Code Apply Button",
    page: "/cart",
    element: "button#apply-promo",
    frictionScore: 74,
    severity: "High",
    affectedUsers: 2410,
    impactValue: "$31,400 / wk",
    status: "Triaged",
    evidence: "Users click 3-5 times while loading spinner is delayed or hidden behind input focus ring.",
    detectedAgo: "2 days ago",
    category: "Cart",
    metrics: {
      avgClicksInWindow: 4.3,
      abandonmentFollowing: "29%",
      spinnerLatency: "1.4s"
    }
  },
  {
    id: "FRIC-06",
    type: "Long hesitation",
    title: "Tier Comparison Feature Matrix Cognitive Stall",
    page: "/pricing",
    element: "table.pricing-comparison",
    frictionScore: 68,
    severity: "Medium",
    affectedUsers: 6800,
    impactValue: "High funnel leak",
    status: "Backlog",
    evidence: "54s dwell time with continuous erratic cursor oscillation between Enterprise and Pro columns.",
    detectedAgo: "3 days ago",
    category: "Pricing",
    metrics: {
      avgHesitation: "54s",
      abandonmentFollowing: "51%",
      scrollReversal: "5.4x"
    }
  },
  {
    id: "FRIC-07",
    type: "Dead clicks",
    title: "Unlinked Pricing Breakdown Subtotal Row",
    page: "/checkout/review",
    element: "div.subtotal-tax-row",
    frictionScore: 54,
    severity: "Medium",
    affectedUsers: 4110,
    impactValue: "User confusion",
    status: "Triaged",
    evidence: "Users tap static tax tooltip chevron expecting an explanatory popover, generating zero DOM events.",
    detectedAgo: "4 days ago",
    category: "Checkout",
    metrics: {
      deadClickRate: "78%",
      abandonmentFollowing: "14%",
      dwellShift: "+12s"
    }
  },
  {
    id: "FRIC-08",
    type: "Abandoned journeys",
    title: "Mandatory Account Wall Before Guest Summary",
    page: "/checkout/auth-gate",
    element: "div#modal-auth-gate",
    frictionScore: 89,
    severity: "Critical",
    affectedUsers: 4750,
    impactValue: "$115,000 / wk",
    status: "Investigating",
    evidence: "68% immediate session termination within 3 seconds of auth modal blocking guest progress.",
    detectedAgo: "5 days ago",
    category: "Auth",
    metrics: {
      dropoffRate: "68%",
      timeToExit: "2.8s",
      tabCloseRate: "82%"
    }
  }
];

export const aiDiagnosisCases = [
  {
    id: "DIAG-CHECKOUT",
    issueName: "Checkout Abandonment Spike",
    location: "Checkout Step 2 (Shipping & Tax Calculation)",
    confidence: 94,
    impact: "$184,000 estimated monthly ARR loss • 3,840 users blocked",
    severity: "Critical",
    status: "High Priority Remediation",
    
    // Core behavioral contrast as specified in requirements
    behavioralEvidence: {
      taskTime: {
        successful: "18 sec",
        struggling: "74 sec",
        delta: "+311% time spent",
        isNegative: true
      },
      shippingVisits: {
        successful: "1.1 visits",
        struggling: "3.7 visits",
        delta: "+236% loops / revisits",
        isNegative: true
      },
      validationErrors: {
        successful: "4%",
        struggling: "61%",
        delta: "+57% error surge",
        isNegative: true
      },
      rageClicks: {
        successful: "0.02 / session",
        struggling: "3.84 / session",
        delta: "192x increase",
        isNegative: true
      },
      backtrackingRate: {
        successful: "3%",
        struggling: "48%",
        delta: "16x backtracking",
        isNegative: true
      }
    },

    likelyRootCause: "Asynchronous tax rate calculation failure causes the checkout address component to re-render silently, clearing the postal code without rendering an inline field alert. Users repeatedly click 'Continue to Payment' without realizing the form state has been wiped.",

    supportingEvidenceBullets: [
      "83% of struggling sessions experience an unresolved 422 Unprocessable Entity payload from the tax service.",
      "Users re-enter the shipping form 3.7 times on average, repeatedly retyping their address.",
      "The submit button is clicked an average of 4.2 times while in a disabled state during re-render.",
      "Cursor trajectory shows intense cluster concentration over the disabled CTA followed by sharp back-navigation to Cart."
    ],

    recommendedFix: "1. Preserve address input state in client storage during tax calculation retries.\n2. Add an explicit inline banner: 'Unable to verify postal code for tax rates. Please confirm zip code.'\n3. Provide immediate non-blocking fallback flat-rate estimation rather than halting the checkout pipeline.",

    suggestedExperiment: {
      id: "EXP-104",
      name: "Resilient Address State & Non-blocking Tax Fallback",
      hypothesis: "Retaining user address input during tax API micro-outages and rendering inline field hints will reduce checkout loop revisits from 3.7 to 1.2 and recover 45% of abandoned carts.",
      primaryMetric: "Shipping-to-Payment Progression Rate",
      targetLift: "+18.5%",
      sampleSizeNeeded: "12,000 sessions",
      estimatedDuration: "6 days",
      controlVsVariant: {
        control: "Existing sync form reload on tax error",
        variantA: "Optimistic form preservation with inline warning badge"
      }
    }
  },
  {
    id: "DIAG-AUTH",
    issueName: "Signup Conversion Leak at Password Policy",
    location: "User Registration / Password Step",
    confidence: 89,
    impact: "2,400 signups lost / month • 44% bounce on password field",
    severity: "High",
    status: "Recommendation Ready",
    
    behavioralEvidence: {
      taskTime: {
        successful: "12 sec",
        struggling: "56 sec",
        delta: "+366% time spent",
        isNegative: true
      },
      shippingVisits: {
        successful: "1.0 step",
        struggling: "2.9 submissions",
        delta: "Nearly 3 attempts",
        isNegative: true
      },
      validationErrors: {
        successful: "2%",
        struggling: "74%",
        delta: "+72% error spike",
        isNegative: true
      },
      rageClicks: {
        successful: "0.01 / session",
        struggling: "2.1 / session",
        delta: "High frustration",
        isNegative: true
      },
      backtrackingRate: {
        successful: "1%",
        struggling: "22%",
        delta: "Leaving registration",
        isNegative: true
      }
    },

    likelyRootCause: "Strict password rules (minimum 12 chars, 1 uppercase, 1 symbol) are hidden until the user clicks 'Create Account'. Users hit submit prematurely, encounter a generic red toast, and repeatedly guess requirements.",

    supportingEvidenceBullets: [
      "91% of failed attempts violate the symbol requirement, which is not mentioned in placeholder text.",
      "Users exhibit 24s average hesitation before attempting a second submission.",
      "62% of users abandon the page on the second validation error toast."
    ],

    recommendedFix: "Implement real-time inline checklist checklist indicators below the password input that turn green dynamically as requirements are met.",

    suggestedExperiment: {
      id: "EXP-105",
      name: "Interactive Dynamic Password Requirements Checklist",
      hypothesis: "Visualizing requirements inline as the user types will eliminate blind guess submissions and elevate signup completion by 14%.",
      primaryMetric: "Account Creation Success Rate",
      targetLift: "+14.0%",
      sampleSizeNeeded: "8,000 sessions",
      estimatedDuration: "4 days",
      controlVsVariant: {
        control: "Post-submit error notification",
        variantA: "Real-time reactive password strength criteria checklist"
      }
    }
  }
];

export const userJourneySteps = [
  {
    id: "step-1",
    name: "Landing",
    path: "/",
    visitors: 100,
    dropoff: "6%",
    frictionScore: 12,
    avgTime: "14s",
    status: "smooth",
    frictionSymptom: "Fast entry, natural scroll flow"
  },
  {
    id: "step-2",
    name: "Login / Auth",
    path: "/auth",
    visitors: 94,
    dropoff: "8%",
    frictionScore: 28,
    avgTime: "22s",
    status: "smooth",
    frictionSymptom: "Minor password resets"
  },
  {
    id: "step-3",
    name: "Product Browse",
    path: "/products",
    visitors: 86,
    dropoff: "12%",
    frictionScore: 35,
    avgTime: "45s",
    status: "mild",
    frictionSymptom: "Filter hesitation on mobile viewports"
  },
  {
    id: "step-4",
    name: "Cart",
    path: "/cart",
    visitors: 74,
    dropoff: "9%",
    frictionScore: 42,
    avgTime: "28s",
    status: "mild",
    frictionSymptom: "Promo code repeated clicks"
  },
  {
    id: "step-5",
    name: "Checkout",
    path: "/checkout",
    visitors: 65,
    dropoff: "14%",
    frictionScore: 58,
    avgTime: "36s",
    status: "warning",
    frictionSymptom: "Guest vs Login decision stall"
  },
  {
    id: "step-6",
    name: "Shipping",
    path: "/checkout/shipping",
    visitors: 51,
    dropoff: "22%",
    frictionScore: 88,
    avgTime: "74s",
    status: "critical",
    frictionSymptom: "3.7 revisits, tax reload silent wiping, loop friction"
  },
  {
    id: "step-7",
    name: "Payment",
    path: "/checkout/payment",
    visitors: 29,
    dropoff: "18%",
    frictionScore: 84,
    avgTime: "68s",
    status: "critical",
    frictionSymptom: "Rage clicks on disabled submit, 3D Secure freeze"
  },
  {
    id: "step-8",
    name: "Success / Order Placed",
    path: "/checkout/success",
    visitors: 11,
    dropoff: "0%",
    frictionScore: 8,
    avgTime: "12s",
    status: "smooth",
    frictionSymptom: "High satisfaction confirmation"
  }
];

export const cohortComparisonData = {
  summary: {
    successfulSessions: 32840,
    strugglingSessions: 15450,
    avgDeltaMinutes: "2.4m slower for struggling",
    conversionLeakPercentage: "32.0%"
  },
  metrics: [
    {
      name: "Task Completion Time",
      successful: "18 sec",
      struggling: "74 sec",
      unit: "time",
      delta: "+311%",
      isStrugglingWorse: true,
      description: "Duration from entering step to successful submission"
    },
    {
      name: "Page Revisits & Loops",
      successful: "1.1 visits",
      struggling: "3.7 visits",
      unit: "count",
      delta: "+236%",
      isStrugglingWorse: true,
      description: "Oscillation between steps without forward progress"
    },
    {
      name: "Input Validation Errors",
      successful: "4.2%",
      struggling: "61.3%",
      unit: "percent",
      delta: "+57.1%",
      isStrugglingWorse: true,
      description: "Triggered form errors or API rejection toasts"
    },
    {
      name: "Retry Count",
      successful: "0.3 times",
      struggling: "4.8 times",
      unit: "count",
      delta: "16x higher",
      isStrugglingWorse: true,
      description: "Repeated button presses or input alterations"
    },
    {
      name: "Backtracking Rate",
      successful: "2.8%",
      struggling: "46.2%",
      unit: "percent",
      delta: "+43.4%",
      isStrugglingWorse: true,
      description: "Navigating back to previous steps in funnel"
    },
    {
      name: "Click Behavior",
      successful: "Direct / Purposeful (96% target hit)",
      struggling: "Erratic / Clustered (Dead & Rage Clicks)",
      unit: "behavior",
      delta: "Cluster dispersion",
      isStrugglingWorse: true,
      description: "Spatial and temporal dispersion of user mouse/touch events"
    },
    {
      name: "Average Hesitation Dwell",
      successful: "3.2 sec",
      struggling: "24.6 sec",
      unit: "time",
      delta: "+668%",
      isStrugglingWorse: true,
      description: "Period of zero mouse movement prior to action"
    }
  ]
};

export const humanVsAgentData = {
  classificationSummary: {
    totalSessions: 48290,
    likelyHuman: { count: 37860, percentage: 78.4 },
    likelyAiAgent: { count: 8790, percentage: 18.2 },
    uncertainHybrid: { count: 1640, percentage: 3.4 }
  },
  disclaimer: "Probabilistic classification calculated via client-side kinematic physics, cursor micro-jitter, and synthetic event timing. This is not a deterministic CAPTCHA or blocking firewall.",
  signalFactors: [
    {
      signal: "Cursor Trajectory Curvature",
      humanPattern: "Natural polynomial arcs, Bézier curves with micro-overshoot and organic drift.",
      agentPattern: "Direct linear Euclidean vectors or instant coordinate teleportation without interpolated steps.",
      weight: "32% Impact"
    },
    {
      signal: "Inter-Event Cadence Jitter",
      humanPattern: "Log-normal latency distribution (180ms – 720ms) with cognitive reaction variance.",
      agentPattern: "Isochronous (uniform 10ms or 50ms ticks) or ultra-fast scripted sub-5ms firing bursts.",
      weight: "28% Impact"
    },
    {
      signal: "Scroll Velocity & Deceleration",
      humanPattern: "Inertial momentum with organic finger release decay and visual scanning pauses.",
      agentPattern: "Discrete instantaneous jump scrolls to absolute target offsets without viewport dwell.",
      weight: "22% Impact"
    },
    {
      signal: "Focus / Blur Sequencing",
      humanPattern: "Pointer hover precedes focus; realistic field tab order with occasional typos.",
      agentPattern: "Headless synthetic dispatch: focus event without prior hover, programmatic value insertion.",
      weight: "18% Impact"
    }
  ],
  sampleSessions: [
    {
      sessionId: "sess_9821_live",
      timestamp: "12 seconds ago",
      classification: "Likely Human",
      confidence: 96,
      device: "macOS • Chrome 128",
      evidence: "Organic Bézier cursor velocity (avg curvature 0.74), 420ms typing cadence, natural scrolling decay.",
      journey: "Landing → Product → Cart",
      indicators: ["Natural drift", "Variable jitter", "Physical momentum"]
    },
    {
      sessionId: "sess_4410_bot",
      timestamp: "45 seconds ago",
      classification: "Likely AI Agent",
      confidence: 94,
      device: "Linux • HeadlessChrome 127",
      evidence: "Perfect rectilinear mouse moves (0 curvature), uniform 16.6ms frame step cadences, zero dwell on pricing comparison.",
      journey: "Catalog API scraping loop (14 products in 1.8s)",
      indicators: ["Zero curvature", "Deterministic cadence", "Instantaneous jumps"]
    },
    {
      sessionId: "sess_7712_agent",
      timestamp: "3 minutes ago",
      classification: "Likely AI Agent",
      confidence: 88,
      device: "Windows • Python / Playwright",
      evidence: "Programmatic value assignments into form inputs bypassing synthetic keystroke buffers, 0 mouse hover preceding click.",
      journey: "Checkout Step 1 → Step 2 (Automated Test / Agent Checkout)",
      indicators: ["Synthetic dispatch", "Missing hover triggers", "Fixed pause timers"]
    },
    {
      sessionId: "sess_1204_hum",
      timestamp: "5 minutes ago",
      classification: "Likely Human",
      confidence: 92,
      device: "iOS 18 • Safari Mobile",
      evidence: "Touch tap jitter, 2 orientation scrolls, hesitation dwell at payment card field.",
      journey: "Product → Cart → Checkout → Success",
      indicators: ["Physical touch radii", "Micro-hesitation", "Kinetic touch decay"]
    }
  ]
};

export const trendsData = {
  timeSeries: [
    { date: "Day 1", frictionRate: 42, abandonmentRate: 28, conversionRate: 3.8, avgTaskTime: 110, errorRate: 5.2, rageClicks: 420 },
    { date: "Day 2", frictionRate: 45, abandonmentRate: 29, conversionRate: 3.6, avgTaskTime: 114, errorRate: 5.8, rageClicks: 460 },
    { date: "Day 3", frictionRate: 48, abandonmentRate: 31, conversionRate: 3.5, avgTaskTime: 118, errorRate: 6.1, rageClicks: 510 },
    { date: "Day 4", frictionRate: 72, abandonmentRate: 39, conversionRate: 2.8, avgTaskTime: 142, errorRate: 9.8, rageClicks: 1180, eventTag: "Tax API v2 Deployment" },
    { date: "Day 5", frictionRate: 78, abandonmentRate: 42, conversionRate: 2.4, avgTaskTime: 154, errorRate: 11.2, rageClicks: 1520 },
    { date: "Day 6", frictionRate: 74, abandonmentRate: 38, conversionRate: 2.6, avgTaskTime: 146, errorRate: 10.4, rageClicks: 1390 },
    { date: "Day 7", frictionRate: 71, abandonmentRate: 37, conversionRate: 2.7, avgTaskTime: 140, errorRate: 9.6, rageClicks: 1280 },
    { date: "Day 8", frictionRate: 68, abandonmentRate: 35, conversionRate: 2.9, avgTaskTime: 136, errorRate: 8.9, rageClicks: 1140 },
    { date: "Day 9", frictionRate: 52, abandonmentRate: 30, conversionRate: 3.4, avgTaskTime: 122, errorRate: 6.7, rageClicks: 680, eventTag: "Fixzy EXP-104 Live" },
    { date: "Day 10", frictionRate: 46, abandonmentRate: 27, conversionRate: 3.7, avgTaskTime: 112, errorRate: 5.9, rageClicks: 520 },
    { date: "Day 11", frictionRate: 41, abandonmentRate: 25, conversionRate: 3.9, avgTaskTime: 104, errorRate: 5.1, rageClicks: 440 },
    { date: "Day 12", frictionRate: 38, abandonmentRate: 23, conversionRate: 4.1, avgTaskTime: 98, errorRate: 4.6, rageClicks: 380 },
    { date: "Day 13", frictionRate: 36, abandonmentRate: 22, conversionRate: 4.2, avgTaskTime: 94, errorRate: 4.2, rageClicks: 340 },
    { date: "Day 14", frictionRate: 34, abandonmentRate: 21, conversionRate: 4.4, avgTaskTime: 90, errorRate: 3.9, rageClicks: 310 }
  ]
};

export const experimentsData = {
  diagnosticLoopStages: [
    {
      stage: "Observe",
      icon: "eye",
      title: "Real-time Interaction Stream",
      description: "Passive behavioral capture logs mouse kinematics, form retries, dwell pauses, and DOM error responses without touching PII."
    },
    {
      stage: "Detect",
      icon: "radar",
      title: "Friction Pattern Detection",
      description: "Automated anomaly clustering flags rage clicks, repeated inputs, dead zones, and funnel backtracking loops."
    },
    {
      stage: "Diagnose",
      icon: "brain",
      title: "AI Behavioral Root-Cause",
      description: "Correlates telemetry discrepancies between successful and struggling cohorts to isolate technical & UX failure causes."
    },
    {
      stage: "Recommend",
      icon: "sparkles",
      title: "Targeted Interventions",
      description: "Generates actionable code & UI modifications accompanied by pre-configured A/B test hypotheses."
    },
    {
      stage: "Validate",
      icon: "check-circle",
      title: "Closed-Loop Experimentation",
      description: "Tracks statistical lift in completion rates, reduction in friction scores, and verified ARR recovery."
    }
  ],
  experiments: [
    {
      id: "EXP-104",
      title: "Address Auto-complete with Resilient Form State",
      status: "Active",
      linkedIssue: "FRIC-02: Silent Address Re-render on Zip Mismatch",
      hypothesis: "Persisting address input state across async tax recalculation retries will prevent silent field wipes.",
      variantDistribution: "50% Control / 50% Variant A",
      sampleProgress: 68, // % of target reached
      currentLift: "+18.4% Completion",
      frictionReduction: "-34 pts (88 -> 54)",
      confidence: "98.2% Statistically Significant",
      outcome: "Trending Positive"
    },
    {
      id: "EXP-102",
      title: "Sticky Mobile Checkout CTA with Instant Visual Feedback",
      status: "Completed",
      linkedIssue: "FRIC-01: Payment Authorization Button Stalls",
      hypothesis: "Providing an instant micro-spinner on tap and persistent button visibility reduces blind repeated clicks.",
      variantDistribution: "100% Rolled Out to Production",
      sampleProgress: 100,
      currentLift: "+12.6% Checkout Conversion",
      frictionReduction: "-48 pts (92 -> 44)",
      confidence: "99.4% Statistically Significant",
      outcome: "Winner Adopted"
    },
    {
      id: "EXP-105",
      title: "Inline Dynamic Password Criteria vs Toast Alert",
      status: "Queued",
      linkedIssue: "FRIC-03: Password Rule Feedback Delay",
      hypothesis: "Rendering visual green checkmarks as the user types will remove repeated signup submission cycles.",
      variantDistribution: "Scheduled for deploy tomorrow",
      sampleProgress: 0,
      currentLift: "Projected +14%",
      frictionReduction: "Projected -38 pts",
      confidence: "Pending Traffic",
      outcome: "Ready to Launch"
    }
  ]
};

export const privacyConfig = {
  title: "Privacy by Design Architecture",
  tagline: "Fixzy analyzes how users interact with your software — never the sensitive data they type.",
  forbiddenDataTypes: [
    {
      category: "Passwords & PINs",
      action: "Strictly Excluded at DOM Level",
      description: "All input elements of type='password' or containing 'pin' are automatically stripped before client event serialization.",
      status: "Zero Capture"
    },
    {
      category: "Credit Cards & Financial Telemetry",
      action: "Masked & Regex Filtered",
      description: "Luhn-matching 13-19 digit number sequences and CVV selectors are sanitized into placeholder lengths only.",
      status: "Zero Capture"
    },
    {
      category: "Raw Form Keystrokes",
      action: "Timing & Frequency Only",
      description: "Fixzy logs inter-key cadence timestamps (e.g. 180ms jitter) for bot detection, never the character ASCII codes.",
      status: "Anonymized"
    },
    {
      category: "Government IDs & SSNs",
      action: "Automated Regex Shield",
      description: "Client-side pipeline blocks patterns matching SSN, tax IDs, and national identification numbers.",
      status: "Zero Capture"
    },
    {
      category: "Unnecessary PII & Personal Data",
      action: "Pseudonymized Tokenization",
      description: "Session tokens are cryptographically hashed; emails and phone numbers are masked into generic format validations.",
      status: "Client Masked"
    }
  ],
  sampleFields: [
    { label: "Credit Card Number", type: "text", initialValue: "4111 2222 3333 4444", maskedType: "card" },
    { label: "Account Password", type: "password", initialValue: "SuperSecretPassword123!", maskedType: "password" },
    { label: "Social Security Number", type: "text", initialValue: "123-45-6789", maskedType: "ssn" },
    { label: "Customer Email Address", type: "email", initialValue: "alex.smith@examplecorp.com", maskedType: "email" }
  ]
};
