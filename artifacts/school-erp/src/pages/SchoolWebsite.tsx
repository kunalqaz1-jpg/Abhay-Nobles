import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import "./SchoolWebsite.css";

/* ============================================================
   DATA
============================================================ */
const WHY_CARDS = [
  { icon: "🏆", title: "Academic Excellence", desc: "Consistently 95%+ board results with students topping state & district exams every year." },
  { icon: "🔬", title: "Modern Labs", desc: "State-of-the-art physics, chemistry, biology & computer labs with latest equipment." },
  { icon: "🎭", title: "Holistic Development", desc: "Sports, arts, drama, music and extracurricular — we nurture every talent." },
  { icon: "👨‍🏫", title: "Expert Faculty", desc: "Highly qualified, dedicated teachers with an average of 15+ years of experience." },
  { icon: "🛡️", title: "Safe Campus", desc: "24/7 CCTV surveillance, smart ID card system and dedicated security personnel." },
  { icon: "🚌", title: "Transport Facility", desc: "GPS-tracked school buses covering all major areas of the city and nearby villages." },
  { icon: "💻", title: "Smart Classrooms", desc: "Fully digitised smart boards, projectors and e-learning resources in every class." },
  { icon: "🌱", title: "Value Education", desc: "Character building, moral education and community service deeply embedded in curriculum." },
];

const RESULT_BARS = [
  { label: "Class 12 — 98.8% Pass Rate", pct: 98.8 },
  { label: "Class 10 — 99.2% Pass Rate", pct: 99.2 },
  { label: "Students Scoring 90%+", pct: 72 },
  { label: "State Board Toppers", pct: 85 },
];

