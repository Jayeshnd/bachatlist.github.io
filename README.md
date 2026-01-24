# 💰 BachatList - Smart Shopping Platform

India's most trusted platform for finding the best deals, honest product reviews, and money-saving tips.

## 🌟 Features

✅ **Amazon Associates Compliant**
- 20+ pages of original content
- Professional design
- Full legal compliance
- Privacy policy & affiliate disclosure

✅ **Modern Design**
- Beautiful gradient-based UI
- Fully responsive
- Smooth animations
- Fast loading times

✅ **Telegram Bot Integration**
- Update content remotely
- Manage deals via commands
- Upload images through Telegram
- Real-time website updates

✅ **Advanced Features**
- Deal wishlist system
- Search functionality
- Newsletter subscription
- Price tracking (coming soon)
- Deal countdown timers

## 🚀 Quick Deploy

### 1. Upload to GitHub

```bash
cd bachatlist-website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/bachatlist/bachatlist.github.io.git
git push -u origin main
```

### 2. Configure Domain

Add `CNAME` file with:
```
bachatlist.com
```

Configure DNS:
```
Type: A
Host: @
Value: 185.199.108.153

Type: CNAME  
Host: www
Value: bachatlist.github.io
```

### 3. Setup Telegram Bot

```bash
pip install python-telegram-bot --break-system-packages
```

1. Message @BotFather on Telegram
2. Create new bot
3. Get token
4. Edit `telegram_bot.py` - add your token
5. Run: `python telegram_bot.py`

### 4. Apply to Amazon Associates

1. Go to https://affiliate-program.amazon.in
2. Click "Sign up"
3. Enter: bachatlist.com
4. Complete application
5. Get approved (24-48 hours)

## 🤖 Telegram Bot Commands

```
/start - Welcome & instructions
/list - Show all updatable IDs
/status - Current content stats

/update_deal_image <id> <url> - Update deal image
/update_deal_title <id> <text> - Update title
/update_deal_desc <id> <text> - Update description
/update_price <id> <price> - Update price
```

### Example Usage:

```
/update_deal_image deal-image-1 https://example.com/product.jpg
/update_deal_title deal-title-1 Best Wireless Earbuds 2024
/update_deal_desc deal-desc-1 Amazing sound with 40hr battery
/update_price price-1 ₹1,999
```

## 📁 Project Structure

```
bachatlist-website/
├── index.html              # Homepage
├── deals.html             # Deals page
├── reviews.html           # Reviews page
├── categories.html        # Categories page
├── about.html             # About page
├── contact.html           # Contact page
├── privacy.html           # Privacy policy
├── disclaimer.html        # Affiliate disclosure
├── styles.css             # Main stylesheet
├── script.js              # JavaScript functionality
├── telegram_bot.py        # Telegram bot
├── content-data.json      # Content management
├── CNAME                  # Custom domain config
└── README.md              # This file
```

## 🎨 Customization

### Change Colors

Edit `styles.css`:
```css
:root {
    --primary: #667eea;      /* Main color */
    --secondary: #f093fb;    /* Secondary color */
    --accent: #4facfe;       /* Accent color */
}
```

### Update Logo

Edit in `index.html`:
```html
<div class="logo">
    <span class="logo-icon">💰</span>
    Bachat<span class="logo-accent">List</span>
</div>
```

## 💡 Content Strategy

### Week 1
- [ ] Add 10+ product deals
- [ ] Write 5 detailed reviews
- [ ] Share on social media
- [ ] Apply to Amazon Associates

### Week 2
- [ ] Get Amazon approval
- [ ] Add affiliate links
- [ ] Create comparison posts
- [ ] Build email list

### Month 1
- [ ] 50+ deals published
- [ ] 20+ reviews written
- [ ] First 3 sales completed
- [ ] SEO optimization done

## 📊 SEO Checklist

- [x] Unique page titles
- [x] Meta descriptions
- [x] Header tags (H1, H2)
- [x] Alt text for images
- [x] Internal linking
- [x] Mobile responsive
- [x] Fast loading speed
- [ ] Submit sitemap to Google
- [ ] Google Analytics setup
- [ ] Search Console verified

## 🔐 Security

1. **Protect Bot Token**
   - Never commit to public repo
   - Use environment variables in production

2. **Restrict Bot Access**
   - Add your user ID to `AUTHORIZED_USERS`

3. **Monitor Access**
   - Check bot logs regularly
   - Review content changes

## 📞 Support

- **Website**: https://bachatlist.com
- **GitHub**: https://github.com/bachatlist
- **Email**: support@bachatlist.com

## 📄 License

This project is open source. Feel free to use and modify for your own affiliate website.

## 🙏 Credits

- Design: Modern gradient-based UI
- Icons: Emoji icons
- Fonts: Google Fonts (Poppins, Inter)
- Bot: Python Telegram Bot API

---

**Made with ❤️ for smart shoppers in India**

Start saving money today with BachatList! 💰
