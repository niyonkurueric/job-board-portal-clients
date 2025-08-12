# Job Board Clients

A modern job board dashboard built with React, Redux, and TypeScript. This project provides both admin and job interfaces, analytics, and job management features.

## Features

- **Admin Dashboard:** Manage jobs, view analytics, and track applications.
- **Job board Portal:** Discover jobs, manage applications, and explore opportunities.
- **Responsive UI:** Optimized for desktop and mobile.
- **Analytics:** Visual charts for admin users.
- **Authentication:** Role-based access (admin/job seeker).

## Tech Stack

- **React** (UI library)
- **Redux Toolkit** (state management)
- **TypeScript** (type safety)
- **React Router** (routing)
- **Tailwind CSS** (styling)
- **Lucide Icons** (icon set)
- **Jest** (testing)

## Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- (Optional) **VS Code** for best development experience

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/job-board-clients.git
   cd job-board-clients
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Project

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Open in browser:**
   Visit [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal).

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Project Structure

```
src/
  components/         # React components
    dashboard/        # Dashboard UI
    ui/               # Reusable UI components
  store/              # Redux store and slices
  api/                # API calls
  App.tsx             # Main app entry
  index.tsx           # React DOM entry
public/               # Static assets
```

## Environment Variables

Create a `.env` file for API endpoints and secrets:

```
REACT_APP_API_URL=https://your-api-url.com
```

## Tools & Extensions

- **VS Code Extensions:**
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
- **Browser DevTools** for debugging

## Troubleshooting

- If you see errors about missing dependencies, run `npm install` again.
- For port conflicts, change the port in `package.json` or `.env`.

## screen shoots
<img width="1437" height="900" alt="Screenshot 2025-08-12 at 17 13 09" src="https://github.com/user-attachments/assets/3770a5b0-519e-420b-bfe0-2758fb53a26d" />
<img width="1434" height="897" alt="Screenshot 2025-08-12 at 17 12 57" src="https://github.com/user-attachments/assets/c1ec3ac8-75d2-4650-b911-8ce3953f4816" />


1. Fork the repo
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push to branch (`git push origin feature/my-feature`)
5. Open a Pull Request
