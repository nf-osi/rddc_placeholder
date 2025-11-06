# Rare Disease Data Commons - Landing Page

A modern, accessible landing page for the Rare Disease Data Commons, built with React and Vite.

## Overview

This landing page serves as a temporary placeholder site to inform visitors about the Rare Disease Data Commons initiative, which aims to cut the diagnostic odyssey in half and begin a new era of diagnosis and treatment for people living with rare or undiagnosed conditions.

## Features

- **Modern Dark Theme**: Sophisticated, cutting-edge design inspired by leading biotech and AI organizations
- **Fully Accessible**: WCAG 2.1 AA compliant with keyboard navigation, screen reader support, and semantic HTML
- **Responsive Design**: Optimized for all device sizes from mobile to desktop
- **Lightweight & Fast**: Built with React + Vite for optimal performance
- **Ready for Expansion**: Structured for easy addition of newsletter signup and other interactive features

## Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **CSS3** - Custom styling with modern features (CSS Grid, Flexbox, CSS Variables)
- **ES6+** - Modern JavaScript

## Development

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev
```

The site will be available at `http://localhost:5173`

### Building for Production

```bash
# Create production build
npm run build
```

The optimized build will be in the `dist` directory.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## Deployment to GitHub Pages

GitHub Pages is a free and simple way to host your static site directly from a GitHub repository.

### Prerequisites

- A GitHub account
- Your project pushed to a GitHub repository

### Setup Steps

1. **Update `vite.config.js` with your repository base path:**

   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/', // Replace with your repository name
     build: {
       outDir: 'dist',
       assetsDir: 'assets',
     },
   })
   ```

   For example, if your repo is `https://github.com/username/rddc_placeholder`, set `base: '/rddc_placeholder/'`

2. **Build the project:**

   ```bash
   npm run build
   ```

3. **Deploy using one of these methods:**

   #### Option A: Using gh-pages package (Recommended)

   ```bash
   # Install gh-pages
   npm install --save-dev gh-pages

   # Add deploy script to package.json
   # Add this to the "scripts" section:
   # "deploy": "npm run build && gh-pages -d dist"

   # Deploy
   npm run deploy
   ```

   #### Option B: Manual deployment

   ```bash
   # Push the dist folder to gh-pages branch
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

   #### Option C: GitHub Actions (Automated)

   Create `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '20'
         - run: npm ci
         - run: npm run build
         - uses: actions/upload-pages-artifact@v3
           with:
             path: './dist'

     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - uses: actions/deploy-pages@v4
           id: deployment
   ```

4. **Configure GitHub Pages in your repository:**

   - Go to your repository on GitHub
   - Click **Settings** > **Pages**
   - Under "Source", select:
     - **Branch**: `gh-pages` (for Options A & B) or `GitHub Actions` (for Option C)
     - **Folder**: `/ (root)`
   - Click **Save**

5. **Access your site:**

   Your site will be available at:
   ```
   https://username.github.io/your-repo-name/
   ```

### Updating the Deployment

For Option A (gh-pages):
```bash
npm run deploy
```

For Option B (manual):
```bash
npm run build
git add dist -f
git commit -m "Update GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

For Option C (GitHub Actions):
Just push to the main branch and the action will automatically deploy.

### Troubleshooting

- **404 errors**: Make sure the `base` in `vite.config.js` matches your repository name
- **Assets not loading**: Verify that all asset paths are relative or use the correct base path
- **Page not updating**: Clear your browser cache and check if the gh-pages branch was updated

## Deployment to EC2

### Option 1: Serve with Nginx (Recommended)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Copy the `dist` folder to your EC2 instance:**
   ```bash
   scp -r dist/* user@your-ec2-ip:/var/www/rddc
   ```

3. **Configure Nginx** (`/etc/nginx/sites-available/rddc`):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/rddc;
       index index.html;

       # Enable gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **Enable the site and restart Nginx:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/rddc /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Option 2: Serve with Node.js

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Install a static file server:**
   ```bash
   npm install -g serve
   ```

3. **Run the server:**
   ```bash
   serve -s dist -l 3000
   ```

4. **Use PM2 to keep it running:**
   ```bash
   npm install -g pm2
   pm2 start "serve -s dist -l 3000" --name rddc
   pm2 save
   pm2 startup
   ```

### Option 3: Automated Deployment Script

Create a `deploy.sh` script:

```bash
#!/bin/bash
set -e

echo "Building application..."
npm run build

echo "Deploying to EC2..."
rsync -avz --delete dist/ user@your-ec2-ip:/var/www/rddc/

echo "Deployment complete!"
```

Make it executable and run:
```bash
chmod +x deploy.sh
./deploy.sh
```

## Security Considerations for EC2

1. **Set up HTTPS with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

2. **Configure firewall:**
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

3. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

## Customization

### Updating Content

- **Hero Section**: Edit the main title and description in `src/App.jsx` (lines 31-42)
- **Statistics**: Modify the stats cards in `src/App.jsx` (lines 55-71)
- **Mission Text**: Update mission content in `src/App.jsx` (lines 79-97)
- **Features**: Edit or add feature cards in `src/App.jsx` (lines 105-166)

### Styling

- **Colors**: Modify CSS variables in `src/index.css` (lines 10-30)
- **Typography**: Adjust font settings in `src/index.css` (lines 32-40)
- **Spacing**: Update spacing variables in `src/index.css` (lines 42-49)

### Adding Newsletter Signup

To integrate a newsletter service:

1. Choose a provider (Mailchimp, SendGrid, ConvertKit, etc.)
2. Replace the disabled button in `src/App.jsx` (lines 180-186) with an active form
3. Add form handling logic with your provider's API

## Accessibility Features

- Semantic HTML structure
- ARIA labels and landmarks
- Skip-to-main-content link
- Keyboard navigation support
- Focus visible indicators
- Sufficient color contrast ratios
- Responsive text sizing
- Reduced motion support

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

The production build is optimized with:
- Code splitting
- Minification
- Asset optimization
- Lazy loading
- Efficient caching strategies

Typical performance metrics:
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Total bundle size: < 100KB gzipped

## License

See [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback: [hi@rdc.bio](mailto:hi@rdc.bio)
