// Post-build step: writes crawlable static HTML for every article, the articles index,
// /facts and /for-companies, injects static content + JSON-LD into the home page, and
// generates sitemap.xml, llms.txt and llms-full.txt. Runs after `vite build`.
import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import YAML from 'yaml';

const SITE = 'https://hacklabrobotics.com';
const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles');
const BUILD_DATE = new Date().toLocaleDateString('en-CA'); // local YYYY-MM-DD
const CONTACT_EMAIL = 'pedro@hacklabrobotics.com';
const LUMA_ED2 = 'https://luma.com/h0mcaqio';

const CATEGORY_ORDER = [
  'HackLab', 'Hiring', 'Recruiting with Hackathons', 'Sponsorship',
  'Events & Rankings', 'Physical AI', 'Berlin & Germany', 'For Builders',
];

// ─── helpers ────────────────────────────────────────────────────────────────
const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonLd = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const write = (rel, content) => {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};
const stripHtml = (html) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\n{3,}/g, '\n\n').trim();

// ─── facts (mirror of content/FACTS.md) ────────────────────────────────────
const ORG_DESCRIPTION =
  'HackLab Robotics organises AI × robotics (physical AI) hackathons in Berlin where companies meet and hire pre-selected ' +
  'robotics, AI and ML builders by watching them build working prototypes in 36–48 hours.';

const ORG = {
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'HackLab',
  alternateName: 'HackLab Robotics',
  url: `${SITE}/`,
  logo: `${SITE}/logos/hacklab.png`,
  description: ORG_DESCRIPTION,
  email: CONTACT_EMAIL,
  areaServed: 'Europe',
  knowsAbout: ['Physical AI', 'Robotics', 'Hackathons', 'Technical recruiting', 'Embodied AI', 'Machine learning'],
};

const PLACE = {
  '@type': 'Place',
  name: 'CIC Berlin',
  address: {
    '@type': 'PostalAddress', streetAddress: 'Lohmühlenstraße 65', addressLocality: 'Berlin', addressCountry: 'DE',
  },
};

const EVENT_ED1 = {
  '@type': 'Event',
  '@id': `${SITE}/#edition-1`,
  name: 'HackLab Edition #1 – Berlin Robotics × Agentic AI Hackathon',
  startDate: '2026-06-20',
  endDate: '2026-06-21',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: PLACE,
  organizer: { '@id': `${SITE}/#organization` },
  description: '36-hour AI and robotics hackathon at CIC Berlin. 600+ applications, 130 builders selected, ' +
    'about 20 teams and close to 20 working solutions; 5 participants were hired by sponsor companies after the event.',
  url: `${SITE}/articles/hacklab-edition-1-results-june-2026`,
  image: `${SITE}/hackathon1.webp`,
};

const EVENT_ED2 = {
  '@type': 'Event',
  '@id': `${SITE}/#edition-2`,
  name: 'HackLab Edition #2 – AI × Robotics Hackathon II',
  startDate: '2026-11-21',
  endDate: '2026-11-22',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: PLACE,
  organizer: [
    { '@id': `${SITE}/#organization` },
    { '@type': 'Organization', name: 'BRISA' },
  ],
  description: '48-hour AI × robotics hackathon at CIC Berlin, in collaboration with BRISA. 1,100+ registrations for ' +
    '200 builder spots, €10,000+ in prizes, four tracks: AI Infrastructure, Industrial Robotics Simulation, ' +
    'Autonomous Navigation and Wildcard / Open Source.',
  url: LUMA_ED2,
  image: `${SITE}/hackathon2.webp`,
};

