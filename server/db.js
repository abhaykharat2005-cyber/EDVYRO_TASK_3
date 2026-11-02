import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH || path.join(here, 'data', 'applications.db');
fs.mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true });

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
  CREATE TABLE IF NOT EXISTS internships (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    stipend TEXT NOT NULL,
    description TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    internship_id INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    college TEXT NOT NULL,
    skills TEXT NOT NULL,
    cover_note TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Submitted',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (internship_id) REFERENCES internships(id)
  );
`);
const count = db.prepare('SELECT COUNT(*) AS count FROM internships').get().count;
if (count === 0) {
  const insert = db.prepare(`INSERT INTO internships
    (id,title,company,location,type,category,stipend,description,active)
    VALUES (@id,@title,@company,@location,@type,@category,@stipend,@description,1)`);
  const seed = [
    {id:1,title:'Frontend Developer Intern',company:'Northstar Digital',location:'Remote · India',type:'Remote',category:'Engineering',stipend:'₹8,000 / month',description:'Build accessible React interfaces, collaborate with designers, and improve product experiences.'},
    {id:2,title:'Backend Engineering Intern',company:'Orbit Systems',location:'Pune, Maharashtra',type:'Hybrid',category:'Engineering',stipend:'₹10,000 / month',description:'Develop REST APIs, write tests, and work with SQL databases and secure integrations.'},
    {id:3,title:'UI/UX Design Intern',company:'PixelCraft Studio',location:'Remote · India',type:'Remote',category:'Design',stipend:'₹6,000 / month',description:'Create user flows, wireframes, prototypes, and polished interface systems.'},
    {id:4,title:'Data Analyst Intern',company:'InsightLoop',location:'Mumbai, Maharashtra',type:'On-site',category:'Data',stipend:'₹9,000 / month',description:'Clean datasets, build dashboards, and communicate practical business insights.'},
    {id:5,title:'QA Automation Intern',company:'QualityGrid',location:'Remote · India',type:'Remote',category:'Engineering',stipend:'₹7,500 / month',description:'Create reliable automated tests and help teams ship high-quality releases.'}
  ];
  const tx = db.transaction(rows => rows.forEach(row => insert.run(row)));
  tx(seed);
}
export function resetDatabase() {
  db.exec('DELETE FROM applications;');
}
