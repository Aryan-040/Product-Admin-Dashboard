# Product Admin Dashboard (CatalogHub)

A modern, responsive, production-ready **Product Admin Dashboard** built with **Next.js (App Router)**, **React**, **Tailwind CSS**, and **Axios**, using the free **DummyJSON API** (`https://dummyjson.com`).

---

## 🚀 Getting Started & Setup Steps

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation & Local Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Aryan-040/Product-Admin-Dashboard.git
   cd Product-Admin-Dashboard
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Open Application in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🔑 Demo Credentials

| Role | Username | Password |
|---|---|---|
| **Admin User** | `emilys` | `emilyspass` |

---

## 🌐 Live Deployment Instructions (Vercel & Netlify)

### Deploying to Vercel (Recommended)
1. Push this repository to your GitHub account (`https://github.com/Aryan-040/Product-Admin-Dashboard`).
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `Product-Admin-Dashboard` repository.
4. Leave build settings as default (`npm run build`, output `.next`).
5. Click **Deploy**.

---

## ✅ Completed Features Checklist

- [x] **Shared Axios Client (`lib/axios.ts`)**: Single centralized instance adding `Authorization: Bearer <token>` to requests and handling `401 Unauthorized` token expiry globally.
- [x] **Login Page (`/login`)**: Authenticates via `POST /auth/login`, handles errors for invalid credentials, double-click submission prevention, and quick-fill helper button.
- [x] **Protected Routes**: `/products` and `/products/[id]` automatically redirect unauthenticated users to `/login`.
- [x] **Responsive Product List**: Desktop table view + Mobile card view showing image, title, category, price, rating, stock status, and actions.
- [x] **Custom Pagination**: Page numbers, Previous/Next buttons, page size selector (10, 20, 50 items), and text like `"Showing 21–40 of 194"`.
- [x] **Debounced Search**: Search with `/products/search?q=...` with a 400ms debounce. Automatically resets to page 1 on query change.
- [x] **Filter & Sort**: Category filter dropdown dynamically loaded from `/products/categories`, and sorting by price, rating, or title.
- [x] **URL State Synchronization**: `page`, `limit`, `q`, `category`, `sortBy`, `order`, and `delay` are stored in URL query parameters. Refreshing or sharing link yields identical view state.
- [x] **URL Param Sanitization**: Handles invalid URL parameters like `?page=abc` or `?page=99999` safely without crashing.
- [x] **Race Condition Prevention & Delay Simulator**: Built using Axios `AbortController` and request ID versioning to ensure out-of-order or delayed API responses (`&delay=2000`) never overwrite newer search results. Includes a built-in **"Simulate Delay"** toggle button in the filters bar for easy testing!
- [x] **Product Details Page (`/products/[id]`)**: Detailed view with gallery thumbnails, price, stock status, specs, customer reviews, and a 404 screen for invalid IDs.
- [x] **Add, Edit & Delete**: Form modal with validation (title, price, stock, category), delete confirmation modal, and client overlay store so mutations persist locally.
- [x] **Loading, Empty & Error States**: Skeleton loaders for tables/cards, clear empty state graphics when no products match, and a Retry button for failed API requests.

---

## 📐 Choices, Challenges & AI Disclosure

### 1. Architectural & Technical Choices

- **Next.js App Router & TypeScript**: Provides server/client component boundaries, strict type safety, and clean file-system routing.
- **Client Overlay Store for Static Mock API**: DummyJSON API does not persist `POST`, `PUT`, or `DELETE` requests on its backend. To provide a true full-stack user experience, we built `ProductOverlayContext` (persisted in `localStorage`). Newly added items, edits, and deletions overlay on top of API queries seamlessly across page reloads and navigations.
- **Axios over Fetch**: Utilized Axios interceptors for automatic JWT token injection and centralized error handling as required by rules.

### 2. Search + Category Conflict Strategy

- **Constraint**: The DummyJSON API does not natively support combining search queries (`/products/search?q=...`) and category filters (`/products/category/...`) in a single query parameter.
- **Solution Strategy**: When both a search query `q` and a `category` filter are selected simultaneously, the application queries the search endpoint `/products/search?q=...` and performs client-side filtering on the returned results by category. This ensures smooth UX without API errors.

### 3. One Problem Faced & How It Was Solved

- **Problem (Race Conditions on Rapid Typing)**: When a user typed quickly in the search input, multiple fast API calls were fired. Slower network responses for earlier keystrokes could arrive after faster responses for later keystrokes, displaying outdated search results (e.g. tested with `&delay=2000`).
- **Solution**: Implemented an Axios `AbortController` signal paired with a request versioning counter (`requestIdRef`). Whenever the search query changes, any pending request is immediately cancelled via `controller.abort()`, and outdated responses are discarded.

### 4. Where AI Helped

- **Design & UI Polish**: AI assisted in generating harmonious dark-mode color tokens, tailwind layouts, skeleton loaders, and responsive glassmorphism header styling.
- **Edge-Case Brainstorming**: AI helped identify edge cases such as bound checking for invalid URL query parameters (`?page=-5`, `?page=abc`), double-click form submission protection, and local overlay state merging algorithms.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Icons**: Lucide React