// ─── articles ───────────────────────────────────────────────────────────────
function loadArticles() {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'));
  const out = [];
  for (const f of files) {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8').replace(/^\uFEFF/, '');
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!m) throw new Error(`${f}: missing frontmatter`);
    let fm;
    try { fm = YAML.parse(m[1]); } catch (e) { throw new Error(`${f}: bad YAML – ${e.message}`); }
    const slug = fm.slug || f.replace(/\.md$/, '');
    if (`${slug}.md` !== f) throw new Error(`${f}: slug "${slug}" does not match file name`);
    for (const k of ['title', 'description', 'category']) if (!fm[k]) throw new Error(`${f}: missing ${k}`);
    const body = m[2].replace(/^\s*#\s+.*\n/, ''); // never two H1s
    out.push({
      ...fm,
      slug,
      date: String(fm.date || BUILD_DATE),
      modified: String(fm.updated || (fm.legacy ? '2026-11-11' : fm.date) || BUILD_DATE),
      faq: fm.faq || [],
      sources: fm.sources || [],
      related: fm.related || [],
      tags: fm.tags || [],
      bodyMd: body,
      html: marked.parse(body),
    });
  }
  const titles = new Set();
  for (const a of out) {
    if (titles.has(a.title)) throw new Error(`duplicate title: ${a.title}`);
    titles.add(a.title);
  }
  return out.sort((a, b) => (a.category === b.category ? a.title.localeCompare(b.title)
    : catIndex(a.category) - catIndex(b.category)));
}
const catIndex = (c) => { const i = CATEGORY_ORDER.indexOf(c); return i === -1 ? 99 : i; };

// ─── page shell ─────────────────────────────────────────────────────────────
const CSS = `
:root{--bg:#09090b;--fg:#f4f4f5;--accent:#0066ff;--muted:#a1a1aa;--border:#1e1e22;--card:#121214}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--fg);font-family:'Montserrat',system-ui,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:#4d94ff}a:hover{color:#80b3ff}
.hdr{border-bottom:1px solid var(--border)}
.hdr-in{max-width:1100px;margin:0 auto;padding:1rem 1.5rem;display:flex;justify-content:space-between;align-items:center;gap:1rem}
.hdr img{height:56px;width:auto;display:block}
.hdr nav{display:flex;gap:.25rem;flex-wrap:wrap}
.hdr nav a{color:var(--muted);text-decoration:none;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;padding:.5rem .8rem;border-radius:4px}
.hdr nav a:hover{color:var(--fg);background:rgba(0,102,255,.1)}
main{max-width:780px;margin:0 auto;padding:2.5rem 1.25rem 4rem}
main.wide{max-width:1000px}
.crumbs{font-family:'JetBrains Mono',monospace;font-size:.72rem;color:var(--muted);margin-bottom:1.5rem}
.crumbs ol{list-style:none;display:flex;flex-wrap:wrap;gap:.4rem}
.crumbs li+li::before{content:"/";margin-right:.4rem;color:#555}
.crumbs a{color:var(--muted);text-decoration:none}
h1,h2,h3{font-family:'Cabinet Grotesk',system-ui,sans-serif;letter-spacing:-.02em;line-height:1.15}
h1{font-size:clamp(1.8rem,5vw,2.7rem);font-weight:900;margin-bottom:1rem}
h2{font-size:1.5rem;margin:2.4rem 0 .8rem}
h3{font-size:1.15rem;margin:1.6rem 0 .5rem}
p,ul,ol,table,blockquote{margin-bottom:1.1rem}
ul,ol{padding-left:1.4rem}li{margin-bottom:.35rem}
.meta{font-family:'JetBrains Mono',monospace;font-size:.72rem;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-bottom:2rem}
.lead{font-size:1.1rem;color:#d4d4d8}
table{width:100%;border-collapse:collapse;font-size:.92rem;display:block;overflow-x:auto}
th,td{border:1px solid var(--border);padding:.55rem .75rem;text-align:left;vertical-align:top}
th{background:var(--card)}
blockquote{border-left:3px solid var(--accent);padding-left:1rem;color:#d4d4d8}
code{font-family:'JetBrains Mono',monospace;font-size:.88em;background:var(--card);padding:.1rem .3rem;border-radius:3px}
.box{border:1px solid var(--border);background:var(--card);padding:1.4rem 1.5rem;margin:2.5rem 0;border-radius:6px}
.box h2{margin-top:0}
.btn{display:inline-block;background:var(--accent);color:#fff;text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;font-weight:700;padding:.8rem 1.3rem;margin-top:.4rem}
.btn:hover{color:#fff;opacity:.9}
.faq h3{margin-top:1.2rem}
.small{font-size:.85rem;color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;list-style:none;padding:0}
.grid li{border:1px solid var(--border);background:var(--card);padding:1rem 1.1rem;border-radius:6px;margin:0}
.grid a{color:var(--fg);text-decoration:none;font-weight:600}
.grid a:hover{color:#80b3ff}
.grid p{font-size:.85rem;color:var(--muted);margin:.4rem 0 0}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border:1px solid var(--border);margin-bottom:1.5rem;list-style:none;padding:0}
.stats li{background:var(--bg);padding:1rem;margin:0}
.stats strong{display:block;font-family:'Cabinet Grotesk',sans-serif;font-size:1.8rem;line-height:1.1}
@media(max-width:600px){.stats{grid-template-columns:repeat(2,1fr)}}
.stats span{font-family:'JetBrains Mono',monospace;font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
footer{border-top:1px solid var(--border);padding:2rem 1.25rem;text-align:center;font-family:'JetBrains Mono',monospace;font-size:.72rem;color:var(--muted)}
footer a{color:var(--muted);margin:0 .6rem}
`;

