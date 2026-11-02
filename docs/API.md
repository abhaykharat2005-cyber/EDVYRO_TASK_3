# API Reference

Base URL (development): `http://localhost:4000`

## GET /api/health
Returns API health status.

## GET /api/internships
Returns active internship records.

Query parameters:
- `search`: searches title, company and description.
- `category`: `Engineering`, `Design`, `Data`, or `All`.
- `type`: `Remote`, `Hybrid`, `On-site`, or `All`.
- `page`: page number (default 1).
- `limit`: page size (default 10, maximum 20).

## POST /api/applications
Creates an application. JSON body:

```json
{
  "internshipId": 1,
  "fullName": "Aarav Patil",
  "email": "aarav@example.com",
  "phone": "+91 9876543210",
  "college": "ABC College of Engineering",
  "skills": "React, JavaScript, SQL",
  "coverNote": "I am interested in this opportunity because..."
}
```

Returns `201` with an application reference ID. Invalid input returns `400` with field errors.

## GET /api/applications/:id
Returns the application summary for the supplied numeric ID.
