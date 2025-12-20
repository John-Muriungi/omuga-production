# Website Performance Optimization Guide

## ✅ Implemented Optimizations

### 1. **Preconnect to CDNs**

- Added `rel="preconnect"` to CDN domains (jsdelivr.net, fonts.googleapis.com, fonts.gstatic.com)
- Establishes DNS lookup and connection early, speeding up resource loading

### 2. **Deferred Script Loading**

- All scripts now use `defer` attribute
- Prevents render-blocking JavaScript
- Scripts execute after DOM is parsed, but before `DOMContentLoaded`
- Improves Largest Contentful Paint (LCP) metric

### 3. **Font Display Optimization**

- Google Fonts use `display=swap`
- Ensures text renders immediately with fallback font
- Prevents Flash of Invisible Text (FOIT)

### 4. **Consolidated Font Links**

- Single Google Fonts API call instead of multiple
- Reduces HTTP requests

---

## 🚀 Additional Optimization Recommendations

### **Image Optimization** (High Priority)

```html
<!-- Add to gallery items and hero images -->
<img
  src="image.jpg"
  alt="Description"
  loading="lazy"
  width="800"
  height="600"
/>
```

- Use `loading="lazy"` for below-the-fold images
- Add explicit `width` and `height` to prevent layout shift
- Consider WebP format with fallback: `<picture>` element

### **CSS Minification**

- Minify `style.css` and `dark-mode.css` in production
- Tools: cssnano, clean-css, or online minifiers
- Expected savings: ~20-30% file size reduction

### **JavaScript Minification**

- Minify `main.js`, `gallery.js`, `contact.js`
- Tools: uglify-js, terser
- Expected savings: ~30-40% file size reduction

### **Enable GZIP Compression**

- Configure on your server (.htaccess for Apache, nginx config)
- Compresses text files 60-80%
- Add this to `.htaccess`:
  ```apache
  <IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/json
  </IfModule>
  ```

### **Cache Headers** (.htaccess)

```apache
<FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
<FilesMatch "\.html$">
  Header set Cache-Control "max-age=3600, public"
</FilesMatch>
```

### **Remove Unused CSS**

- Audit Bootstrap - you likely use only 20-30% of it
- Consider replacing with custom minimal CSS framework
- Tools: PurgeCSS, UnCSS

### **Lazy Load Masonry Library**

- Only load masonry on gallery.html (already deferred)
- Consider loading it only when gallery is visible

### **Hero Image Optimization**

- Current: Inline background image
- Better: Use `<picture>` with responsive images
- Add `background-size: cover; background-position: center;` to CSS

### **CDN Usage for Images**

- Serve images from CDN (Cloudinary, ImageKit, etc.)
- Automatic format conversion (WebP, AVIF)
- Responsive image sizing

### **Critical CSS Inlining** (Advanced)

- Identify critical CSS for above-the-fold content
- Inline in `<head>` for faster First Paint
- Load remaining CSS async

---

## 📊 Performance Metrics to Monitor

1. **First Contentful Paint (FCP)** - Target: < 1.8s
2. **Largest Contentful Paint (LCP)** - Target: < 2.5s
3. **Cumulative Layout Shift (CLS)** - Target: < 0.1
4. **First Input Delay (FID)** - Target: < 100ms

**Tools:**

- Google PageSpeed Insights
- WebPageTest.org
- Chrome DevTools Lighthouse

---

## 📦 Quick Wins (Priority Order)

1. **Enable GZIP compression** - 5 min setup, 60% size reduction
2. **Minify CSS/JS** - 10 min setup, 30-40% size reduction
3. **Add cache headers** - 5 min setup, 80% repeat visitor improvement
4. **Lazy load images** - 15 min setup, 50% faster initial load
5. **Optimize hero image** - 20 min setup, 30% faster LCP

---

## 🔍 How to Check Current Performance

### Command line (using Lighthouse CLI):

```bash
npm install -g lighthouse
lighthouse https://yoursite.com --view
```

### Online tools:

- https://pagespeed.web.dev/
- https://www.webpagetest.org/

---

## Current Status ✓

- ✅ Preconnect optimized
- ✅ Scripts deferred
- ✅ Font display optimized
- ⏳ Image optimization (next phase)
- ⏳ CSS/JS minification (next phase)
- ⏳ GZIP compression (server config)
- ⏳ Cache headers (server config)
