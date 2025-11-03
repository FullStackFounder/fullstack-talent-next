# 🚀 Quick Start Guide

Get the FullstackTalent homepage clone running in 3 steps!

## Step 1: Install Dependencies

```bash
npm install
```

**What this does**: Installs all required packages (Next.js, React, Tailwind, Framer Motion, etc.)

**Expected time**: 2-3 minutes

## Step 2: Run Development Server

```bash
npm run dev
```

**What this does**: Starts the Next.js development server with hot-reload

**You should see**:
```
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

## Step 3: Open in Browser

Navigate to: **http://localhost:3000**

🎉 **That's it!** You should now see the FullstackTalent homepage clone.

---

## 📋 What's Included?

✅ Fully responsive navigation with dropdown  
✅ Animated hero section with stats  
✅ Interactive career path selector  
✅ Quick start options cards  
✅ Success stories with tabs  
✅ Live activity feed  
✅ Dark footer with social links  

---

## 🎨 Customize It!

### Change Colors
Edit `tailwind.config.ts` - look for the `colors` section

### Edit Content
All text content is in the component files under `/components/`

### Add New Sections
1. Create a new component in `/components/`
2. Import it in `app/page.tsx`
3. Add it to the page structure

---

## 🐛 Troubleshooting

### Port 3000 is already in use
```bash
# Kill the process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### Module not found errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# This project uses React 19 RC, which is intentional
# If you see type errors, you can ignore them for now
```

---

## 📚 Learn More

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

---

## 🚀 Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Click "Deploy"

That's it! Your site will be live in ~2 minutes.

---

**Need help?** Open an issue on GitHub or reach out to the community!