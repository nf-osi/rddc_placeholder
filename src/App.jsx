import './App.css'
import NetworkBackground from './NetworkBackground'

function App() {
  return (
    <div className="app">
      <NetworkBackground />
      <a href="#main" className="skip-to-main">
        Skip to main content
      </a>

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
