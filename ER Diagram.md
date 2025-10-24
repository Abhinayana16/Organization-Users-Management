# Entity Relationship Diagram

## Database Schema for Task Name Organization & Users Management

This document describes the database schema and entity relationships for the B2B Organization Management System.

---

## Entities

### 1. Organizations
**Table Name:** `organizations`

**Description:** Stores information about B2B organizations.

**Attributes:**
- `id` (UUID, Primary Key) - Unique identifier for the organization
- `name` (TEXT, NOT NULL) - Organization name
- `logo_url` (TEXT) - URL to organization logo
- `profile_tagline` (TEXT) - Short tagline about the organization
- `description` (TEXT) - Detailed description
- `industry` (TEXT) - Industry sector (e.g., Education, Technology)
- `company_size` (TEXT) - Size of the company (e.g., 100-500)
- `contact_email` (TEXT) - Primary contact email
- `contact_phone` (TEXT) - Contact phone number
- `contact_website` (TEXT) - Company website URL
- `address_line1` (TEXT) - Address line 1
- `address_line2` (TEXT) - Address line 2
- `city` (TEXT) - City
- `state` (TEXT) - State/Province
- `country` (TEXT) - Country
- `postal_code` (TEXT) - Postal/ZIP code
- `timezone` (TEXT) - Organization timezone (e.g., Asia/Kolkata)
- `date_format` (TEXT) - Preferred date format
- `language` (TEXT) - Primary language (e.g., English)
- `official_media_url` (TEXT) - Official media/press kit URL
- `status` (TEXT, NOT NULL, DEFAULT 'active') - Organization status (active/inactive)
- `created_at` (TIMESTAMPTZ, DEFAULT now()) - Creation timestamp
- `updated_at` (TIMESTAMPTZ, DEFAULT now()) - Last update timestamp

**Indexes:**
- Primary Key on `id`
- Index on `name` for faster searches
- Index on `status` for filtering

---

### 2. Organization Users
**Table Name:** `organization_users`

**Description:** Stores users belonging to organizations.

**Attributes:**
- `id` (UUID, Primary Key) - Unique identifier for the user
- `organization_id` (UUID, Foreign Key, NOT NULL) - Reference to organization
- `name` (TEXT, NOT NULL) - User full name
- `email` (TEXT, NOT NULL) - User email address
- `role` (TEXT) - User role/position (e.g., Administrator, Manager, User)
- `status` (TEXT, NOT NULL, DEFAULT 'active') - User status (active/inactive)
- `created_at` (TIMESTAMPTZ, DEFAULT now()) - Creation timestamp
- `updated_at` (TIMESTAMPTZ, DEFAULT now()) - Last update timestamp

**Indexes:**
- Primary Key on `id`
- Index on `organization_id` for faster lookups
- Index on `email` for faster searches
- Index on `status` for filtering

**Foreign Keys:**
- `organization_id` REFERENCES `organizations(id)` ON DELETE CASCADE

---

## Relationships

### One-to-Many: Organizations → Organization Users

**Relationship Type:** One-to-Many

**Description:**
- One organization can have multiple users
- Each user belongs to exactly one organization
- When an organization is deleted, all associated users are automatically deleted (CASCADE)

**Cardinality:**
- Organizations: 1
- Organization Users: 0..N (zero to many)

**Foreign Key:**
- `organization_users.organization_id` → `organizations.id`

---

## ER Diagram (Text Representation)

