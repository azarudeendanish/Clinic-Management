This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



NOTES
You can also:

Show doctor name in super admin dashboard

Show assigned doctor in nurse prescription list

Add "Reassign Doctor" feature

Add patient queue system

Add token number per doctor


WORK FLOW
Nurse Dashboard:
    ➕ Add Patient
        Full Name
        Father Name
        Aadhaar Number (unique)
        Age / DOB
        Gender (missing → add this)
        Blood Group
        Phone / Email
        Address (instead of just place)
        Assign Doctor (optional OR auto via admin rules)

    📋 Patient List
        Columns:
        Patient ID
        Name
        Age / Gender
        Contact
        Assigned Doctor
        Created By (nurse)
        Created At
        Status:
        Registered
        Waiting
        In Consultation
        Completed
        Actions:
        Mark as “Ready for Doctor”
        View history

Doctor Dashboard:
    Responsibilities: consultation + prescription

    📋 Patient Queue (today’s patients)
    Filter: Waiting / In Consultation / Completed
    👁 View Patient Details
        ➕ Add Prescription
        Diagnosis
        Medicines
        Notes
        Follow-up date
        ✅ Mark Visit Complete

🧑‍💼 Admin Dashboard:

    Sidebar:
    Users (Doctors + Nurses)
    Patients
    Appointments (add this)
    Prescriptions
    Reports (optional but useful)

    👥 User Management
        Create Doctor / Nurse
        Activate / Deactivate
        Assign roles

    🧑 Patients
        View all patients
        Reassign doctor
    💊 Prescriptions
        List all prescriptions
        Status:
        Pending
        Completed
        Paid (if billing added)

DATABASE: 
1. Users:
    id
    name
    role (admin / doctor / nurse)
    email
    phone
    password
    is_active
    created_at

2. Patients:
    id
    full_name
    father_name
    aadhaar_number (unique)
    age
    gender
    blood_group
    phone
    email
    address
    created_by (nurse_id)
    assigned_doctor_id
    created_at

3. Patient Visit
    id
    patient_id
    doctor_id
    status (waiting / in_consultation / completed)
    created_at

4. Prescription
    id
    visit_id
    doctor_id
    diagnosis
    notes
    follow_up_date
    status (pending / completed)
    created_at

5. Medicines
    id
    prescription_id
    medicine_name
    dosage
    duration
    instructions

API's:
AUTH:
    POST /auth/login
    POST /auth/register
USER (admin):
    GET    /users
    POST   /users
    PUT    /users/:id
    PATCH  /users/:id/activate
PATIENT:
    POST   /patients
    GET    /patients
    GET    /patients/:id
    PUT    /patients/:id
VISIT:
    POST   /visits
    GET    /visits?status=waiting
    PUT    /visits/:id/status
PRESCRIPTION:
    POST   /prescriptions
    GET    /prescriptions
    GET    /prescriptions/:id
MEDICINES:
    POST   /medicines
    GET    /medicines?prescription_id=1

WIREFRAME:
    Nurse:
        add patient
        status as waiting
    Doctor:
        Fetch visits where status = waiting
        Update status → in_consultation
        Add prescription
        Mark visit = completed
    Admin:
        Manage users
        Reassign doctors
        Monitor visits & prescriptions

FULL FLOW:
1. Nurse:
   Add Patient → Create Visit (Waiting)

2. Doctor:
   Open Visit → Consultation → Add Prescription → Complete Visit

3. System:
   Auto-create Follow-up (if date exists)

4. Admin:
   Monitor everything
