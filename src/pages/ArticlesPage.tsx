import { useState, useEffect } from 'react';
import { ARTICLES_DATA, type Article } from '../data/articlesData';
import { ArrowRight, ArrowLeft, BookOpen, ShieldCheck, Quote, HelpCircle } from 'lucide-react';

export default function ArticlesPage({
  onRegisterClick,
  onLegalClick
}: {
  onRegisterClick?: () => void;
  onLegalClick?: (key: 'privacy' | 'cookies' | 'legal') => void;
}) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Inject JSON-LD Schema for selected article or for article list to maximize GEO indexing
  useEffect(() => {
    const existingScript = document.getElementById('geo-article-schema');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'geo-article-schema';
    script.type = 'application/ld+json';

    if (selectedArticle) {
      const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': selectedArticle.title,
        'description': selectedArticle.excerpt,
        'author': {
          '@type': 'Person',
          'name': selectedArticle.author,
          'jobTitle': selectedArticle.authorRole
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'HackLab Robotics',
          'logo': 'https://hacklabrobotics.com/logos/hacklab.webp'
        },
        'datePublished': selectedArticle.date,
        'mainEntity': {
          '@type': 'FAQPage',
          'mainEntity': selectedArticle.paaQuestions.map(q => ({
            '@type': 'Question',
            'name': q.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': q.answer
            }
          }))
        }
      };
      script.text = JSON.stringify(schemaData);
    } else {
      const schemaListData = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'itemListElement': ARTICLES_DATA.map((art, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'Article',
            'name': art.title,
            'description': art.excerpt,
            'url': `https://hacklabrobotics.com/articles#${art.slug}`
          }
        }))
      };
      script.text = JSON.stringify(schemaListData);
    }
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById('geo-article-schema');
      if (s) s.remove();
    };
  }, [selectedArticle]);

  return (
    <div className="brutal-wrapper" style={{ paddingBottom: '4rem' }}>
      
      {/* HEADER BAR */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'rgba(18, 18, 20, 0.6)', padding: '1.25rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen size={22} style={{ color: 'var(--accent)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.1em', color: 'var(--fg)', textTransform: 'uppercase' }}>
              Articles & Insights
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        
        {/* ARTICLE DETAIL VIEW */}
        {selectedArticle ? (
          <div>
            <button
              onClick={() => {
                setSelectedArticle(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: '1px solid var(--border)',
                color: 'var(--fg)',
                padding: '0.6rem 1.2rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                marginBottom: '2rem'
              }}
            >
              <ArrowLeft size={16} /> BACK TO ARTICLES
            </button>

            {/* ARTICLE HEADER */}
            <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span className="brutal-mono-tag">{selectedArticle.category}</span>
                {selectedArticle.tags.map((t, idx) => (
                  <span key={idx} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--muted)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    #{t}
                  </span>
                ))}
              </div>

              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem', color: 'var(--fg)' }}>
                {selectedArticle.titleEn || selectedArticle.title}
              </h1>

              <p style={{ fontSize: '1.1rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '850px' }}>
                {selectedArticle.excerptEn || selectedArticle.excerpt}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--muted)', flexWrap: 'wrap' }}>
                <div>
                  <strong style={{ color: 'var(--fg)' }}>{selectedArticle.author}</strong> ({selectedArticle.authorRole})
                </div>
                <div>•</div>
                <div>{selectedArticle.date}</div>
                <div>•</div>
                <div>{selectedArticle.readTime}</div>
              </div>
            </div>

            {/* STATISTICS GRID */}
            {selectedArticle.statistics && selectedArticle.statistics.length > 0 && (
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.75rem', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <ShieldCheck size={20} style={{ color: 'var(--accent)' }} />
                  <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', color: 'var(--fg)' }}>
                    VERIFIED STATISTICS & DATA
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                  {selectedArticle.statistics.map((st, i) => (
                    <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '6px' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent)', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>
                        {st.value}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--fg)', marginBottom: '0.4rem' }}>
                        {st.label}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                        {st.context}
                      </div>
                      {st.source && (
                        <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', opacity: 0.9 }}>
                          Source: {st.source}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ARTICLE BODY */}
            <style>{`.article-body-content p { margin-bottom: 1.5em; }`}</style>
            <div
              className="article-body-content"
              dangerouslySetInnerHTML={{ 
                __html: selectedArticle.contentHtmlEn || selectedArticle.contentHtml
              }}
              style={{ lineHeight: 1.8, fontSize: '1rem', color: '#d1d1d6', marginBottom: '3rem' }}
            />

            {/* CITATIONS & TESTIMONIALS */}
            {selectedArticle.citations && selectedArticle.citations.length > 0 && (
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Quote size={20} style={{ color: 'var(--accent)' }} />
                  Citations & Testimonials
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedArticle.citations.map((c, i) => (
                    <div key={i} style={{ borderLeft: '4px solid var(--accent)', background: 'var(--card-bg)', padding: '1.25rem 1.5rem', borderRadius: '0 8px 8px 0' }}>
                      <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--fg)', margin: '0 0 0.75rem 0', lineHeight: 1.6 }}>
                        "{c.quote}"
                      </p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                        <strong style={{ color: 'var(--accent)' }}>{c.author}</strong> {c.role && `— ${c.role}`} {c.organization && <span>, {c.organization}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FIRST PERSON EXPERIENCE NOTE REMOVED */}

            {/* PEOPLE ALSO ASK BLOCK */}
            {selectedArticle.paaQuestions && selectedArticle.paaQuestions.length > 0 && (
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.75rem', marginBottom: '3rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={20} style={{ color: 'var(--accent)' }} />
                  Frequently Asked Questions
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedArticle.paaQuestions.map((paa, idx) => (
                    <div key={idx} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '6px' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--fg)', margin: '0 0 0.5rem 0' }}>
                        {paa.question}
                      </h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
                        {paa.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NAMED SOURCES FOOTER */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              {selectedArticle.namedSources && selectedArticle.namedSources.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
                    NAMED SOURCES CITED IN THIS ARTICLE:
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {selectedArticle.namedSources.map((ns, idx) => (
                      <span key={idx} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', color: 'var(--fg)' }}>
                        {ns.name} {ns.year && `(${ns.year})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {onRegisterClick && (
                <button className="brutal-primary-btn" onClick={onRegisterClick}>
                  JOIN HACKLAB <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ARTICLES LIST VIEW */
          <div>
            {/* HERO SECTION */}
            <div style={{ marginBottom: '3rem', textTransform: 'uppercase' }}>
              <span className="brutal-mono-tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                ARTICLES & INSIGHTS 2026
              </span>
              <h1 className="brutal-huge-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>
                ARTICLES & RESEARCH<br />
                <span className="brutal-accent-text">ROBOTICS, AI & CAREERS</span>
              </h1>
              <p className="brutal-lead-text" style={{ maxWidth: '750px' }}>
                Insights on robotics careers, AI hackathons, and verifiable credentials.
              </p>
            </div>

            {/* FEATURED STATS BANNER */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '8px' }}>
                <div style={{ color: 'var(--accent)', fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>9</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600 }}>Research Reports</div>
              </div>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '8px' }}>
                <div style={{ color: 'var(--accent)', fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>85%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600 }}>HackLab Finalist Placement</div>
              </div>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '8px' }}>
                <div style={{ color: 'var(--accent)', fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>600+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600 }}>Berlin Edition Applicants</div>
              </div>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '8px' }}>
                <div style={{ color: 'var(--accent)', fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>&lt;90s</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600 }}>Certificate Verification</div>
              </div>
            </div>

            {/* ARTICLES LIST GRID */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {ARTICLES_DATA.map((article, index) => (
                <div
                  key={article.id}
                  onClick={() => {
                    setSelectedArticle(article);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '1.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  className="article-card-hover"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="brutal-mono-tag">ARTICLE #{index + 1}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {article.category}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                      {article.readTime}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--fg)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                    {article.titleEn || article.title}
                  </h2>

                  <p style={{ fontSize: '0.92rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1.25rem', maxWidth: '900px' }}>
                    {article.excerptEn || article.excerpt}
                  </p>

                  {/* KEY STAT PREVIEW */}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {article.statistics.slice(0, 2).map((st, i) => (
                      <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                        <strong style={{ color: 'var(--accent)' }}>{st.value}</strong> <span style={{ color: 'var(--fg)' }}>{st.label}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                      By <strong style={{ color: 'var(--fg)' }}>{article.author}</strong> • {article.date}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                      READ FULL ARTICLE <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="brutal-footer" style={{ marginTop: '4rem' }}>
        <div className="brutal-footer-inner">
          {onLegalClick && (
            <div className="brutal-footer-links">
              <button onClick={() => onLegalClick('privacy')}>Privacy Policy</button>
              <button onClick={() => onLegalClick('cookies')}>Cookies Policy</button>
              <button onClick={() => onLegalClick('legal')}>Legal Notice</button>
            </div>
          )}
          <div className="brutal-footer-copy">
            © 2026 HackLab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
