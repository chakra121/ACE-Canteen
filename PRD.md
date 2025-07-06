PRD: Canteen Management System - Website
This PRD combines the Student and Admin functionalities into a single website.
1. Introduction
1.1 Purpose: This document outlines the requirements for the website component of the canteen management system. The website provides two key functionalities: 1) allowing students to browse the menu, place orders, and track order status, and 2) allowing the admin to manage canteen operations.
1.2 Goals:
Provide a convenient ordering system for students via the web.
Centralize canteen management for the admin.
1.3 Target Audience:
Students: Use the website to browse the menu, place orders, and track order status.
Admin: Use the website to manage canteen operations.
1.4 Scope:
Included: Menu browsing, online ordering, order processing, inventory tracking, reporting, user authentication, admin panel (all website-based).
Excluded: Delivery management, SMS notifications, push notification for website,
1.5 Assumptions:
All students and the admin have access to computers with modern web browsers.
The canteen has reliable internet access.
1.6 Constraints:
The project is for study purposes, with limited time and resources.
1.7 Success Criteria:
Students successfully browse the menu, place orders, and track order status through the website.
Admin can efficiently manage menu and orders through the website.
2. User Requirements
2.1 Student (Website)
2.1.1 Menu Browsing:
Display the menu in categories (e.g., Breakfast, Lunch, Snacks, Beverages).
Display a green dot next to vegetarian items and a red dot next to non-vegetarian items.
Display images for each menu item.
Display a list of ingredients for each menu item.
Allow searching the menu by category.
2.1.2 Cart Management:
Provide an "Add to Cart" button for each menu item.
Allow adjusting the quantity of items in the cart (both on the menu item listing and in the cart view).
Provide a dedicated cart page for checkout.
Synchronize cart items across devices (if the user is logged in).
2.1.3 Ordering:
Offer "Cash" and "Online Payment (Razorpay - test mode)" options.
Provide options for "Dine-In" and "Take Away".
2.1.4 Order Tracking:
Display order status: "Order Placed," "Preparing," "Ready to Pickup," "Completed."
2.1.5 Account Management:
Allow users to manage their Name, Email (unique), Roll Number (unique), Phone Number (unique), and Password.
2.1.6 Feedback:
* Allow users to rate menu items using a star rating system.
* Store order history, if completed then only keep it
2.2 Admin (Website)
2.2.1 Menu Management:
CRUD (Create, Read, Update, Delete) operations on menu items.
Editable fields: Name, Price, Category, Image (from a predefined list), Ingredients, inStock (boolean).
Create and manage menu categories.
Schedule menu items for specific times of the day (e.g., breakfast items only available in the morning).
Mark menu items as "in-stock" or "out-of-stock." Only "in-stock" items are visible to students.
Select images from a limited set of images stored in Firebase Storage (referenced by image name/URL).
2.2.2 Order Processing:
Website will have a dedicated button that you click for the new order statuses, instead of the web side getting order statuses automatically.
2.2.3 Inventory Management:
Track inventory levels for items by using an inStock field.
2.2.4 Reporting and Analytics:
Generate a daily report with:
Total revenue
Revenue by category (with pie chart)
Total number of orders
Average order size
Most ordered items
Least ordered items
Pie chart of Veg/Non-Veg orders
2.2.5Settings:
Generated code
* Canteen Hours
Use code with caution.
3. Page Flow and Functionality
3.1 Website (Student)
3.1.1 Authentication:
Login: Existing users enter their email/phone and password.
Registration: New users provide their Name, Email, Roll Number, Phone Number, and Password. The system validates email/phone uniqueness.
3.1.2 Main Menu:
Displays the menu categories.
Displays menu items in each category with image, name, ingredients, price, and "Add to Cart" button.
Search bar for category search.
Website will have a dedicated button that you click for the new order statuses, instead of the web side getting order statuses automatically.
3.1.3 Cart:
Lists items added to the cart with quantity selection.
Displays subtotal, tax, and total amount.
"Dine-In" or "Take Away" selection.
Payment method selection (Cash or Razorpay).
"Confirm Order" button.
3.1.4 Order Tracking:
Displays the status of the current order and a history of past orders.
Website will have a dedicated button that you click for the new order statuses, instead of the web side getting order statuses automatically.
3.1.5 Profile:
Allows users to view and edit their profile information (Name, Email, Roll Number, Phone Number, Password).
3.2 Website (Admin)
3.2.1 Login: Admin logs in with email and password.
3.2.2 Dashboard:
Displays incoming orders and past orders
Displays a summary of key metrics (e.g., total revenue, number of orders).
Website will have a dedicated button that you click for the new order statuses, instead of the web side getting order statuses automatically.
3.2.3 Menu Management:
Allows adding, editing, and deleting menu items.
Provides fields for name, price, category, image selection (dropdown list), ingredients, and "in-stock" status.
Allows managing menu categories.
Allows scheduling menu items for specific times.
3.2.4 Order Management:
Website will have a dedicated button that you click for the new order statuses, instead of the web side getting order statuses automatically.
3.2.5 Inventory Management:
Simple "in-stock" / "out-of-stock" management for menu items.
3.2.6 Reporting:
Generates a daily report (as specified in section 2.2.4) with options to export the data.
*Shows a click able button on report the report can be genarated by clicking on the generate
3.2.7 Settings:
* Canteen Hours
4. Technical Requirements
4.1 Platform Compatibility:
Website: Supports all modern web browsers (Chrome, Firefox, Safari, Edge).
4.2 Security:
Use Firebase Authentication to manage user accounts.
Implement server-side validation to ensure data integrity.
Restrict access to sensitive data based on user roles (Admin only for certain functions).
4.3 Performance:
Response time/loading time should be between 200 milliseconds and 4 seconds.
Handle a maximum of 10 concurrent users.
4.4 Integration:
Razorpay integration (in test mode) for online payments.
4.5 Technology Stack:
Website: Next.js, TypeScript, Tailwind CSS, Shadcn/UI
Database: Cloud Firestore
Authentication: Firebase Authentication
5. Non-Functional Requirements
5.1 Usability: The system should be easy to use for both students and the admin, with a user-friendly interface similar to food delivery apps.
5.2 Reliability: NA
5.3 Availability: The system should be available 24/7, but orders will only be accepted during canteen hours.
5.4 Maintainability: The project is for learning purposes, so maintainability is not a primary concern.
5.5 Portability: Yes, the system should be easy to move to a different platform or hosting environment.
5.6 Scalability: NA
Key Notes:
Authentication: The website must implement Firebase Authentication and manage user roles (student/admin) to restrict access to certain features.
UI/UX: Students and Admins will have to use same site. Make sure that the UI/UX is clear for the intended user.
Student Feature parity You must ensure that students have all of the same functionality weather they come from the app or Website