# 📊 Sales Revenue Dashboard

A full-stack data visualization application designed to analyze sales revenue, product performance, and regional distribution. This dashboard allows users to upload Excel/CSV datasets and visualize key metrics through interactive charts.

## 🚀 Live Demo

**[View Live Demo Here]([YOUR_DEPLOYED_LINK_HERE](https://sales-revenue-dashbaord-acknazxya-ajays-projects-4590e44e.vercel.app/))**

_(Replace `YOUR_DEPLOYED_LINK_HERE` with your actual deployment URL, e.g., on Vercel or Render)_

## ✨ Features

- **File Upload**: Drag & drop or select Excel/CSV files to import sales data.
- **Interactive Dashboard**:
  - **Summary Cards**: Key metrics at a glance (Total Revenue, Total Sales, Average Order Value).
  - **Revenue Trends**: Line charts visualizing revenue over time (Monthly/Yearly).
  - **Product Performance**: Bar charts showing top-selling products.
  - **Regional Analysis**: Pie charts displaying sales distribution by region.
- **Advanced Filtering**: Filter data by Date Range, Category, and Region.
- **Responsive Design**: Fully responsive UI with a collapsible sidebar optimized for mobile and desktop.

## 🛠️ Tech Stack

### Frontend

- **React** (Vite)
- **Material UI (MUI)** - For diverse and responsive UI components.
- **Recharts** - For interactive and responsive charts.
- **Redux Toolkit** (RTK Query) - For efficient state management and data fetching.
- **Axios** - For HTTP requests.

### Backend

- **Node.js & Express** - Server-side framework.
- **PostgreSQL** - Relational database for storing sales data.
- **Multer** - For handling file uploads.
- **XLSX / CSV-Parser** - For parsing Excel and CSV files.
- **Dotenv** - For environment variable management.

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites

- Node.js installed
- PostgreSQL installed and running (or a cloud database URL like Neon/Supabase)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "Sales Revenue Dashbaord"
```

### 2. Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/yourdatabase
# Or use your cloud database URL
```

Start the backend server:

```bash
npm start
```

_The server will start on http://localhost:5000_

### 3. Frontend Setup

Open a new terminal, navigate to the frontend folder, and install dependencies:

```bash
cd ../frontend
npm install
```

Start the development server:

```bash
npm run dev
```

_The application will open at http://localhost:5173_

## 📡 API Endpoints

| Method | Endpoint                  | Description                                             |
| :----- | :------------------------ | :------------------------------------------------------ |
| `POST` | `/api/upload`             | Upload `.xlsx` or `.csv` files to the database          |
| `GET`  | `/api/analytics/summary`  | Get total revenue, sales count, and other summary stats |
| `GET`  | `/api/analytics/trends`   | Get sales trends over time (supports filtering)         |
| `GET`  | `/api/analytics/products` | Get top performing products                             |
| `GET`  | `/api/analytics/regions`  | Get sales distribution by region                        |
| `GET`  | `/api/analytics/filters`  | Get available filter options (categories, regions)      |

## 📸 Screenshots

_(You can add screenshots of your dashboard here to showcase the UI)_

## 📄 License

This project is licensed under the ISC License.