```
┌─────────────────────────────────────┐
│         organizations               │
├─────────────────────────────────────┤
│ PK  id (UUID)                       │
│     name (TEXT)                     │
│     logo_url (TEXT)                 │
│     profile_tagline (TEXT)          │
│     description (TEXT)              │
│     industry (TEXT)                 │
│     company_size (TEXT)             │
│     contact_email (TEXT)            │
│     contact_phone (TEXT)            │
│     contact_website (TEXT)          │
│     address_line1 (TEXT)            │
│     address_line2 (TEXT)            │
│     city (TEXT)                     │
│     state (TEXT)                    │
│     country (TEXT)                  │
│     postal_code (TEXT)              │
│     timezone (TEXT)                 │
│     date_format (TEXT)              │
│     language (TEXT)                 │
│     official_media_url (TEXT)       │
│     status (TEXT)                   │
│     created_at (TIMESTAMPTZ)        │
│     updated_at (TIMESTAMPTZ)        │
└─────────────────────────────────────┘
              │
              │ 1
              │
              │ has
              │
              │ N
              ▼
┌─────────────────────────────────────┐
│      organization_users             │
├─────────────────────────────────────┤
│ PK  id (UUID)                       │
│ FK  organization_id (UUID)          │
│     name (TEXT)                     │
│     email (TEXT)                    │
│     role (TEXT)                     │
│     status (TEXT)                   │
│     created_at (TIMESTAMPTZ)        │
│     updated_at (TIMESTAMPTZ)        │
└─────────────────────────────────────┘
```

---

## Database Design Decisions

### 1. UUID Primary Keys
UUIDs are used instead of auto-incrementing integers to:
- Prevent enumeration attacks
- Enable distributed systems and easier data merging
- Provide globally unique identifiers

### 2. Soft Status Instead of Hard Deletes
Using `status` fields (active/inactive) allows:
- Data retention for audit purposes
- Ability to reactivate entities
- Historical data analysis

### 3. Comprehensive Organization Data
The organizations table stores extensive information including:
- Contact details for communication
- Address information for registration/billing
- Localization preferences (timezone, language, date format)
- Profile information for public display

### 4. Cascade Deletion
When an organization is deleted, all associated users are automatically deleted to maintain referential integrity.

### 5. Timestamps
All tables include `created_at` and `updated_at` timestamps for:
- Audit trails
- Sorting by recency
- Change tracking

### 6. Indexes
Strategic indexes are placed on:
- Foreign keys for join performance
- Frequently filtered fields (status)
- Search fields (name, email)

---

## Security (Row Level Security)

### Organizations Table Policies
- SELECT: Public access allowed
- INSERT: Public access allowed
- UPDATE: Public access allowed
- DELETE: Public access allowed

### Organization Users Table Policies
- SELECT: Public access allowed
- INSERT: Public access allowed
- UPDATE: Public access allowed
- DELETE: Public access allowed

**Note:** In a production environment, these policies should be restricted to authenticated users with proper role-based access control.

---

## Sample Data Queries

### Get all organizations with user count
```sql
SELECT
  o.*,
  COUNT(u.id) as user_count
FROM organizations o
LEFT JOIN organization_users u ON u.organization_id = o.id
GROUP BY o.id
ORDER BY o.created_at DESC;
```

### Get all users for a specific organization
```sql
SELECT *
FROM organization_users
WHERE organization_id = 'organization-uuid-here'
ORDER BY created_at DESC;
```

### Get active organizations with active users
```sql
SELECT
  o.name as organization_name,
  u.name as user_name,
  u.email,
  u.role
FROM organizations o
JOIN organization_users u ON u.organization_id = o.id
WHERE o.status = 'active' AND u.status = 'active'
ORDER BY o.name, u.name;
```

---

## Future Enhancements

Potential schema improvements for future versions:

1. **User Roles Table:** Separate table for role definitions with permissions
2. **Activity Logs:** Track all changes to organizations and users
3. **Invitations Table:** Manage user invitations to organizations
4. **Organization Settings:** Separate table for organization-specific configurations
5. **User Sessions:** Track active user sessions and login history
6. **File Uploads:** Store organization logos and documents in a separate table
7. **Multi-tenancy Support:** Add support for multiple tenants/workspaces

---

## Technology Stack

- **Database:** PostgreSQL (via Supabase)
- **ORM/Client:** Supabase JS Client
- **Language:** TypeScript
- **Framework:** React + Vite

---

**Document Version:** 1.0
**Last Updated:** 2025-10-24
**Author:** Full Stack Application Development
