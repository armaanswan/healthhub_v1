# Introduction Changed

HealthHub is designed to be locally hosted within the clinic's network, enabling multiple roles (patients, doctors, staff, administrators) to access and manage their respective responsibilities. The system aims to replace manual record-keeping and test result management with a digital solution that is more efficient and secure. The system will consist of:

- A **React.js** frontend for the user interface.
- A **Node.js** backend for handling the business logic and API endpoints.
- A **MongoDB** database to store patient records, test results, and user information.

# Product Functions

HealthHub will provide the following functionalities:

- **User Authentication & Role Management:** Login and access based on role (patients, doctors, staff, administrators).
- **Patient Registration & Verification:** Patients can create accounts, which must be verified by an administrator.
- **Test Prescription & Results:** Doctors can prescribe tests to patients. Staff members can upload test results, which both patients and doctors can view.
- **Account Management:** Users can update their account details, with varying levels of access (e.g., patients can update personal info, admins can delete any account).
- **Report Generation:** Administrators can generate yearly or monthly reports on clinic operations (e.g., number of tests, active users).
- **Data Management:** All users’ data, including test results, will be stored in a secure, locally hosted database.

# Specific Requirements

## Functional Requirements

1. **User Authentication**
- The system must allow users to create accounts and authenticate via a login system.
- Admins should approve patient accounts before they are fully activated.
- The system should provide role-based access to features (e.g., patients vs. doctors vs. admins).
2. **Patient Account Management**
- Patients can create, view, and modify their accounts.
- Patients must be able to view their test results after they have been uploaded by the staff.
3. **Test Management**
- Doctors can prescribe tests to patients.
- Staff can upload test results for patients.
- Test results should be categorized into different types (blood tests, x-rays, ultrasounds, etc.).
4. **Admin Functions**
- Admins can create and manage doctor/staff accounts.
- Admins can verify patient accounts.
- Admins can generate monthly and yearly health reports.
5. **Notifications**
- Patients should be notified when test results are available.
- Admins should be notified when new patients register and are awaiting approval.

## Non-functional Requirements

### Performance Requirements

- The system must support up to 50 concurrent users accessing the system on the local network.
- The database must handle up to 10,000 records with minimal performance degradation.
- File uploads (e.g., test result PDFs or images) must be processed and made available within 5 seconds of submission.

### Other Non-functional Requirements

#### Security:
- Use JWT tokens for secure authentication and role-based access control.
- All sensitive data, including passwords and medical records, must be encrypted in the database.
- The system must prevent unauthorized access to patient data.

#### Usability:
- The user interface should be simple and intuitive, with clear navigation.
- Users should be able to perform their tasks with no more than 3-4 clicks from the homepage.

#### Reliability:
- The system should be robust enough to recover from common user errors (e.g., incorrect login attempts).
- == Automatic backup of the database must be scheduled daily ==.

#### Maintainability:
- The system should be modular, allowing easy updates and maintenance.
- Proper documentation for both frontend and backend should be maintained for future developers.

## Logical Database Requirements
The system will use MongoDB to store information such as:
- **Users Collection:** Includes patients, doctors, staff, and administrators. Each user will have a role, contact info, and login credentials.
- **Test Results Collection:** Stores test prescriptions, test types, results, and relevant documents.
- **Appointments Collection (future extension):** This will store information related to patient appointments (if implemented in future versions).

Data Relationships:
- Each Patient will be linked to multiple Test Results.
- Doctors and Staff will be linked to the Patients they manage.
