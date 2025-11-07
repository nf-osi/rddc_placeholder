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
            <div className="hero-card">
              <div className="hero-content">
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
                  <a
                    href="mailto:hi@rdc.bio"
                    className="button button-primary email-link"
                    aria-label="Send email to hi@rdc.bio"
                  >
                    hi@rdc.bio
                  </a>
                  <a
                    href="https://mailchi.mp/e23503f9ecc7/rddc-updates"
                    className="button button-secondary"
                    aria-label="Sign up for newsletter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Newsletter Signup
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
