# 💰 Financial Tracker Pro

Financial Tracker Pro is a personal finance dashboard built using **Vue.js 3** and **Pinia** for robust state management. It allows users to track income and expenses, set category-specific budgets, and monitor their overall financial health.

## ✨ Key Features

* **Transaction Management:** Easily add, filter, and delete income and expense transactions.
* **Real-time Summary:** Displays current **Income**, **Expenses**, and **Net Balance**.
* **Comprehensive Budgeting:**
    * Set spending limits per category.
    * Track key metrics: **Total Budget**, **Remaining Budget**, and **Overspent** amount.
    * Monitor **Budget Used Percentage** with dynamic color indicators.
* **Responsive Design:** Styled with **Tailwind CSS** for a clean, mobile-friendly(I not sure) interface.
* **Mock Backend:** Uses **JSON Server** for a quick and easy local development API.

***

## 🛠️ Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend Framework** | **Vue.js 3** (Composition API) | User Interface |
| **State Management** | **Pinia** | Global state (Users, Transactions, Budgets) |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework |
| **API Client** | **Axios** | HTTP requests to the backend |
| **Local API** | **JSON Server** | Mock REST API at `http://localhost:3000` |

***

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

* **Node.js** (v14+)
* **npm** or **yarn**

### 1. Clone and Install

```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd financial-tracker-pro

# Install dependencies
npm install
