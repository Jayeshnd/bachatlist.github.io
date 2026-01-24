# TechGear Reviews - Amazon Associates Website with Telegram Bot

A complete, professional affiliate website ready to deploy on GitHub Pages with integrated Telegram bot for content management.

## 🌟 Features

- ✅ **Amazon Associates Compliant**: 15+ pages with original content
- 🤖 **Telegram Bot Integration**: Update content remotely via Telegram
- 📱 **Fully Responsive**: Mobile-first design
- 🎨 **Modern UI**: Professional, unique design
- ⚡ **Fast & Lightweight**: Static HTML/CSS/JS (no dependencies)
- 🚀 **GitHub Pages Ready**: Deploy in minutes

## 📋 Requirements Met

### Amazon Associates Requirements:
- ✅ 10+ unique pages with original content
- ✅ Public website with your domain
- ✅ Content published within last 60 days
- ✅ Professional design and structure
- ✅ Clear affiliate disclosure
- ✅ Privacy policy and terms

### Pages Included:
1. Home page (index.html)
2. About page
3. Contact page
4. Categories page
5. All Reviews page
6. Privacy Policy
7. Affiliate Disclosure
8. 10+ Individual Review Pages (review-1.html to review-10.html)

**Total: 18+ pages** ✅

## 🚀 Quick Deploy to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New Repository"
3. Name it: `yourname.github.io` or any name
4. Make it **Public**
5. Don't initialize with README
6. Click "Create repository"

### Step 2: Upload Website Files

**Option A: Upload via Web Interface**
1. Click "uploading an existing file"
2. Drag and drop all files from `affiliate-website` folder
3. Commit changes

**Option B: Upload via Git (Recommended)**
```bash
cd affiliate-website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to repository Settings
2. Click "Pages" in left sidebar
3. Under "Source", select "main" branch
4. Click "Save"
5. Your site will be live at: `https://yourusername.github.io/repo-name/`

### Step 4: Custom Domain (Optional)

1. Buy a domain (GoDaddy, Namecheap, etc.)
2. In GitHub Pages settings, add your custom domain
3. In your domain registrar, add these DNS records:
   ```
   Type: A
   Host: @
   Value: 185.199.108.153
   
   Type: A
   Host: @
   Value: 185.199.109.153
   
   Type: A
   Host: @
   Value: 185.199.110.153
   
   Type: A
   Host: @
   Value: 185.199.111.153
   
   Type: CNAME
   Host: www
   Value: yourusername.github.io
   ```

## 🤖 Telegram Bot Setup

### Prerequisites
```bash
pip install python-telegram-bot --break-system-packages
```

### Get Bot Token

1. Open Telegram and search for `@BotFather`
2. Send `/newbot`
3. Follow instructions to create your bot
4. Copy the bot token (looks like: `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`)

### Configure Bot

1. Open `telegram_bot.py`
2. Replace `YOUR_BOT_TOKEN_HERE` with your actual token:
   ```python
   BOT_TOKEN = '123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ'
   ```

3. (Optional) Add your Telegram user ID for security:
   - Send `/start` to your bot to get your user ID
   - Add it to the script:
   ```python
   AUTHORIZED_USERS = [123456789]  # Your Telegram user ID
   ```

### Run Bot

```bash
python telegram_bot.py
```

The bot will create a `content-data.json` file that your website reads.

## 📱 Using Telegram Bot

### Available Commands

**Basic Commands:**
- `/start` - Welcome message and instructions
- `/help` - Show all commands
- `/list` - List all updatable element IDs
- `/status` - Show current content statistics

**Update Commands:**

**Update Images:**
```
/update_image image-1 https://example.com/image.jpg
```

**Update Titles:**
```
/update_title title-1 New Amazing Product Title
```

**Update Descriptions:**
```
/update_desc desc-1 This is the new product description text
```

**Update Review Content:**
```
/update_review review-content <p>New paragraph content</p>
```

### Upload Images via Telegram

1. Send any image to the bot
2. Bot saves it to `uploaded_images/` folder
3. Upload the image to your GitHub repo
4. Get the raw GitHub URL
5. Use `/update_image` command with the GitHub URL

### Example Workflow

```
# List available elements
/list

# Update an image
/update_image image-1 https://raw.githubusercontent.com/user/repo/main/images/product.jpg

# Update a title
/update_title title-1 Best Wireless Earbuds 2024

# Update description
/update_desc desc-1 These earbuds offer incredible sound quality and battery life
```

