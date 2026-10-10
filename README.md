# 📦 Inventory Reservation Frontend

A modern inventory reservation management system built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**.

---

## 🧰 Prerequisites

Before running this project, make sure the following tools are installed on your machine:

### 1. Node.js
- **Version**: `>= 18.x` (LTS recommended)
- Download: [https://nodejs.org](https://nodejs.org)
- Verify installation:
  ```bash
  node --version
  ```

### 2. npm or pnpm
- **npm** comes bundled with Node.js (version `>= 9.x` recommended)
  ```bash
  npm --version
  ```
- *(Optional)* **pnpm** as a faster alternative:
  ```bash
  npm install -g pnpm
  pnpm --version
  ```

### 3. Git
- Download: [https://git-scm.com](https://git-scm.com)
- Verify installation:
  ```bash
  git --version
  ```

---

## 🛠️ Tech Stack

| Technology | Version | Description |
|---|---|---|
| [React](https://react.dev) | `^18.x` | UI library for building user interfaces |
| [Vite](https://vitejs.dev) | `^5.x` | Next-generation frontend build tool |
| [TypeScript](https://www.typescriptlang.org) | `^5.x` | Typed superset of JavaScript |
| [Tailwind CSS](https://tailwindcss.com) | `^3.x` | Utility-first CSS framework |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd inventory-reservation-frontend
```

### 2. Install Dependencies

Using **npm**:
```bash
npm install
```

Or using **pnpm**:
```bash
pnpm install
```

### 3. Configure Environment Variables

Copy the example environment file and adjust the values as needed:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

> **Note:** All environment variables in Vite must be prefixed with `VITE_` to be exposed to the client.

---

## ▶️ Running the Application

### Development Mode

Starts the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Or with pnpm:
```bash
pnpm dev
```

The app will be available at: **[http://localhost:5173](http://localhost:5173)**

---

### Build for Production

Compiles TypeScript and bundles the app for production:

```bash
npm run build
```

Output will be in the `dist/` directory.

---

### Preview Production Build

Serves the production build locally to verify before deployment:

```bash
npm run preview
```

---

### Type Checking

Run TypeScript type checking without emitting files:

```bash
npm run typecheck
```

Or (if using `tsc` directly):
```bash
npx tsc --noEmit
```

---

### Linting

Check code quality with ESLint:

```bash
npm run lint
```

---

## 📁 Project Structure

```
inventory-reservation-frontend/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, icons, fonts
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page-level components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service functions
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility/helper functions
│   ├── App.tsx           # Root application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles (Tailwind directives)
├── .env                  # Environment variables (gitignored)
├── .env.example          # Environment variables template
├── index.html            # HTML entry point
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Project metadata and scripts
```

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| Development | `npm run dev` | Start dev server with HMR |
| Build | `npm run build` | Build for production |
| Preview | `npm run preview` | Preview production build |
| Lint | `npm run lint` | Run ESLint |
| Type Check | `npm run typecheck` | Run TypeScript compiler check |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
