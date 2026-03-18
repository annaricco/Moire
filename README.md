# Moire

A virtual closet app to catalog everything you own.

## Tech Stack

- **Frontend:** Next.js (App Router)
- **Backend:** Next.js API Routes
- **Database:** MongoDB + Mongoose
- **File Storage:** Cloudinary
- **Styling:** Tailwind CSS

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/moire.git
cd moire
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in your keys:

```bash
cp .env.local.example .env.local
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## Roadmap

- [x] Phase 1 — Manual item catalog (add, edit, delete, filter)
- [ ] Phase 2 — Gmail order import via OAuth