## 📁 Project Structure

```
affiliate-website/
├── index.html              # Home page
├── about.html              # About page
├── contact.html            # Contact page
├── categories.html         # Categories listing
├── reviews.html            # All reviews page
├── privacy.html            # Privacy policy
├── disclaimer.html         # Affiliate disclosure
├── review-1.html to        # Individual review pages
│   review-10.html
├── styles.css              # Main stylesheet
├── script.js               # JavaScript functionality
├── telegram_bot.py         # Telegram bot for content management
├── content-data.json       # Generated by bot (content storage)
└── README.md               # This file
```

## 🎨 Customization

### Change Colors

Edit `styles.css`:
```css
:root {
    --primary: #2d3561;      /* Main color */
    --secondary: #f4a261;    /* Secondary color */
    --accent: #e76f51;       /* Accent color */
}
```

### Change Site Name

Replace "TechGear Reviews" throughout the HTML files with your site name.

### Update Content

**Via Telegram Bot:** (Recommended)
- Use bot commands to update content remotely

**Via Manual Edit:**
- Edit HTML files directly
- Push changes to GitHub

## 🔄 Updating Content

### Method 1: Telegram Bot (Live Updates)

1. Run the bot: `python telegram_bot.py`
2. Use Telegram commands to update content
3. Upload `content-data.json` to your GitHub repo
4. Changes appear on website immediately

### Method 2: Direct Edit

1. Edit HTML files locally
2. Push to GitHub
3. Wait 1-2 minutes for GitHub Pages to rebuild

## 🔐 Security Tips

1. **Protect Bot Token**: Never commit your bot token to public repos
2. **Restrict Bot Access**: Add your user ID to `AUTHORIZED_USERS`
3. **Use Environment Variables**: For production, use environment variables:
   ```python
   import os
   BOT_TOKEN = os.environ.get('BOT_TOKEN')
   ```

## 📊 Amazon Associates Application

### Before Applying:
1. Deploy website to GitHub Pages
2. Add 10+ quality product reviews
3. Update all pages with current dates
4. Add Amazon affiliate links to review pages
5. Ensure privacy policy and disclaimer are visible

### Application Steps:
1. Go to [https://affiliate-program.amazon.in](https://affiliate-program.amazon.in)
2. Click "Sign up"
3. Enter your website URL
4. Fill in application details
5. Wait for approval (usually 24-48 hours)

### After Approval:
1. Get your Amazon Associate ID
2. Generate product links from Amazon Associates dashboard
3. Replace placeholder links in review pages
4. Track earnings in Associates dashboard

## 🎯 Tips for Success

### Content Strategy:
- Write detailed, honest reviews
- Add product comparisons
- Include pros and cons
- Use high-quality images
- Update content regularly

### SEO Optimization:
- Use descriptive page titles
- Add meta descriptions
- Include relevant keywords
- Create internal links between pages
- Submit sitemap to Google Search Console

### Traffic Generation:
- Share reviews on social media
- Engage in relevant online communities
- Create YouTube video reviews
- Build an email newsletter
- Guest post on related blogs

## 🛠️ Maintenance

### Weekly:
- Add 1-2 new reviews
- Update existing content
- Check affiliate links
- Monitor bot status

### Monthly:
- Review analytics
- Update popular reviews
- Check Amazon Associates dashboard
- Optimize underperforming pages

## 📞 Support

### Common Issues:

**Website not loading:**
- Check GitHub Pages is enabled
- Verify branch is set to 'main'
- Wait 5 minutes after pushing changes

**Bot not responding:**
- Check bot token is correct
- Ensure bot is running
- Verify user ID in authorized users

**Content not updating:**
- Ensure `content-data.json` is uploaded to GitHub
- Check browser cache (hard refresh: Ctrl+Shift+R)
- Verify JSON file is valid

## 📄 License

This project is open source. You can modify and use it for your affiliate websites.

## 🙏 Credits

Built with:
- Pure HTML/CSS/JavaScript
- Google Fonts (Playfair Display, Work Sans)
- Python Telegram Bot API

---

**Ready to launch your affiliate website?** Follow the deployment steps above and start earning with Amazon Associates!

For questions or issues, feel free to reach out or create an issue in the repository.

Good luck with your affiliate marketing journey! 🚀