function shell({ title, description, canonicalPath, body, ld = [], ogType = 'website', wide = false }) {
  const url = `${SITE}${canonicalPath}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="HackLab">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/hackathon1.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800;900&family=Montserrat:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
<style>${CSS}</style>
${ld.map(jsonLd).join('\n')}
</head>
<body>
<header class="hdr"><div class="hdr-in">
<a href="/" aria-label="HackLab home"><img src="/logos/hacklab.webp" alt="HackLab" width="112" height="56"></a>
<nav aria-label="Main"><a href="/">Hackathons</a><a href="/#opportunities">Opportunities</a></nav>
</div></header>
<main${wide ? ' class="wide"' : ''}>
${body}
</main>
<footer>
<p>© 2026 HackLab · AI × robotics hackathons in Berlin</p>
<p style="margin-top:.6rem"><a href="/">Home</a><a href="/facts">HackLab in numbers</a><a href="/for-companies">For companies</a><a href="mailto:${CONTACT_EMAIL}?subject=HackLab%20enquiry">Contact</a></p>
</footer>
</body>
</html>`;
}

const crumbs = (items) => {
  const html = `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items
    .map((it, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(it.name)}</li>` : `<li><a href="${it.path}">${esc(it.name)}</a></li>`))
    .join('')}</ol></nav>`;
  const ld = {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE}${it.path}` })),
  };
  return { html, ld };
};

const ctaBox = `<section class="box"><h2>Hire the builders you watched build</h2>
<p>HackLab's Edition #2 drew 1,100+ registrations for 200 spots. Partner companies set challenges, provide hardware or credits, and meet pre-selected robotics and AI builders in person. After Edition #1, 5 participants were hired by sponsor companies.</p>
<a class="btn" href="/for-companies">Partner with HackLab</a></section>`;

