# Payrollmanagement-system

designed the front-end using Webflow (https://webflow.com) which allows you darg and drop design but on the other hand you can use custom code in your website. 
I also allows you to export code for the created website (only the front-end) not the backend of website

further more, I have done sign-up and login feature. index.html and member.html flow of control depending on the employee role. 

at login first it check weather this employye signed in? if no they ask the user to sign in if yes then redirect user depending on it's role.
at sign up first check the user if it exist in the eployee record if yes then allow it to sign-in 

This project is a web-based application designed to manage employee information, attendance, payroll, benefits, and other HR-related data. The project consists of multiple HTML files, a server-side JavaScript file, and configuration files. The HTML files form the frontend of the application, each serving a specific purpose in the overall functionality. For instance, access-denied.html displays a message to users who do not have permission to access certain parts of the application, while all-emp.html lists all employees in the database. Other HTML files such as attendance.html, benifit.html, bouns.html, and deduction.html manage employee attendance records, benefits, bonuses, and salary deductions respectively. department.html is used for managing departments within the organization, and index.html serves as the landing page of the application.

Additionally, there are pages like info.html which provides information about the application or specific features, jobdesk.html for managing job descriptions and assignments, and leave.html for handling employee leave requests and approvals. The application also includes authentication-related pages such as log-in.html for user login, reset-password.html for password reset, sign-up.html for new user registration, and update-password.html for updating passwords. The member.html page displays and manages member profiles, while new.html is used for adding new records such as new employees or departments. The payroll.html page manages the payroll system, and tax.html handles tax information related to payroll. There is also a tesing.html page (assuming a typo for "testing.html") likely used for testing purposes, and user-account.html for managing user account information.

The server-side logic and API endpoints are managed by the server.js file. Configuration files include package.json which contains metadata about the project and its dependencies, package-lock.json which locks the versions of dependencies for consistent installs, and payrollProject_mysql.code-workspace, a configuration file for the Visual Studio Code workspace. The purpose of l.txt is unclear based on the name alone.