const FACILITIES = [
  { title: "Modern Science Labs", desc: "Fully equipped Physics, Chemistry & Biology labs with advanced instruments for hands-on learning.", img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80" },
  { title: "Digital Library", desc: "10,000+ books, digital journals, e-resources and a dedicated reading room for deep study.", img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80" },
  { title: "Sports Complex", desc: "Cricket ground, basketball & volleyball courts, badminton hall and a 200m running track.", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80" },
  { title: "Smart Classrooms", desc: "Interactive smart boards, projectors and audio systems in every classroom for engaging lessons.", img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80" },
  { title: "Computer Lab", desc: "High-speed internet connected computer labs with latest hardware and licensed software.", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" },
  { title: "School Transport", desc: "GPS-tracked, AC school buses with experienced drivers and attendants for safe commute.", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80" },
];

const TEACHERS = [
  { name: "Dr. Meena Sharma", dept: "Mathematics", qual: "Ph.D. Mathematics · 20 yrs exp", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
  { name: "Mr. Rajesh Patel", dept: "Physics", qual: "M.Sc. Physics · 18 yrs exp", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
  { name: "Mrs. Sunita Rao", dept: "English", qual: "M.A. English Lit · 15 yrs exp", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80" },
  { name: "Mr. Anil Gupta", dept: "Chemistry", qual: "M.Sc. Chemistry · 22 yrs exp", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" },
];

const LIFE_CARDS = [
  { cls: "life-card-1", title: "Sports & Athletics", sub: "National Level Champions · State Winners", img: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80", alt: "Students celebrating sports victory" },
  { cls: "life-card-2", title: "Annual Cultural Festival", sub: "Drama · Music · Dance · Art", img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80", alt: "Students performing in cultural festival" },
  { cls: "life-card-5", title: "Educational Tours", sub: "National & International Educational Trips", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80", alt: "Educational tour" },
  { cls: "life-card-3", title: "Science & Innovation", sub: "Robotics · Olympiads · STEM Projects", img: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=900&q=80", alt: "Science innovation" },
  { cls: "life-card-4", title: "Arts & Music", sub: "Painting · Classical Dance · Vocal Music", img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80", alt: "Arts and music" },
  { cls: "life-card-6", title: "Eco & Social Clubs", sub: "Green Campus · Community Service", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80", alt: "Eco club" },
];

const GALLERY_ITEMS = [
  { cat: "campus", src: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=900&q=80", alt: "School building" },
  { cat: "events", src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80", alt: "Prize distribution" },
  { cat: "campus", src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80", alt: "Science lab" },
  { cat: "sports", src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80", alt: "Sports on the ground" },
  { cat: "cultural", src: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=900&q=80", alt: "Dance programme" },
  { cat: "campus", src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80", alt: "Library reading" },
  { cat: "cultural", src: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=900&q=80", alt: "Music class" },
  { cat: "events", src: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80", alt: "School function" },
  { cat: "sports", src: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=900&q=80", alt: "Sports day" },
  { cat: "cultural", src: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80", alt: "Drawing activity" },
  { cat: "campus", src: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80", alt: "School bus" },
  { cat: "events", src: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80", alt: "Outdoor activity" },
];

const TESTIMONIALS = [
  { stars: "★★★★★", text: '"Enrolling our daughter at Abhay Nobles was the best decision we ever made. The teachers are incredibly dedicated, the facilities are outstanding, and she has grown not just academically but as a person. This school truly cares."', name: "Ms. Nisha", role: "Mother of Priya Sharma · Class 10", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
  { stars: "★★★★★", text: '"My son went from a shy student to a confident national-level science olympiad winner. The faculty here doesn\'t just teach — they mentor, they motivate, and they believe in every child\'s potential."', name: "Mr. Vivek", role: "Father of Arjun Patel · Class 12", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
  { stars: "★★★★★", text: '"I am proud to be an alumnus of Abhay Nobles. The discipline, values, and education I received here shaped my entire career. I secured IIT Bombay rank 142 — and I owe it all to this wonderful institution."', name: "Mr. Lalit", role: "IIT Bombay · Batch of 2011 · Alumni", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
];

const CLASS_TABS = ["Nursery–KG", "Class 1–5", "Class 6–8", "Class 9–10", "Class 11–12 Sci", "Class 11–12 Com"];

/* ============================================================
   HOOKS
============================================================ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".school-website .reveal, .school-website .reveal-left, .school-website .reveal-right");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ============================================================
   MAIN COMPONENT
============================================================ */
export default function SchoolWebsite() {
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [slideIdx, setSlideIdx] = useState(0);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [barsAnimated, setBarsAnimated] = useState(false);
  const [admitSubmitted, setAdmitSubmitted] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const barsRef = useRef<HTMLDivElement>(null);

  useReveal();

  // Navbar scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Result bars animation
  useEffect(() => {
    if (!barsRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setBarsAnimated(true); }, { threshold: 0.3 });
    obs.observe(barsRef.current);
    return () => obs.disconnect();
  }, []);

  // Auto slide testimonials
  useEffect(() => {
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const filterGallery = (cat: string) => setGalleryFilter(cat);
  const openLightbox = (src: string, alt: string) => setLightbox({ src, alt });
  const closeLightbox = () => setLightbox(null);
  const changeSlide = (dir: number) => setSlideIdx((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <div className="school-website">

      {/* ── NAVBAR ─────────────────────────────── */}
      <nav id="navbar" className={scrolled ? "scrolled" : ""}>
        <div className="nav-inner">
          <div className="nav-logo">
            <div className="nav-logo-icon">AN</div>
            <div className="nav-logo-text">
              <span className="nav-logo-name">Abhay Nobles</span>
              <span className="nav-logo-tag">Est. 2000 · RBSE Affiliated</span>
            </div>
          </div>
          <ul className="nav-links">
            <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo("about"); }}>About</a></li>
            <li>
              <a href="#academics" onClick={(e) => { e.preventDefault(); scrollTo("academics"); }}>Academics ▾</a>
              <div className="dropdown">
                <a href="#academics" onClick={(e) => { e.preventDefault(); scrollTo("academics"); }}>Curriculum Overview</a>
                <a href="#academics" onClick={(e) => { e.preventDefault(); scrollTo("academics"); }}>Results & Achievements</a>
                <a href="#academics" onClick={(e) => { e.preventDefault(); scrollTo("academics"); }}>Smart Classrooms</a>
              </div>
            </li>
            <li>
              <a href="#admission" onClick={(e) => { e.preventDefault(); scrollTo("admission"); }}>Admissions ▾</a>
              <div className="dropdown">
                <a href="#admission" onClick={(e) => { e.preventDefault(); scrollTo("admission"); }}>Admission Process</a>
                <a href="#admission" onClick={(e) => { e.preventDefault(); scrollTo("admission"); }}>Fee Structure</a>
                <a href="#admission" onClick={(e) => { e.preventDefault(); scrollTo("admission"); }}>Scholarship</a>
              </div>
            </li>
            <li><a href="#facilities" onClick={(e) => { e.preventDefault(); scrollTo("facilities"); }}>Facilities</a></li>
            <li><a href="#faculty" onClick={(e) => { e.preventDefault(); scrollTo("faculty"); }}>Faculty</a></li>
            <li><a href="#gallery" onClick={(e) => { e.preventDefault(); scrollTo("gallery"); }}>Gallery</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Contact</a></li>
          </ul>
          <div className="nav-cta">
            <button className="btn btn-outline" style={{ padding: "0.55rem 1.25rem", fontSize: "0.85rem" }} onClick={() => navigate("/student/login")}>Student Portal</button>
            <button className="btn btn-gold" style={{ padding: "0.55rem 1.25rem", fontSize: "0.85rem" }} onClick={() => scrollTo("admission")}>Admissions Open</button>
          </div>
          <button className={`nav-burger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {[["about","About School"],["academics","Academics"],["admission","Admissions"],["facilities","Facilities"],["faculty","Faculty"],["gallery","Gallery"],["notices","News & Notices"],["contact","Contact Us"]].map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a>
        ))}
        <div className="mobile-menu-cta">
          <button className="btn btn-outline" onClick={() => { setMenuOpen(false); navigate("/student/login"); }}>Student Portal</button>
          <button className="btn btn-gold" onClick={() => { scrollTo("admission"); }}>Admissions Open</button>
        </div>
      </div>
      <div className={`sw-overlay${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)} />

      {/* ── HERO ───────────────────────────────── */}
      <section id="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-content">
          <div className="container">
            <div className="hero-grid-layout">
              <div>
                <div className="hero-badge"><span /># 1 School in Takhatgarh · RBSE Affiliated</div>
                <h1 className="display-xl text-white hero-heading">
                  Shaping <em>Futures</em>,<br />Inspiring <em>Excellence</em>
                </h1>
                <p className="hero-sub">
                  Shri Abhay Nobles Senior Secondary School — where every child discovers their true potential through world-class education, holistic development, and unmatched faculty mentorship.
                </p>
                <div className="hero-btns">
                  <button className="btn btn-gold btn-lg" onClick={() => scrollTo("admission")}>Apply for Admission 2026–27</button>
                  <button className="btn btn-outline btn-lg" onClick={() => scrollTo("about")}>Explore School →</button>
                </div>
                <div className="hero-trust">
                  <div className="hero-trust-stars">★★★★★</div>
                  <div className="hero-trust-text"><strong>2,400+</strong> happy families trust Abhay Nobles</div>
                </div>
              </div>
              <div className="hero-stats-card">
                <div className="stats-grid">
                  {[["25+","Years of Excellence"],["2400+","Students Enrolled"],["98%","Board Pass Rate"],["120+","Expert Faculty"]].map(([num, label]) => (
                    <div key={label} className="stat-item">
                      <div className="stat-number">{num.replace(/\+/, "")}<span>{num.includes("+") ? "+" : ""}</span></div>
                      <div className="stat-label">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M5 12l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </section>

      {/* ── ANNOUNCEMENT BAR ───────────────────── */}
      <div className="announcement-bar">
        <div className="marquee-track">
          {[
            "🎉 Admissions Open 2026–27 — Apply Now",
            "🏆 98.8% Board Results Class 12 — 2025",
            "📅 Parent-Teacher Meeting — 18 June 2026",
            "🌱 World Environment Day Plantation Drive — 5 June",
            "🥇 Manmeet Suthar wins Gold — State Science Olympiad",
            "📚 New Academic Session begins 12 June 2026",
            "🎉 Admissions Open 2026–27 — Apply Now",
            "🏆 98.8% Board Results Class 12 — 2025",
            "📅 Parent-Teacher Meeting — 18 June 2026",
            "🌱 World Environment Day Plantation Drive — 5 June",
            "🥇 Manmeet Suthar wins Gold — State Science Olympiad",
            "📚 New Academic Session begins 12 June 2026",
          ].map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── ABOUT ──────────────────────────────── */}
      <section id="about" className="section-pad-lg">
        <div className="container">
          <div className="about-grid">
            <div className="about-img-wrap reveal-left">
              <div className="about-accent-bar" />
              <div className="about-main-img">
                <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80" alt="Abhay Nobles School campus" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
              <div className="about-float-card">
                <div className="about-float-icon">🏅</div>
                <div>
                  <div className="about-float-num">25+</div>
                  <div className="about-float-label">Years of Academic Excellence</div>
                </div>
              </div>
            </div>
            <div className="reveal-right">
              <div className="section-label">Our Story</div>
              <h2 className="display-lg" style={{ color: "var(--navy)", marginTop: "0.75rem" }}>
                A Legacy of <em style={{ fontStyle:"italic", color:"var(--gold)" }}>Excellence</em> Since 2000
              </h2>
              <div className="gold-line" />
              <p className="body-lg" style={{ color:"var(--slate)", margin:"1.5rem 0" }}>
                Founded in 2000, Shri Abhay Nobles Senior Secondary School has grown from a modest institution into one of Rajasthan's most respected RBSE-affiliated schools — a place where academic rigour meets character development.
              </p>
              <p className="body-md" style={{ color:"var(--slate)", marginBottom:"2rem" }}>
                Our mission is simple: nurture every child's unique gifts in a caring, disciplined environment that prepares them not just for examinations — but for life. With 2,400+ students, 120+ faculty, and 25 years of trust, we are Takhatgarh's first choice for quality education.
              </p>
              <div className="about-pillars">
                {[
                  ["🎯","Excellence","Uncompromising academic standards"],
                  ["❤️","Care","Every child known by name"],
                  ["⚖️","Integrity","Values at the heart of all learning"],
                  ["🌍","Growth","Lifelong learners, global citizens"],
                ].map(([icon, name, desc]) => (
                  <div key={name} className="about-pillar">
                    <div className="about-pillar-icon">{icon}</div>
                    <div><div className="about-pillar-name">{name}</div><div className="about-pillar-desc">{desc}</div></div>
                  </div>
                ))}
              </div>
              <button className="btn btn-gold" onClick={() => scrollTo("admission")}>Join Our School Family</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ──────────────────────── */}
      <section id="why" className="section-pad-lg">
        <div className="container">
          <div className="why-header reveal">
            <div className="section-label" style={{ justifyContent:"center" }}>Why Abhay Nobles</div>
            <h2 className="display-lg text-white" style={{ marginTop:"0.75rem" }}>
              What Makes Us <em style={{ fontStyle:"italic", color:"var(--gold-light)" }}>Different</em>
            </h2>
            <div className="gold-line center" />
          </div>
          <div className="why-cards">
            {WHY_CARDS.map((card, i) => (
              <div key={i} className={`why-card reveal reveal-delay-${(i % 4) + 1}`}>
                <span className="why-card-num">0{i + 1}</span>
                <span className="why-card-icon">{card.icon}</span>
                <div className="why-card-title">{card.title}</div>
                <div className="why-card-desc">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACADEMICS ──────────────────────────── */}
      <section id="academics" className="section-pad-lg">
        <div className="container">
          <div className="academics-grid">
            <div>
              <div className="section-label">Academic Excellence</div>
              <h2 className="display-lg" style={{ color:"var(--navy)", marginTop:"0.75rem" }}>
                A Curriculum Built for <em style={{ fontStyle:"italic", color:"var(--gold)" }}>Tomorrow</em>
              </h2>
              <div className="gold-line" />
              <p style={{ color:"var(--slate)", margin:"1.5rem 0", lineHeight:1.7 }}>
                From Nursery to Class 12, our RBSE-aligned curriculum blends deep conceptual understanding with modern pedagogical methods, ensuring every student is exam-ready and life-ready.
              </p>
              <div className="class-tabs">
                {CLASS_TABS.map((t, i) => (
                  <button key={i} className={`class-tab${activeTab === i ? " active" : ""}`} onClick={() => setActiveTab(i)}>{t}</button>
                ))}
              </div>
              <div className="academics-features">
                {[
                  ["📖","NCERT + RBSE Aligned","Comprehensive board-aligned curriculum with in-depth topic coverage."],
                  ["📊","Weekly Assessments","Regular tests, quizzes and unit tests to track progress continuously."],
                  ["🧪","Lab-Based Learning","Science concepts reinforced with hands-on experiments in modern labs."],
                  ["💡","Doubt Resolution","Dedicated doubt-clearing sessions every day after regular school hours."],
                ].map(([icon, title, desc]) => (
                  <div key={String(title)} className="acad-feature reveal">
                    <div className="acad-feature-icon">{icon}</div>
                    <div><div className="acad-feature-title">{String(title)}</div><div className="acad-feature-desc">{String(desc)}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="academics-visual reveal-right" ref={barsRef}>
                <div className="acad-result-title">📊 Our Results Speak</div>
                <div className="result-bars">
                  {RESULT_BARS.map((bar) => (
                    <div key={bar.label}>
                      <div className="result-bar-label"><span>{bar.label}</span><span style={{ color:"var(--gold-light)" }}>{bar.pct}%</span></div>
                      <div className="result-bar-track">
                        <div className="result-bar-fill" style={{ width: barsAnimated ? `${bar.pct}%` : "0%" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="result-highlights">
                  {[["8","District Toppers"],["142","IIT/NIT Selections"],["34","State Rankers"],["100%","Scholarship Holders"]].map(([n, l]) => (
                    <div key={l} className="result-highlight">
                      <div className="result-highlight-num">{n}</div>
                      <div className="result-highlight-label">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ADMISSION ──────────────────────────── */}
      <section id="admission" className="section-pad-lg">
        <div className="container">
          <div className="admission-header reveal">
            <div className="section-label" style={{ justifyContent:"center" }}>Admissions 2026–27</div>
            <h2 className="display-lg text-white" style={{ marginTop:"0.75rem" }}>
              Join the <em style={{ fontStyle:"italic", color:"var(--gold-light)" }}>Abhay Nobles</em> Family
            </h2>
            <div className="gold-line center" />
            <p style={{ color:"rgba(255,255,255,0.55)", marginTop:"1rem", maxWidth:480, marginLeft:"auto", marginRight:"auto" }}>
              Admissions are open for the 2026–27 academic session. Limited seats available. Apply early to secure your child's future.
            </p>
          </div>
          <div className="admission-steps">
            {[
              ["1","Inquiry","Fill the online form or visit us"],
              ["2","Document Check","Submit required documents"],
              ["3","Entrance Test","Appear for the entrance assessment"],
              ["4","Interview","Principal's interaction session"],
              ["5","Admission","Pay fee & collect ID card"],
            ].map(([num, title, desc]) => (
              <div key={num} className="adm-step reveal">
                <div className="adm-step-num">{num}</div>
                <div className="adm-step-title">{title}</div>
                <div className="adm-step-desc">{desc}</div>
              </div>
            ))}
          </div>
          <div className="admission-bottom">
            <div className="adm-docs reveal-left">
              <h3>📋 Documents Required</h3>
              <div className="adm-doc-list">
                {["Birth Certificate (Original + 1 Copy)","Previous School Transfer Certificate","Mark Sheet of Last Class Attended","4 Recent Passport-Size Photographs","Aadhar Card of Student & Parents","Caste / Category Certificate (if applicable)","Domicile Certificate (Rajasthan Residents)","Migration Certificate (if from other state board)"].map((doc) => (
                  <div key={doc} className="adm-doc-item">
                    <div className="adm-doc-check">✓</div>
                    <div className="adm-doc-text">{doc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="adm-form-card reveal-right">
              <h3>📝 Quick Inquiry Form</h3>
              <p>We'll call you back within 24 hours</p>
              <div className="form-row">
                <div className="form-group"><label>Parent Name</label><input type="text" placeholder="Your full name" /></div>
                <div className="form-group"><label>Phone Number</label><input type="tel" placeholder="9928613702" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Student Name</label><input type="text" placeholder="Child's name" /></div>
                <div className="form-group">
                  <label>Applying for Class</label>
                  <select><option value="">Select class</option>{["Nursery","KG","1","2","3","4","5","6","7","8","9","10","11 Science","11 Commerce","12 Science","12 Commerce"].map(c => <option key={c}>Class {c}</option>)}</select>
                </div>
              </div>
              <div className="form-group"><label>Message (Optional)</label><textarea placeholder="Any specific questions or requirements..." /></div>
              <button className="btn btn-gold" style={{ width:"100%", justifyContent:"center", padding:"1rem" }}
                onClick={() => { setAdmitSubmitted(true); setTimeout(() => setAdmitSubmitted(false), 4000); }}>
                {admitSubmitted ? "✓ Inquiry Submitted! We'll Call You Soon" : "Submit Inquiry — We'll Call You Back 📞"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FACILITIES ─────────────────────────── */}
      <section id="facilities" className="section-pad-lg">
        <div className="container">
          <div className="facilities-header reveal">
            <div className="section-label" style={{ justifyContent:"center" }}>World-Class Infrastructure</div>
            <h2 className="display-lg" style={{ color:"var(--navy)", marginTop:"0.75rem" }}>
              Facilities That <em style={{ fontStyle:"italic", color:"var(--gold)" }}>Inspire</em>
            </h2>
            <div className="gold-line center" />
            <p style={{ color:"var(--slate)", maxWidth:520, margin:"1rem auto 0", textAlign:"center" }}>
              Every facility at Abhay Nobles is designed to create the ideal learning environment — safe, modern, and inspiring.
            </p>
          </div>
          <div className="facilities-grid">
            {FACILITIES.map((f, i) => (
              <div key={i} className={`facility-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="facility-img"><img src={f.img} alt={f.title} loading="lazy" /></div>
                <div className="facility-body">
                  <div className="facility-title">{f.title}</div>
                  <div className="facility-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FACULTY ────────────────────────────── */}
      <section id="faculty" className="section-pad-lg">
        <div className="container">
          <div className="faculty-header reveal">
            <div className="section-label" style={{ justifyContent:"center", color:"var(--gold)" }}>Our Educators</div>
            <h2 className="display-lg text-white" style={{ marginTop:"0.75rem" }}>
              Meet Our <em style={{ fontStyle:"italic", color:"var(--gold-light)" }}>Faculty</em>
            </h2>
            <div className="gold-line center" />
          </div>
          <div className="principal-card reveal">
            <div className="principal-photo">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80" alt="Principal" />
            </div>
            <div>
              <div className="principal-quote">
                Education is not merely the transfer of knowledge — it is the transformation of character. At Abhay Nobles, we commit to developing every child's mind, heart, and spirit.
              </div>
              <div style={{ marginTop:"1.5rem" }}>
                <div className="principal-name">Mr. Abhay Singh Rajput</div>
                <div className="principal-title">M.A., B.Ed. · Principal & Founder · 25 Years Experience</div>
              </div>
              <div className="principal-actions">
                <button className="btn btn-gold" onClick={() => scrollTo("contact")}>Book a Principal Meeting</button>
                <button className="btn btn-outline" onClick={() => scrollTo("contact")}>Learn About Our Vision</button>
              </div>
            </div>
          </div>
          <div className="teachers-grid">
            {TEACHERS.map((t) => (
              <div key={t.name} className="teacher-card reveal">
                <div className="teacher-photo"><img src={t.img} alt={t.name} loading="lazy" /></div>
                <div className="teacher-name">{t.name}</div>
                <div className="teacher-dept">{t.dept}</div>
                <div className="teacher-qual">{t.qual}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STUDENT LIFE ───────────────────────── */}
      <section id="student-life" className="section-pad-lg">
        <div className="container">
          <div className="student-life-header reveal">
            <div className="section-label" style={{ justifyContent:"center" }}>Beyond the Classroom</div>
            <h2 className="display-lg" style={{ color:"var(--navy)", marginTop:"0.75rem" }}>
              Vibrant <em style={{ fontStyle:"italic", color:"var(--gold)" }}>Student Life</em>
            </h2>
            <div className="gold-line center" />
            <p style={{ color:"var(--slate)", maxWidth:520, margin:"1rem auto 0", textAlign:"center" }}>
              School life at Abhay Nobles is vibrant, enriching, and full of opportunities to discover passions and build friendships.
            </p>
          </div>
          <div className="life-masonry">
            {LIFE_CARDS.map((card) => (
              <div key={card.title} className={`life-card ${card.cls} reveal`}>
                <div className="life-card-img"><img src={card.img} alt={card.alt} loading="lazy" /></div>
                <div className="life-card-overlay">
                  <div className="life-card-title">{card.title}</div>
                  <div className="life-card-sub">{card.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ────────────────────────────── */}
      <section id="gallery" className="section-pad-lg">
        <div className="container">
          <div className="gallery-header reveal">
            <div className="section-label" style={{ justifyContent:"center" }}>Gallery</div>
            <h2 className="display-lg text-white" style={{ marginTop:"0.75rem" }}>Photo <em style={{ fontStyle:"italic", color:"var(--gold-light)" }}>Gallery</em></h2>
            <div className="gold-line center" />
            <p className="text-white" style={{ marginTop:"0.75rem", opacity:0.75, fontSize:"0.95rem", maxWidth:"28rem", marginLeft:"auto", marginRight:"auto", lineHeight:1.55 }}>
              A few pictures from our school — campus, classroom, events, sports, and activities.
            </p>
          </div>
          <div className="gallery-filters reveal">
            {[["all","All"],["campus","Campus"],["events","Events"],["sports","Sports"],["cultural","Art & Culture"]].map(([val, label]) => (
              <div key={val} className={`gallery-filter${galleryFilter === val ? " active" : ""}`} onClick={() => filterGallery(val)}>{label}</div>
            ))}
          </div>
          <div className="gallery-masonry">
            {GALLERY_ITEMS.filter(g => galleryFilter === "all" || g.cat === galleryFilter).map((g, i) => (
              <div key={i} className="gallery-item" role="button" tabIndex={0} aria-label="Enlarge photo"
                onClick={() => openLightbox(g.src, g.alt)}
                onKeyDown={(e) => { if (e.key === "Enter") openLightbox(g.src, g.alt); }}>
                <div className="gallery-item-img"><img src={g.src} alt={g.alt} loading="lazy" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────── */}
      <section id="testimonials" className="section-pad-lg">
        <div className="container-sm">
          <div className="testimonials-header reveal">
            <div className="section-label" style={{ justifyContent:"center" }}>Testimonials</div>
            <h2 className="display-lg" style={{ color:"var(--navy)", marginTop:"0.75rem" }}>What <em style={{ fontStyle:"italic", color:"var(--gold)" }}>Families Say</em></h2>
            <div className="gold-line center" />
          </div>
          <div className="testimonials-slider reveal">
            <div className="testimonials-track" style={{ transform:`translateX(-${slideIdx * 100}%)` }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="testimonial-inner">
                    <div className="testimonial-stars">{t.stars}</div>
                    <div className="testimonial-text">{t.text}</div>
                    <div className="testimonial-author-photo"><img src={t.img} alt={t.name} /></div>
                    <div className="testimonial-author-name">{t.name}</div>
                    <div className="testimonial-author-role">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="slider-controls">
            <button className="slider-btn" onClick={() => changeSlide(-1)}>←</button>
            <div className="slider-dots">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} className={`slider-dot${slideIdx === i ? " active" : ""}`} onClick={() => setSlideIdx(i)} />
              ))}
            </div>
            <button className="slider-btn" onClick={() => changeSlide(1)}>→</button>
          </div>
        </div>
      </section>

      {/* ── NOTICES ────────────────────────────── */}
      <section id="notices" className="section-pad-lg">
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:"3rem" }} className="reveal">
            <div className="section-label text-gold" style={{ justifyContent:"center" }}>Stay Updated</div>
            <h2 className="display-lg text-white" style={{ marginTop:"0.75rem" }}>News & <em style={{ fontStyle:"italic", color:"var(--gold-light)" }}>Announcements</em></h2>
            <div className="gold-line center" />
          </div>
          <div className="notices-grid">
            <div className="notice-col reveal reveal-delay-1">
              <h3>📌 Important Notices</h3>
              <div className="notice-list">
                {[["15","May","Admission form last date extended to 30th May 2026","Admissions"],["20","May","Summer vacation schedule announced for all classes","Academic"],["25","May","Fee payment due date for Q2 — June 30, 2026","Finance"]].map(([d,m,t,c]) => (
                  <div key={t} className="notice-item">
                    <div className="notice-date"><div className="notice-day">{d}</div><div className="notice-month">{m}</div></div>
                    <div><div className="notice-title">{t}</div><div className="notice-cat">{c}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="notice-col reveal reveal-delay-2">
              <h3>🗓️ Upcoming Events</h3>
              <div className="notice-list">
                {[["05","Jun","World Environment Day — Plantation Drive on Campus","Events"],["12","Jun","New Academic Session Begins — Welcome Assembly","Academic"],["18","Jun","Parent-Teacher Meeting — Classes 9 to 12","Parent Connect"]].map(([d,m,t,c]) => (
                  <div key={t} className="notice-item">
                    <div className="notice-date"><div className="notice-day">{d}</div><div className="notice-month">{m}</div></div>
                    <div><div className="notice-title">{t}</div><div className="notice-cat">{c}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="notice-col reveal reveal-delay-3">
              <h3>🏆 Latest Achievements</h3>
              <div className="notice-list">
                {[["10","May","Manmeet Suthar wins Gold at State Level Science Olympiad","Achievement"],["08","May","School wins Best Institution Award — District Education Fair","Award"],["02","May","5 Students selected for National Level Debate Competition","Achievement"]].map(([d,m,t,c]) => (
                  <div key={t} className="notice-item">
                    <div className="notice-date"><div className="notice-day">{d}</div><div className="notice-month">{m}</div></div>
                    <div><div className="notice-title">{t}</div><div className="notice-cat">{c}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ────────────────────────────── */}
      <section id="contact" className="section-pad-lg">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info reveal-left">
              <div className="section-label">Get In Touch</div>
              <h2 className="display-md" style={{ color:"var(--navy)", marginTop:"0.75rem" }}>We'd Love to<br /><em style={{ fontStyle:"italic", color:"var(--gold)" }}>Hear From You</em></h2>
              <div className="gold-line" style={{ margin:"1.25rem 0" }} />
              <p style={{ color:"var(--slate)", lineHeight:1.7 }}>Visit us, call us, or drop us a message. Our team is always ready to welcome you and answer all your questions about admissions, academics, and campus life.</p>
              <div className="contact-details">
                {[
                  ["📍","Address","Near Ganpat Colony\nTakhatgarh, Rajasthan, 306901"],
                  ["📞","Phone","9928613702\nMon–Sat: 9:00 AM – 2:00 PM"],
                  ["💬","WhatsApp","+91 9928613702"],
                  ["✉️","Email","kunal4642m@gmail.com"],
                ].map(([icon, label, value]) => (
                  <div key={label} className="contact-detail">
                    <div className="contact-detail-icon">{icon}</div>
                    <div>
                      <div className="contact-detail-label">{label}</div>
                      <div className="contact-detail-value" style={{ whiteSpace:"pre-line" }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="map-placeholder">
                <iframe src="https://www.google.com/maps?q=Abhay%20Nobles%20School%2C%20Ganpat%20Colony%2C%20Takhatgarh%2C%20Pali%2C%20Rajasthan&output=embed" title="School Location" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>
              <p style={{ fontSize:"0.8rem", color:"var(--slate)", marginTop:"0.75rem", textAlign:"center" }}>Abhay Nobles School · Ganpat Colony, Takhatgarh, Pali, Rajasthan</p>
              <div style={{ textAlign:"center", marginTop:"0.75rem" }}>
                <a href="https://maps.app.goo.gl/JiNJ5UtsD7LEBxrn7" target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark" style={{ padding:"0.6rem 1.2rem", fontSize:"0.82rem" }}>Open Exact School Location</a>
              </div>
            </div>
            <div className="reveal-right">
              <div className="contact-form-card">
                <h3>Send a Message</h3>
                <p>We'll respond within 24 business hours</p>
                <div className="contact-form">
                  <div className="form-row">
                    <div className="form-group"><label>Full Name</label><input type="text" placeholder="Your name" /></div>
                    <div className="form-group"><label>Phone Number</label><input type="tel" placeholder="+91 9928613702" /></div>
                  </div>
                  <div className="form-group"><label>Email Address</label><input type="email" placeholder="kunal4642m@gmail.com" /></div>
                  <div className="form-group">
                    <label>Subject</label>
                    <select><option value="">Select a topic</option>{["Admission Inquiry","Fee Structure","Campus Visit","Transport Information","Hostel Information","Career / Jobs at School","Other"].map(o => <option key={o}>{o}</option>)}</select>
                  </div>
                  <div className="form-group"><label>Message</label><textarea placeholder="Write your message here..." /></div>
                  <button className="btn btn-gold" style={{ width:"100%", justifyContent:"center", padding:"1rem" }}
                    onClick={() => { setContactSubmitted(true); setTimeout(() => setContactSubmitted(false), 4000); }}>
                    {contactSubmitted ? "✓ Message Sent Successfully!" : "Send Message →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer>
        <div className="footer-main">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="nav-logo" style={{ marginBottom:"1.25rem" }}>
                  <div className="nav-logo-icon">AN</div>
                  <div className="nav-logo-text">
                    <span className="nav-logo-name">Abhay Nobles</span>
                    <span className="nav-logo-tag">Est. 2000 · RBSE Affiliated</span>
                  </div>
                </div>
                <p>Nurturing excellence, building character, and inspiring futures since 2000. A place where every child discovers their potential and every dream finds its wings.</p>
                <div className="footer-social">
                  {[["f","Facebook"],["📷","Instagram"],["▶","YouTube"],["𝕏","Twitter"],["in","LinkedIn"]].map(([icon, title]) => (
                    <a key={title} href="#" className="social-btn" title={title}>{icon}</a>
                  ))}
                </div>
              </div>
              <div className="footer-col">
                <h4>Quick Links</h4>
                <div className="footer-links">
                  {[["#about","About School"],["#academics","Academics"],["#admission","Admissions"],["#facilities","Facilities"],["#faculty","Faculty"],["#gallery","Gallery"],["#contact","Contact Us"]].map(([href, label]) => (
                    <a key={label} href={href} onClick={(e) => { e.preventDefault(); scrollTo(href.slice(1)); }}>{label}</a>
                  ))}
                </div>
              </div>
              <div className="footer-col">
                <h4>Portals</h4>
                <div className="footer-links">
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate("/student/login"); }}>Student Login</a>
                  <a href="#">Parent Portal</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate("/teacher/login"); }}>Teacher Portal</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin/login"); }}>Admin Login</a>
                  <a href="#">Online Fee Payment</a>
                  <a href="#">Download Prospectus</a>
                  <a href="#">Results / Reports</a>
                </div>
              </div>
              <div className="footer-col">
                <h4>Newsletter</h4>
                <p style={{ fontSize:"0.84rem", color:"rgba(255,255,255,0.4)", marginBottom:"1rem" }}>Get latest news, events & updates directly in your inbox.</p>
                <div className="footer-newsletter">
                  <input type="email" placeholder="Enter your email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} />
                  <button className="btn btn-gold" style={{ width:"100%", justifyContent:"center", fontSize:"0.85rem", padding:"0.75rem" }}>Subscribe →</button>
                </div>
                <div style={{ marginTop:"1.5rem", display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                  <a href="#" style={{ display:"flex", alignItems:"center", gap:"0.5rem", fontSize:"0.83rem", color:"rgba(255,255,255,0.4)" }}><span>📄</span>Privacy Policy</a>
                  <a href="#" style={{ display:"flex", alignItems:"center", gap:"0.5rem", fontSize:"0.83rem", color:"rgba(255,255,255,0.4)" }}><span>📋</span>Terms & Conditions</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="footer-bottom">
            <p>© 2025 Abhay Nobles. All rights reserved. | Designed with ♥ for Excellence</p>
            <div className="footer-bottom-links">
              {["Privacy","Terms","Sitemap","Careers"].map(l => <a key={l} href="#">{l}</a>)}
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float */}
      <div className="whatsapp-float">
        <a href="https://wa.me/919928613702" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">💬</a>
      </div>

      {/* Gallery Lightbox */}
      {lightbox && (
        <div className="gallery-lightbox open" onClick={closeLightbox}>
          <div className="gallery-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-lightbox-close" onClick={closeLightbox}>×</button>
            <img src={lightbox.src} alt={lightbox.alt} />
          </div>
        </div>
      )}
    </div>
  );
}
