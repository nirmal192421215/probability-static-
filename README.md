# EduWise — Student Performance Analytics

**Statistical Analysis and Prediction of Student Academic Performance Using Probability Models**

Transform academic data into statistical insights, probability-based predictions, and actionable student performance recommendations.

## Run with Docker

```bash
docker compose up --build
```

Open [http://localhost](http://localhost)

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Demo accounts

Password for all demo users: `EduWise@123`

| Role | Email |
| --- | --- |
| Administrator | admin@eduwise.local |
| Faculty | faculty@eduwise.local |
| Student | student@eduwise.local |

- Faculty and administrators can add, edit, and delete students.

## Local development (optional)

Backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export MONGO_URI=mongodb://localhost:27017
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:8000`.

## Calculations

All statistics are computed from the MongoDB dataset (sample variance, `ddof=1`).

- Mean, median, mode, range, quartiles, histogram
- Pearson correlation
- Conditional probability `P(A|B) = P(A ∩ B) / P(B)`
- Bayes `P(A|B) = P(B|A)P(A) / P(B)`
- Normal distribution via Z-score and `Φ`
- Binomial `P(X=k) = C(n,k) p^k (1-p)^{n-k}`
- Pass probability via a weighted logistic mapping of attendance, study hours, internals, assignments, and prior GPA (not random)

Forgot-password is a demo endpoint (no email server).
