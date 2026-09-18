# Legal Document Assistant & Navigator

GenAI-powered legal literacy assistant designed to simplify complex legal contracts into plain English, conduct side-by-side agreement comparisons, audit critical contractual risks and predatory clauses, answer grounded legal questions with exact textual citations, and generate actionable consultation packets for attorneys.

---

## Architecture & Capabilities

1. **Document Simplification & Translation Engine**:
   - Multi-tier reading clarity levels: *Executive / Standard*, *Plain English (Grade 8)*, and *Everyday Layperson*.
   - Structured decomposition: Party rights and obligations breakdown, interactive Legal Jargon Glossary with plain-English translations, clause-by-clause translation table, and key numerical numbers/deadlines.

2. **Side-by-Side Contract Comparison Matrix**:
   - Compare two agreements or draft revisions (e.g., Landlord Lease vs Standard Statutory Lease, or NDAs).
   - Side-by-side divergent provisions table with color-coded posture tags (*Favorable*, *Neutral*, *Adverse*).
   - Comparative advantage verdict and detection of omitted protective clauses.

3. **Forensic Risk & Trap Audit**:
   - 0–100 numerical risk exposure score meter with qualitative ratings (*Critical*, *High*, *Moderate*, *Low*).
   - Automated screening for predatory traps: Unilateral modification clauses, automatic renewal/forfeiture traps, mandatory binding arbitration, class action waivers, unlimited indemnification covenants, and non-compete liabilities.
   - Clause-level worst-case scenario analysis paired with recommended counter-language revisions.

4. **Grounded Legal Q&A Navigator**:
   - Real-time Q&A strictly grounded in the uploaded document.
   - Exact textual citations with clause titles, quotes, and practical scenarios (*What the contract says* vs *Recommended action*).
   - Statutory silence detection and follow-up inquiry checklists for licensed counsel.

5. **Attorney Consultation Brief & Pre-Signing Due Diligence**:
   - 60-second executive intake summary for attorneys to reduce billable time.
   - Prioritized legal questions with contextual justifications.
   - Interactive pre-signing verification checklist.
   - Critical notice windows & forfeiture deadlines tracker.
   - Direct export to Markdown, printable PDF/print dialog, or text file.

6. **Smart Dynamic Legal Assistant & Decision Co-Pilot**:
   - Evaluates bargaining leverage tier (*High*, *Balanced*, *Low Adhesion*).
   - Contextual decision logic differentiating non-negotiable dealbreakers vs safe concessions.
   - Generates tailored strategic action plans and ready-to-send counterproposal emails to counterparties with 1-click clipboard copy.

---

## Security & Architectural Standards

### Model Fallback Resilience Ladder
All server-side Gemini API calls are managed through a resilient fallback ladder in `/lib/gemini-resilience.ts`:
- **Primary**: `gemini-3.6-flash`
- **High-Availability Fallback**: `gemini-3.1-flash-lite`
- **Dynamic Alias**: `gemini-flash-latest`
- **Deep Reasoning Fallback**: `gemini-3.7-flash`

Recovers automatically from transient `503 UNAVAILABLE`, `429 RESOURCE_EXHAUSTED`, `404 NOT_FOUND`, and `500 INTERNAL` status codes before returning a clean status to the client.

### Threat Model & Defense Summary
| Threat Zone | Potential Vulnerability | Implemented Countermeasure |
| :--- | :--- | :--- |
| **Input Surfaces** | Malicious document text, prompt injection attempts | Strict schema validation, parameter encapsulation, server-side payload truncation |
| **Planning & Reasoning** | System instruction bypass | Strong system prompts instructing model to operate strictly as an objective analytical assistant |
| **Tool / Execution** | Unauthorized API calls, SSRF | Server-only route handlers with zero exposed client-side keys; no dynamic eval execution |
| **Memory & State** | Cross-user data leakage, session hijacking | Isolated client-side local caching, zero shared in-memory state across requests |
| **Inter-System Communication** | API token leakage | Secrets accessed solely via server-side `process.env.GEMINI_API_KEY` or Secret Manager |

---

## Google Cloud Run Deployment & Campaign Verification

### 1. Prerequisites
- Google Cloud SDK (`gcloud` CLI) installed and authenticated.
- A Google Cloud project with billing enabled.

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

Enable required Google Cloud APIs:
```bash
gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  firestore.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com
```

### 2. Secret Management Setup
Store your Gemini API Key in Google Cloud Secret Manager:

```bash
# Create the secret
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"

# Add the secret version with your key
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# Retrieve your project number
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)")

# Grant the Cloud Run compute service account access to read the secret
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 3. Firestore Security Rules (User Data Isolation)
If enabling persistent user storage, deploy the following owner-bound Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/interactions/{interactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Cloud Run Deployment
Deploy the application container directly to Cloud Run:

```bash
gcloud run deploy legal-document-assistant \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

### 5. Mandatory Campaign Labeling Verification
To register the service for automated challenge verification, attach the required campaign label:

```bash
gcloud run services update legal-document-assistant \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=us-central1
```

---

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. Run linter and build:
   ```bash
   npm run lint
   npm run build
   ```

---

## Legal & Compliance Disclaimer
*Legal Document Assistant & Navigator* is an educational legal literacy and document analysis technology tool. It provides automated text extraction, linguistic simplification, risk identification, and consultation preparation based on user-provided contract text. It does not provide legal advice, does not establish an attorney-client relationship, and is not a substitute for formal representation by a licensed attorney.
