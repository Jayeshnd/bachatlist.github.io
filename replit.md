# BachatList - Smart Shopping Deals Website

## Overview
BachatList is a static HTML/CSS/JavaScript website focused on Amazon India deals, product reviews, and money-saving shopping tips. It serves as a deal finder and review platform for Indian shoppers.

## Project Structure
```
├── index.html          # Homepage with hero section, featured deals
├── about.html          # About page
├── categories.html     # Product categories page
├── contact.html        # Contact form page
├── disclaimer.html     # Legal disclaimer
├── privacy.html        # Privacy policy
├── reviews.html        # Reviews listing page
├── review-*.html       # Individual review pages (1-15)
├── styles.css          # Main stylesheet
├── script.js           # JavaScript functionality
├── content-data.json   # Content data file
├── telegram_bot.py     # Telegram bot script (separate feature)
└── server.py           # Development server for Replit
```

## Technology Stack
- **Frontend**: Pure HTML5, CSS3, JavaScript (no framework)
- **Fonts**: Google Fonts (Poppins, Inter)
- **Server**: Python http.server (development)
- **Deployment**: Static hosting

## Running the Project
The project runs via `python server.py` which serves static files on port 5000.

## Deployment
Configured for static deployment - serves all HTML/CSS/JS files from the root directory.
