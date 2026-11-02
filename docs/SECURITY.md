# Security Notes

- Helmet sets common HTTP security headers.
- Express fingerprint header is disabled.
- API requests are rate-limited (100 requests per 15 minutes per IP).
- Zod validates and bounds all application fields on the server.
- SQL statements use prepared statements and bound parameters; user input is never concatenated into SQL.
- JSON request body is limited to 20 KB.
- CORS is restricted to the configured frontend origin.
- Frontend validation improves usability; server validation remains authoritative.
- Do not commit `.env`, database files, secrets, or real applicant information.
- For production, use HTTPS, configure a trusted proxy if applicable, and tune rate limits to the hosting environment.