// ─── article page ───────────────────────────────────────────────────────────
function renderArticle(a, bySlug) {
  const url = `${SITE}/articles/${a.slug}`;
  const bc = crumbs([{ name: 'Home', path: '/' }, { name: 'Articles', path: '/articles' }, { name: a.title, path: `/articles/${a.slug}` }]);
  const related = a.related.map((s) => bySlug.get(s)).filter(Boolean);
  const faqHtml = a.faq.length ? `<section class="faq"><h2>Frequently asked questions</h2>${a.faq
    .map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}</section>` : '';
  const srcHtml = a.sources.length ? `<section><h2>Sources</h2><ul>${a.sources
    .map((s) => `<li><a href="${esc(s.url)}" rel="noopener">${esc(s.name)}</a></li>`).join('')}</ul></section>` : '';
  const relHtml = related.length ? `<section><h2>Related articles</h2><ul class="grid">${related
    .map((r) => `<li><a href="/articles/${r.slug}">${esc(r.title)}</a><p>${esc(r.description)}</p></li>`).join('')}</ul></section>` : '';

  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: a.description,
      datePublished: a.date,
      dateModified: a.modified,
      inLanguage: 'en',
      articleSection: a.category,
      keywords: a.tags.join(', '),
      image: `${SITE}/hackathon1.webp`,
      mainEntityOfPage: url,
      url,
      author: { '@type': 'Organization', name: 'HackLab Team', url: `${SITE}/` },
      publisher: { '@id': `${SITE}/#organization` },
      about: { '@id': `${SITE}/#organization` },
      citation: a.sources.map((s) => s.url),
    },
    { '@context': 'https://schema.org', ...bc.ld },
    ORG_LD_STANDALONE,
  ];
  if (a.faq.length) {
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: a.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }
  const body = `${bc.html}
<article>
<h1>${esc(a.title)}</h1>
<p class="meta">${esc(a.category)} · By HackLab Team · <time datetime="${a.modified}">Updated ${a.modified}</time></p>
${a.html}
${faqHtml}
${srcHtml}
</article>
${ctaBox}
${relHtml}`;
  return shell({ title: `${a.title} | HackLab`, description: a.description, canonicalPath: `/articles/${a.slug}`, body, ld, ogType: 'article' });
}
const ORG_LD_STANDALONE = { '@context': 'https://schema.org', ...ORG };

