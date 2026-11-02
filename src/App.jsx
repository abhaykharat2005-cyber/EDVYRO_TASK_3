import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BriefcaseBusiness, Search, ShieldCheck, MapPin, Clock3, Bookmark, X, CheckCircle2, AlertCircle, LoaderCircle, Menu, GraduationCap, Sparkles } from 'lucide-react';

const emptyForm = { fullName:'', email:'', phone:'', college:'', skills:'', coverNote:'' };
const validate = f => {
  const e = {};
  if (f.fullName.trim().length < 2) e.fullName = 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email.';
  if (!/^[+0-9()\-\s]{8,18}$/.test(f.phone)) e.phone = 'Enter a valid phone number.';
  if (f.college.trim().length < 2) e.college = 'Enter your college name.';
  if (f.skills.trim().length < 2) e.skills = 'Add at least one skill.';
  if (f.coverNote.trim().length < 20) e.coverNote = 'Write at least 20 characters.';
  return e;
};

export default function App() {
  const [jobs,setJobs] = useState([]);
  const [loading,setLoading] = useState(true);
  const [loadError,setLoadError] = useState('');
  const [search,setSearch] = useState('');
  const [category,setCategory] = useState('All');
  const [selected,setSelected] = useState(null);
  const [form,setForm] = useState(emptyForm);
  const [errors,setErrors] = useState({});
  const [sending,setSending] = useState(false);
  const [notice,setNotice] = useState(null);
  const [saved,setSaved] = useState([]);
  const [mobileNav,setMobileNav] = useState(false);

  async function loadJobs() {
    setLoading(true); setLoadError('');
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search',search.trim());
      if (category !== 'All') params.set('category',category);
      const response = await fetch(`/api/internships?${params}`);
      if (!response.ok) throw new Error('The internship service is temporarily unavailable.');
      const result = await response.json();
      setJobs(result.data || []);
    } catch (e) { setLoadError(e.message || 'Unable to load internships.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { const timer=setTimeout(loadJobs,250); return ()=>clearTimeout(timer); }, [search,category]);

  const categories = useMemo(()=>['All',...new Set(jobs.map(j=>j.category))], [jobs]);
  const closeModal = () => { setSelected(null); setForm(emptyForm); setErrors({}); };
  const submit = async e => {
    e.preventDefault();
    const nextErrors = validate(form); setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSending(true); setNotice(null);
    try {
      const response = await fetch('/api/applications',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,internshipId:selected.id})});
      const result = await response.json();
      if (!response.ok) {
        if (result.errors) setErrors(Object.fromEntries(Object.entries(result.errors).map(([k,v])=>[k,v?.[0]])));
        throw new Error(result.message || 'Submission failed.');
      }
      setNotice({type:'success',text:`Application received. Your reference number is #${result.data.id}.`});
      closeModal();
    } catch(e) { setNotice({type:'error',text:e.message}); }
    finally { setSending(false); }
  };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?'open':''}`}>
      <div className="brand"><div className="brand-mark"><Sparkles size={20}/></div><span>edvyro<span className="brand-dot">.</span></span></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>
        <a className="nav-item active" href="#opportunities"><BriefcaseBusiness size={18}/> Opportunities <span className="nav-count">{jobs.length}</span></a>
        <a className="nav-item" href="#how-it-works"><GraduationCap size={18}/> Career guide</a>
      </nav>
      <div className="sidebar-bottom"><div className="secure-card"><div className="secure-icon"><ShieldCheck size={18}/></div><strong>Your data is protected</strong><p>Applications are validated and securely stored.</p><span><i/> Secure connection</span></div><div className="profile-mini"><div className="avatar">A</div><div><b>Abhiraj workspace</b><small>Candidate portal</small></div><span className="profile-menu">•••</span></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><button className="mobile-menu" onClick={()=>setMobileNav(!mobileNav)}><Menu/></button><div className="crumb">Workspace <span>/</span> <b>Opportunities</b></div><div className="top-actions"><span className="live-status"><i/> API connected</span><div className="top-avatar">A</div></div></header>
      <section className="hero" id="opportunities"><div className="hero-copy"><div className="eyebrow"><span/> YOUR NEXT CHAPTER STARTS HERE</div><h1>Find work that<br/><em>moves you forward.</em></h1><p>Explore curated internships, build real-world skills, and take the next step in your career.</p><div className="hero-meta"><span><ShieldCheck size={15}/> Secure applications</span><span><BriefcaseBusiness size={15}/> Verified opportunities</span></div></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-card card-back"><span className="art-dot"/></div><div className="art-card card-front"><div className="art-icon"><BriefcaseBusiness size={22}/></div><div className="art-lines"><i/><i/><i/></div><div className="art-pill">Your next opportunity</div></div><div className="floating-star">✳</div><div className="floating-check"><CheckCircle2 size={20}/></div></div></section>
      <section className="content-area">
        <div className="section-heading"><div><div className="section-kicker">OPPORTUNITY BOARD</div><h2>Explore internships <span className="job-total">{jobs.length}</span></h2><p>Find a role that matches your ambition.</p></div><div className="filter-note"><span className="pulse"/> Updated opportunities</div></div>
        {notice && <div className={`notice ${notice.type}`}><span>{notice.type==='success'?<CheckCircle2 size={18}/>:<AlertCircle size={18}/>}</span>{notice.text}<button onClick={()=>setNotice(null)}><X size={16}/></button></div>}
        <div className="toolbar"><div className="search-box"><Search size={18}/><input aria-label="Search internships" placeholder="Search roles, companies, skills..." value={search} onChange={e=>setSearch(e.target.value)}/><kbd>⌘ K</kbd></div><div className="category-tabs">{['All','Engineering','Design','Data'].map(c=><button key={c} className={category===c?'chosen':''} onClick={()=>setCategory(c)}>{c}</button>)}</div></div>
        {loading ? <div className="state-panel"><LoaderCircle className="spin" size={28}/><b>Finding opportunities</b><span>Connecting to the internship API...</span></div> : loadError ? <div className="state-panel error-state"><AlertCircle size={28}/><b>We couldn't load internships</b><span>{loadError}</span><button className="retry-btn" onClick={loadJobs}>Try again</button></div> : jobs.length===0 ? <div className="state-panel"><Search size={28}/><b>No matching internships</b><span>Try another keyword or category.</span></div> : <div className="job-grid">{jobs.map((job,index)=><article className="job-card" key={job.id}><div className="job-top"><div className={`company-logo logo-${index%5}`}>{job.company.slice(0,1)}</div><button className={`save-btn ${saved.includes(job.id)?'saved':''}`} aria-label="Save internship" onClick={()=>setSaved(s=>s.includes(job.id)?s.filter(x=>x!==job.id):[...s,job.id])}><Bookmark size={17} fill={saved.includes(job.id)?'currentColor':'none'}/></button></div><div className="job-category">{job.category} <span>·</span> {job.type}</div><h3>{job.title}</h3><div className="company-name">{job.company}</div><p className="job-description">{job.description}</p><div className="job-details"><span><MapPin size={14}/>{job.location}</span><span><Clock3 size={14}/>{job.stipend}</span></div><div className="job-footer"><span className="posted-label"><i/> Accepting applications</span><button onClick={()=>{setSelected(job);setNotice(null)}}>Apply now <ArrowUpRight size={16}/></button></div></article>)}</div>}
        <section className="how-section" id="how-it-works"><div><div className="section-kicker">SIMPLE BY DESIGN</div><h2>Your next step, <em>made simple.</em></h2><p>From discovery to submission, the process is clear and secure.</p></div><div className="steps"><div><b>01</b><strong>Explore</strong><span>Discover roles that fit your skills.</span></div><div><b>02</b><strong>Apply</strong><span>Share your details through a validated form.</span></div><div><b>03</b><strong>Move forward</strong><span>Keep your application reference safe.</span></div></div></section>
      </section>
      <footer><span>© 2026 EdVyro · Candidate opportunities</span><span><ShieldCheck size={14}/> Built with security in mind</span></footer>
    </main>
    {selected && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)closeModal()}}><div className="application-modal"><div className="modal-head"><div><div className="section-kicker">APPLICATION FORM</div><h2>Apply for this role</h2><p>{selected.title} · {selected.company}</p></div><button className="close-btn" onClick={closeModal}><X/></button></div><div className="form-security"><ShieldCheck size={17}/><span>Your information is validated securely before submission.</span></div><form onSubmit={submit} noValidate><div className="form-grid">{[['fullName','Full name','e.g. Abhiraj Sharma'],['email','Email address','you@example.com'],['phone','Phone number','+91 98765 43210'],['college','College / University','Your institution'],['skills','Skills','React, JavaScript, SQL']].map(([key,label,placeholder])=><label className={key==='skills'?'wide':''} key={key}>{label}<input value={form[key]} placeholder={placeholder} onChange={e=>setForm({...form,[key]:e.target.value})}/>{errors[key]&&<small className="field-error">{errors[key]}</small>}</label>)}<label className="wide">Why are you a good fit?<textarea rows="4" placeholder="Tell us briefly about your interest and experience (20–1000 characters)." value={form.coverNote} onChange={e=>setForm({...form,coverNote:e.target.value})}/>{errors.coverNote&&<small className="field-error">{errors.coverNote}</small>}</label></div><div className="modal-actions"><button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button><button className="submit-btn" disabled={sending}>{sending?<><LoaderCircle className="spin" size={16}/> Submitting...</>:<>Submit application <ArrowUpRight size={16}/></>}</button></div></form></div></div>}
  </div>;
}
