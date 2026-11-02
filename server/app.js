import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { db } from './db.js';
import { applicationSchema } from './schemas.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-7', legacyHeaders: false }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'EdVyro Applications API' }));

app.get('/api/internships', (req, res) => {
  const search = String(req.query.search || '').trim().slice(0, 80);
  const category = String(req.query.category || '').trim().slice(0, 40);
  const type = String(req.query.type || '').trim().slice(0, 30);
  const page = Math.max(1, Math.min(100, Number.parseInt(req.query.page, 10) || 1));
  const limit = Math.max(1, Math.min(20, Number.parseInt(req.query.limit, 10) || 10));
  const where = ['active = 1'];
  const params = {};
  if (search) { where.push('(title LIKE @search OR company LIKE @search OR description LIKE @search)'); params.search = `%${search}%`; }
  if (category && category !== 'All') { where.push('category = @category'); params.category = category; }
  if (type && type !== 'All') { where.push('type = @type'); params.type = type; }
  const clause = where.join(' AND ');
  const total = db.prepare(`SELECT COUNT(*) AS count FROM internships WHERE ${clause}`).get(params).count;
  const rows = db.prepare(`SELECT id,title,company,location,type,category,stipend,description
    FROM internships WHERE ${clause} ORDER BY id LIMIT @limit OFFSET @offset`)
    .all({ ...params, limit, offset: (page - 1) * limit });
  res.json({ data: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

app.post('/api/applications', (req, res) => {
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Please correct the highlighted fields.', errors: parsed.error.flatten().fieldErrors });
  }
  const input = parsed.data;
  const internship = db.prepare('SELECT id FROM internships WHERE id = ? AND active = 1').get(input.internshipId);
  if (!internship) return res.status(404).json({ message: 'Internship not found or no longer active.' });

  const insert = db.prepare(`INSERT INTO applications
    (internship_id,full_name,email,phone,college,skills,cover_note)
    VALUES (@internshipId,@fullName,@email,@phone,@college,@skills,@coverNote)`);
  const result = insert.run(input);
  res.status(201).json({ message: 'Application submitted successfully.', data: { id: result.lastInsertRowid, status: 'Submitted' } });
});

app.get('/api/applications/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: 'Invalid application ID.' });
  const row = db.prepare(`SELECT a.id,a.full_name AS fullName,a.email,a.status,a.created_at AS createdAt,
    i.title AS internshipTitle,i.company FROM applications a JOIN internships i ON i.id=a.internship_id WHERE a.id=?`).get(id);
  if (!row) return res.status(404).json({ message: 'Application not found.' });
  res.json({ data: row });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'An unexpected server error occurred.' });
});