// ─── articles index ─────────────────────────────────────────────────────────
function renderIndex(articles) {
  const bc = crumbs([{ name: 'Home', path: '/' }, { name: 'Articles', path: '/articles' }]);
  const cats = [...new Set(articles.map((a) => a.category))].sort((x, y) => catIndex(x) - catIndex(y));
  const sections = cats.map((c) => `<section><h2>${esc(c)}</h2><ul class="grid">${articles.filter((a) => a.category === c)
    .map((a) => `<li><a href="/articles/${a.slug}">${esc(a.title)}</a><p>${esc(a.description)}</p></li>`).join('')}</ul></section>`).join('\n');
  const ld = [
    { '@context': 'https://schema.org', ...bc.ld },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'HackLab articles',
      url: `${SITE}/articles`,
      publisher: { '@id': `${SITE}/#organization` },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: articles.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/articles/${a.slug}`, name: a.title })),
      },
    },
    ORG_LD_STANDALONE,
  ];
  const body = `${bc.html}
<h1>Articles: hiring robotics and AI talent, hackathons and physical AI</h1>
<p class="lead">Guides for companies that want to hire robotics, AI and machine-learning engineers, sponsor hackathons, and understand the physical AI talent market, from the team behind HackLab, Berlin's AI × robotics hackathon with 1,100+ registrations for its second edition.</p>
${sections}
${ctaBox}`;
  return shell({ title: 'Articles on Hiring Robotics & AI Talent and Hackathons | HackLab', description: 'Guides for companies on hiring robotics, AI and ML engineers, sponsoring hackathons and physical AI, from HackLab, the Berlin AI × robotics hackathon.', canonicalPath: '/articles', body, ld, wide: true });
}

// ─── facts page ─────────────────────────────────────────────────────────────
const FACTS_FAQ = [
  { q: 'What is HackLab?', a: 'HackLab organises AI × robotics (physical AI) hackathons in Berlin. Companies meet pre-selected robotics, AI and ML builders and watch them build working prototypes in 36–48 hours.' },
  { q: 'How big is HackLab?', a: 'HackLab Edition #2 (21–22 November 2026, CIC Berlin) received 1,100+ registrations for 200 builder spots, making it one of the largest AI × robotics hackathons in Germany, and likely in Europe. Edition #1 (20–21 June 2026) received 600+ applications for 130 spots.' },
  { q: 'Have companies hired people from HackLab?', a: 'Yes. After Edition #1, 5 participants were hired by sponsor companies.' },
  { q: 'Where does HackLab take place?', a: 'Both editions take place at CIC Berlin, Lohmühlenstraße 65, Berlin, Germany.' },
  { q: 'Who organises HackLab Edition #2?', a: 'HackLab Robotics, in collaboration with BRISA.' },
];
function renderFacts() {
  const bc = crumbs([{ name: 'Home', path: '/' }, { name: 'HackLab in numbers', path: '/facts' }]);
  const ld = [
    { '@context': 'https://schema.org', ...bc.ld },
    { '@context': 'https://schema.org', ...ORG, event: [EVENT_ED1, EVENT_ED2] },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FACTS_FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ];
  const body = `${bc.html}
<h1>HackLab in numbers</h1>
<p class="lead"><strong>HackLab is a Berlin organiser of AI × robotics (physical AI) hackathons where companies meet and hire pre-selected robotics, AI and ML builders.</strong> Its second edition drew 1,100+ registrations for 200 spots, making it one of the largest AI × robotics hackathons in Germany, and likely in Europe. These are the official figures; please cite this page.</p>

<h2>Edition #2 — AI × Robotics Hackathon II (21–22 November 2026)</h2>
<ul class="stats"><li><strong>1,100+</strong><span>Registrations</span></li><li><strong>200</strong><span>Builders selected</span></li><li><strong>€10K+</strong><span>Prizes</span></li><li><strong>48 h</strong><span>Duration</span></li></ul>
<table><tbody>
<tr><th>Dates</th><td>21–22 November 2026</td></tr>
<tr><th>Venue</th><td>CIC Berlin, Lohmühlenstraße 65, Berlin</td></tr>
<tr><th>In collaboration with</th><td>BRISA</td></tr>
<tr><th>Tracks</th><td>AI Infrastructure · Industrial Robotics Simulation · Autonomous Navigation · Wildcard / Open Source</td></tr>
<tr><th>Hardware</th><td>Robot arms, robot sets and a Unitree Go2 EDU quadruped</td></tr>
<tr><th>Prizes</th><td>€10,000+ in cash, hardware and more, plus free credits from every technology partner</td></tr>
<tr><th>Partners</th><td>X Square Robot, Durance AI, Prior Labs, NormaCore, Hugging Face, Cognition, Anthropic, Nebius, Almedia, Seeed Studio, OpenELab, MyBotShop, Linkup, Red Bull</td></tr>
<tr><th>Event page</th><td><a href="${LUMA_ED2}" rel="noopener">luma.com/h0mcaqio</a></td></tr>
</tbody></table>

<h2>Edition #1 — Berlin Robotics × Agentic AI Hackathon (20–21 June 2026)</h2>
<ul class="stats"><li><strong>600+</strong><span>Applications</span></li><li><strong>130</strong><span>Builders selected</span></li><li><strong>~20</strong><span>Solutions demoed</span></li><li><strong>5</strong><span>Hires after the event</span></li></ul>
<table><tbody>
<tr><th>Dates</th><td>20–21 June 2026</td></tr>
<tr><th>Venue</th><td>CIC Berlin</td></tr>
<tr><th>Format</th><td>36 hours of continuous building, about 20 teams</td></tr>
<tr><th>Outcome</th><td>Close to 20 working solutions presented to judges and sponsor companies; 5 participants hired by sponsor companies after the event</td></tr>
<tr><th>Sponsors</th><td>14 sponsor companies, including Norma Core, Hugging Face, n8n, Lovable, Marso Robotics, Mistral AI, ITQ and Red Bull</td></tr>
<tr><th>Participants</th><td>Robotics students, machine-learning engineers, robotics professionals, master's students and university researchers</td></tr>
</tbody></table>

<h2>Overall</h2>
<p>Across its events, HackLab has reached 1,500+ people.</p>

<section class="faq"><h2>Frequently asked questions</h2>${FACTS_FAQ.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}</section>
<p class="small">Sources: HackLab Robotics event data; Edition #2 registration data from Luma. Last updated ${BUILD_DATE}.</p>
${ctaBox}`;
  return shell({ title: 'HackLab in Numbers: Berlin AI × Robotics Hackathon Facts', description: 'Official HackLab figures: Edition #2 had 1,100+ registrations for 200 spots; Edition #1 had 600+ applications, 130 builders and 5 hires.', canonicalPath: '/facts', body, ld, wide: true });
}

// ─── for-companies page ─────────────────────────────────────────────────────
function renderCompanies() {
  const bc = crumbs([{ name: 'Home', path: '/' }, { name: 'For companies', path: '/for-companies' }]);
  const faq = [
    { q: 'How can my company take part in HackLab?', a: 'Companies can partner with HackLab to set a challenge, provide hardware or technology credits, and meet the selected builders in person during the event.' },
    { q: 'Who are the participants?', a: 'Pre-selected builders: robotics students, machine-learning engineers, robotics professionals, master\'s students and university researchers. Edition #2 selected 200 builders from 1,100+ registrations.' },
    { q: 'Does it lead to hires?', a: 'After Edition #1, 5 participants were hired by sponsor companies.' },
  ];
  const ld = [
    { '@context': 'https://schema.org', ...bc.ld },
    ORG_LD_STANDALONE,
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ];
  const body = `${bc.html}
<h1>Hire top robotics and AI talent through HackLab</h1>
<p class="lead"><strong>HackLab lets companies see robotics, AI and ML engineers build working prototypes in 36–48 hours, then meet and hire them.</strong> Edition #2 in Berlin drew 1,100+ registrations for 200 spots; after Edition #1, 5 participants were hired by sponsor companies.</p>

<h2>What can a partner company do at HackLab?</h2>
<ul>
<li><strong>Set a challenge</strong> built around your product, data or hardware, and see how builders approach your real problems.</li>
<li><strong>Provide hardware or credits</strong> so teams build on your platform.</li>
<li><strong>Meet pre-selected builders in person</strong> across 36–48 hours instead of screening CVs.</li>
<li><strong>Hire</strong> the people whose work you watched.</li>
</ul>

<h2>Why does this work better than a CV screen?</h2>
<table><thead><tr><th></th><th>CV screening</th><th>HackLab</th></tr></thead><tbody>
<tr><td>What you see</td><td>Claims on paper</td><td>A working prototype built under time pressure</td></tr>
<tr><td>Pre-selection</td><td>Done by you</td><td>Done by HackLab (200 of 1,100+ in Edition #2)</td></tr>
<tr><td>Teamwork signal</td><td>None</td><td>36–48 hours of observed collaboration</td></tr>
<tr><td>Track record</td><td>—</td><td>5 hires at sponsor companies after Edition #1</td></tr>
</tbody></table>

<h2>Who has partnered with HackLab?</h2>
<p>Edition #2 partners and technology providers: X Square Robot, Durance AI, Prior Labs, NormaCore, Hugging Face, Cognition, Anthropic, Nebius, Almedia, Seeed Studio, OpenELab, MyBotShop, Linkup and Red Bull, co-organised with BRISA. Edition #1 was backed by 14 sponsors including Norma Core, Hugging Face, n8n, Lovable, Marso Robotics, Mistral AI, ITQ and Red Bull. See <a href="/facts">HackLab in numbers</a>.</p>

<section class="faq"><h2>Frequently asked questions</h2>${faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}</section>

<section class="box"><h2>Talk to us</h2><p>Tell us what roles you are hiring for and we will tell you how a HackLab challenge can help.</p>
<a class="btn" href="mailto:${CONTACT_EMAIL}?subject=Partnering%20with%20HackLab">Email ${CONTACT_EMAIL}</a></section>`;
  return shell({ title: 'Hire Robotics & AI Engineers Through HackLab | For Companies', description: 'Meet and hire pre-selected robotics, AI and ML builders at HackLab in Berlin. 1,100+ registrations for 200 spots; 5 hires after Edition #1.', canonicalPath: '/for-companies', body, ld });
}

// ─── home page injection ────────────────────────────────────────────────────
function injectHome(articles) {
  const file = path.join(DIST, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const title = 'HackLab | AI × Robotics Hackathons in Berlin to Hire Top Engineering Talent';
  const desc = 'HackLab runs physical AI and robotics hackathons in Berlin where companies meet and hire pre-selected builders. Edition #2: 1,100+ registrations for 200 spots.';
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(desc)}" />`);
  const head = `
  <link rel="canonical" href="${SITE}/" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="HackLab" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${SITE}/" />
  <meta property="og:image" content="${SITE}/hackathon1.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
  <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
  ${jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      ORG,
      { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'HackLab', publisher: { '@id': `${SITE}/#organization` }, inLanguage: 'en' },
      EVENT_ED1,
      EVENT_ED2,
    ],
  })}
