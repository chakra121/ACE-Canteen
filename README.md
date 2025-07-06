<div align="center">
  <img src="https://raw.githubusercontent.com/s-sricharan/ace-canteen-central/main/public/favicon.ico" alt="Canteen Logo" width="100" />
  <h1>ACE Canteen Central 🍔</h1>
  <p>A modern, full-stack, real-time canteen management system built with the latest web technologies.</p>
  
  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite"/>
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"/>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  </p>
</div>

---

## 🚀 Live Demo

> **Paste your deployment link here!**
>
> [**[Your Live Site URL]**](https://your-deployment-link.com)

---

## ✨ Key Features

ACE Canteen Central provides a seamless experience for both students and administrators, with a rich set of features tailored for a modern campus canteen.

### 👨‍🎓 For Students

*   **🍽️ Interactive Menu:** Browse a dynamic menu with categories, images, and veg/non-veg indicators.
*   **🔍 Smart Search:** Quickly find your favorite dishes.
*   **🛒 Real-time Cart:** Add items to your cart and see updates instantly.
*   **💳 Effortless Ordering:** Choose between "Dine-In" or "Take Away" and pay with cash (or online, with Razorpay integration ready).
*   **📊 Live Order Tracking:** Keep an eye on your order status from "Placed" to "Ready for Pickup".
*   **⭐ Item Ratings:** Rate menu items to provide feedback.
*   **👤 Profile Management:** Easily manage your personal information.
*   **🔐 Secure Authentication:** Safe and secure login with email/password or Google.

### 👑 For Admins

*   **📈 At-a-Glance Dashboard:** A comprehensive dashboard showing key metrics like **Today's Revenue**, all-time revenue, total orders, and pending orders.
*   **📋 Full Menu Control (CRUD):** Add, edit, and delete menu items and categories with ease.
*   **🖼️ Image & Stock Management:** Mark items as "in-stock" or "out-of-stock" and manage item images.
*   **🔄 Real-time Order Processing:** View incoming orders and update their status in real-time.
*   **📄 In-depth Daily Reports:** Generate detailed daily reports with charts for:
    *   Total Revenue & Orders
    *   Revenue by Category
    *   Veg vs. Non-Veg Split
    *   Most & Least Ordered Items
*   **⚙️ Canteen Settings:** Configure canteen operating hours and other settings.

---

## 🛠️ Technology Stack

This project is built with a modern, robust, and scalable tech stack.

*   **Frontend:**
    *   **Framework:** [React](https://reactjs.org/) (with [Vite](https://vitejs.dev/))
    *   **Language:** [TypeScript](https://www.typescriptlang.org/)
    *   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
    *   **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
    *   **Routing:** [React Router](https://reactrouter.com/)
    *   **Data Visualization:** [Recharts](https://recharts.org/)
*   **Backend & Database:**
    *   **Platform:** [Firebase](https://firebase.google.com/)
    *   **Services:**
        *   **Authentication:** For user login and management.
        *   **Cloud Firestore:** As the real-time NoSQL database.
        *   **Storage:** For hosting menu item images.
*   **State Management:** React Context API

---

## ⚙️ Getting Started: Local Setup

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18 or later recommended)
*   `npm` or your favorite package manager

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/s-sricharan/ace-canteen-central.git
    cd ace-canteen-central
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up Firebase:**
    *   Create a new project on the [Firebase Console](https://console.firebase.google.com/).
    *   Create a `.env.local` file in the root of the project.
    *   Add your Firebase project's web app configuration to the `.env.local` file. You can find these keys in your Firebase project settings.
        ```env
        VITE_FIREBASE_API_KEY="YOUR_API_KEY"
        VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
        VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
        VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
        VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
        VITE_FIREBASE_APP_ID="YOUR_APP_ID"
        VITE_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID"
        ```

4.  **Deploy Firebase Rules & Indexes:**
    *   You need the [Firebase CLI](https://firebase.google.com/docs/cli) for this step.
    *   Log in to Firebase: `firebase login`
    *   Deploy the provided Firestore rules and indexes:
        ```sh
        firebase deploy --only firestore:rules
        firebase deploy --only firestore:indexes
        ```

5.  **Seed the Database (Optional):**
    *   To populate your database with initial dummy data (like users, categories, and menu items), run the seed script:
        ```sh
        npm run seed
        ```

6.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

<div align="center">
  <p>Made with ❤️ by the community.</p>
</div>