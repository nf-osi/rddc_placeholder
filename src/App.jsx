import './App.css'

function App() {
  return (
    <div className="app">
      <a href="#main" className="skip-to-main">
        Skip to main content
      </a>

      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav" role="navigation" aria-label="Main navigation">
            <a href="/" className="logo">
              <span className="logo-accent">RDC</span> Data Commons
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main id="main">
        {/* Hero Section */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <div className="hero-content">
              <span className="hero-eyebrow">Transforming Rare Disease Research</span>
              <h1 id="hero-title" className="hero-title">
                <span className="text-gradient">
                  Let's begin a new era
                </span>{' '}
                of diagnosis and treatment
              </h1>
              <p className="hero-description">
                We're building a comprehensive data commons to accelerate research and
                cut the diagnostic odyssey in half for people living with rare or
                undiagnosed conditions.
              </p>
              <div className="hero-actions">
                <a href="#contact" className="button button-primary">
                  Get Updates
                </a>
                <a href="#mission" className="button button-secondary">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats" aria-label="Key statistics">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">50%</div>
                <div className="stat-label">Reduction in diagnostic time</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">400M+</div>
                <div className="stat-label">People with rare diseases worldwide</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">10,000+</div>
                <div className="stat-label">Known rare diseases</div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="mission" aria-labelledby="mission-title">
          <div className="container">
            <div className="mission-content">
              <h2 id="mission-title" className="section-title">
                Our Mission
              </h2>
              <p className="mission-text">
                The journey to diagnosis for rare disease patients often takes years,
                involving countless specialists and tests. We're changing that by creating
                a unified, AI-ready data commons that brings together researchers, clinicians,
                data scientists, and AI innovators.
              </p>
              <p className="mission-text">
                By democratizing access to high-quality rare disease data, we're
                accelerating discovery and bringing hope to millions of families
                seeking answers.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features" aria-labelledby="features-title">
          <div className="container">
            <h2 id="features-title" className="section-title" style={{ textAlign: 'center' }}>
              Built for the Future
            </h2>
            <div className="features-grid">
              <article className="feature-card">
                <div className="feature-icon" aria-hidden="true">🧬</div>
                <h3 className="feature-title">Comprehensive Data</h3>
                <p className="feature-description">
                  Integrating genomic, clinical, and phenotypic data from diverse
                  sources to create a holistic view of rare diseases.
                </p>
              </article>
              <article className="feature-card">
                <div className="feature-icon" aria-hidden="true">🤖</div>
                <h3 className="feature-title">AI-Ready Infrastructure</h3>
                <p className="feature-description">
                  Purpose-built for machine learning and AI research, enabling
                  breakthrough discoveries in diagnosis and treatment.
                </p>
              </article>
              <article className="feature-card">
                <div className="feature-icon" aria-hidden="true">🔐</div>
                <h3 className="feature-title">Secure & Compliant</h3>
                <p className="feature-description">
                  Privacy-first architecture ensuring patient data protection while
                  enabling collaborative research.
                </p>
              </article>
              <article className="feature-card">
                <div className="feature-icon" aria-hidden="true">🌐</div>
                <h3 className="feature-title">Open Collaboration</h3>
                <p className="feature-description">
                  Fostering a global community of researchers, clinicians, and
                  patients working together toward better outcomes.
                </p>
              </article>
              <article className="feature-card">
                <div className="feature-icon" aria-hidden="true">⚡</div>
                <h3 className="feature-title">High Performance</h3>
                <p className="feature-description">
                  Lightning-fast data access and analysis tools designed for
                  large-scale computational research.
                </p>
              </article>
              <article className="feature-card">
                <div className="feature-icon" aria-hidden="true">📊</div>
                <h3 className="feature-title">Rich Analytics</h3>
                <p className="feature-description">
                  Advanced visualization and analysis capabilities to uncover
                  patterns and accelerate insights.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="cta" aria-labelledby="cta-title">
          <div className="container">
            <div className="cta-card">
              <h2 id="cta-title" className="cta-title">
                Join Us in Transforming Rare Disease Research
              </h2>
              <p className="cta-description">
                Stay updated on our progress and be the first to know when we launch.
              </p>
              <div className="cta-actions">
                <a
                  href="mailto:hi@rdc.bio"
                  className="button button-primary email-link"
                  aria-label="Send email to hi@rdc.bio"
                >
                  <span aria-hidden="true">✉️</span> hi@rdc.bio
                </a>
                <button
                  className="button button-secondary"
                  aria-label="Sign up for newsletter (coming soon)"
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                >
                  Newsletter Signup (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p className="footer-text">
              &copy; {new Date().getFullYear()} Rare Disease Data Commons. All rights reserved.
            </p>
            <div className="footer-links">
              <a href="mailto:hi@rdc.bio">Contact</a>
              <a href="#mission">About</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