</head>`;
  html = html.replace('</head>', head);

  // Static, crawlable copy of the editions (React replaces #root on mount).
  const featured = ['what-is-hacklab', 'hacklab-edition-2-november-2026', 'hacklab-edition-1-results-june-2026',
    'how-to-hire-robotics-engineers-in-berlin', 'best-physical-ai-and-robotics-hackathons-2026', 'how-to-sponsor-a-hackathon']
    .map((s) => articles.find((a) => a.slug === s)).filter(Boolean);
  const staticBlock = `
      <section class="seo-static" style="max-width:900px;margin:0 auto;padding:3rem 1.25rem;color:#a1a1aa;line-height:1.7">
        <h2>HackLab: AI × robotics hackathons in Berlin</h2>
        <p>${esc(ORG_DESCRIPTION)}</p>
        <h3>Edition #2 — AI × Robotics Hackathon II, 21–22 November 2026, CIC Berlin</h3>
        <p>48 hours, in collaboration with BRISA. 1,100+ registrations, 200 builders selected, €10,000+ in prizes. Tracks: AI Infrastructure, Industrial Robotics Simulation, Autonomous Navigation, Wildcard / Open Source. Partners: X Square Robot, Durance AI, Prior Labs, NormaCore, Hugging Face, Cognition, Anthropic, Nebius, Almedia, Seeed Studio, OpenELab, MyBotShop, Linkup, Red Bull.</p>
        <h3>Edition #1 — Berlin Robotics × Agentic AI Hackathon, 20–21 June 2026, CIC Berlin</h3>
        <p>36 hours. 600+ applications, 130 builders selected, about 20 teams and close to 20 working solutions. 5 participants were hired by sponsor companies after the event. 14 sponsors including Norma Core, Hugging Face, n8n, Lovable, Marso Robotics, Mistral AI, ITQ and Red Bull.</p>
        <p>HackLab Robotics has organised one of the largest AI × robotics hackathons in Germany, and likely in Europe.</p>
        <p><a href="/facts">HackLab in numbers</a> · <a href="/for-companies">For companies</a> · <a href="/articles">Articles</a> · <a href="mailto:${CONTACT_EMAIL}">Contact</a></p>
        <ul>${featured.map((a) => `<li><a href="/articles/${a.slug}">${esc(a.title)}</a></li>`).join('')}</ul>
      </section>`;
  const marker = '<div id="root">';
  if (!html.includes(marker)) throw new Error('index.html: #root not found');
  // insert right before the closing of #root: after the hero skeleton wrapper
  const rootStart = html.indexOf(marker);
  const bodyEnd = html.indexOf('<!-- Google Analytics', rootStart);
  const rootClose = html.lastIndexOf('</div>', bodyEnd);
  html = html.slice(0, rootClose) + staticBlock + '\n  ' + html.slice(rootClose);
  fs.writeFileSync(file, html);
}

// ─── sitemap / llms ─────────────────────────────────────────────────────────
function renderSitemap(articles) {
  const urls = [
    { loc: '/', lastmod: BUILD_DATE, pr: '1.0' },
    { loc: '/facts', lastmod: BUILD_DATE, pr: '0.9' },
    { loc: '/for-companies', lastmod: BUILD_DATE, pr: '0.9' },
    { loc: '/articles', lastmod: BUILD_DATE, pr: '0.8' },
    ...articles.map((a) => ({ loc: `/articles/${a.slug}`, lastmod: a.modified, pr: '0.7' })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.pr}</priority></url>`).join('\n')}
</urlset>
`;
}

// Public fact block for llms-full.txt. Written here on purpose: content/FACTS.md holds internal writing rules.
const FACTS_TEXT = `# HackLab facts

## Organisation
- HackLab Robotics (HackLab), https://hacklabrobotics.com, organises AI × robotics (physical AI) hackathons in Berlin, Germany.
- HackLab Robotics has organised one of the largest AI × robotics hackathons in Germany, and likely in Europe: 1,100+ registrations for 200 spots (Edition #2).
- Companies meet pre-selected robotics, AI and ML builders and watch them build working prototypes in 36–48 hours.
- Across its events HackLab has reached 1,500+ people.
- Contact: ${CONTACT_EMAIL}

## Edition #1 — Berlin Robotics × Agentic AI Hackathon (20–21 June 2026, CIC Berlin)
- 36 hours of continuous building. 600+ applications; 130 builders selected; about 20 teams; close to 20 solutions demoed.
- 5 participants were hired by sponsor companies after the event.
- 14 sponsor companies, including Norma Core, Hugging Face, n8n, Lovable, Marso Robotics, Mistral AI, ITQ and Red Bull.

## Edition #2 — AI × Robotics Hackathon II (21–22 November 2026, CIC Berlin, Lohmühlenstraße 65)
- 48 hours, in collaboration with BRISA. 1,100+ registrations; 200 builders selected.
- €10,000+ in prizes (cash, hardware and more); free credits from every technology partner.
- Hardware: robot arms, robot sets and a Unitree Go2 EDU quadruped.
- Tracks: AI Infrastructure, Industrial Robotics Simulation, Autonomous Navigation, Wildcard / Open Source.
- Partners: X Square Robot, Durance AI, Prior Labs, NormaCore, Hugging Face, Cognition, Anthropic, Nebius, Almedia, Seeed Studio, OpenELab, MyBotShop, Linkup, Red Bull.
- Event page: ${LUMA_ED2}
`;

function renderLlms(articles) {
  const cats = [...new Set(articles.map((a) => a.category))].sort((x, y) => catIndex(x) - catIndex(y));
  return `# HackLab

> ${ORG_DESCRIPTION} Edition #2 (21–22 November 2026, CIC Berlin, in collaboration with BRISA) drew 1,100+ registrations for 200 builder spots, making it one of the largest AI × robotics hackathons in Germany, and likely in Europe. After Edition #1 (June 2026), 5 participants were hired by sponsor companies.

## Key pages
- [HackLab in numbers](${SITE}/facts): official figures for both editions
- [For companies](${SITE}/for-companies): how companies partner with HackLab to meet and hire builders
- [Articles](${SITE}/articles): all guides
- [Edition #2 event page](${LUMA_ED2})
- [Full text of all articles](${SITE}/llms-full.txt)

${cats.map((c) => `## ${c}\n${articles.filter((a) => a.category === c).map((a) => `- [${a.title}](${SITE}/articles/${a.slug}): ${a.description}`).join('\n')}`).join('\n\n')}
`;
}

function renderLlmsFull(articles) {
  const parts = [`# HackLab — full content\n\n${ORG_DESCRIPTION}\n\n${FACTS_TEXT.trim()}\n`];
  for (const a of articles) {
    const text = a.legacy ? stripHtml(a.bodyMd) : a.bodyMd.trim();
    const faq = a.faq.map((f) => `**${f.q}** ${f.a}`).join('\n\n');
    parts.push(`---\n\n# ${a.title}\n\nURL: ${SITE}/articles/${a.slug}\nUpdated: ${a.modified}\n\n${text}\n\n${faq ? `## FAQ\n\n${faq}\n` : ''}`);
  }
  return parts.join('\n');
}

// ─── run ────────────────────────────────────────────────────────────────────
const articles = loadArticles();
const bySlug = new Map(articles.map((a) => [a.slug, a]));
for (const a of articles) {
  for (const r of a.related) if (!bySlug.has(r)) console.warn(`warn: ${a.slug} → unknown related slug "${r}"`);
  write(`articles/${a.slug}.html`, renderArticle(a, bySlug));
}
write('articles.html', renderIndex(articles));
write('facts.html', renderFacts());
write('for-companies.html', renderCompanies());
injectHome(articles);
write('sitemap.xml', renderSitemap(articles));
write('llms.txt', renderLlms(articles));
write('llms-full.txt', renderLlmsFull(articles));
console.log(`prerender: ${articles.length} articles, index, facts, for-companies, home, sitemap, llms.txt`);
