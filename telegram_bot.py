"""
Telegram Bot for Website Content Management
This bot allows you to update website content (images, titles, descriptions) through Telegram commands.

Setup Instructions:
1. Install required packages: pip install python-telegram-bot --break-system-packages
2. Create a bot with @BotFather on Telegram
3. Replace 'YOUR_BOT_TOKEN_HERE' with your actual bot token
4. Run this script: python telegram_bot.py
5. The bot will generate content-data.json file that your website reads

Commands:
/start - Welcome message and instructions
/update_image <id> <url> - Update image by ID
/update_title <id> <text> - Update title by ID
/update_desc <id> <text> - Update description by ID
/update_review <id> <html> - Update review content
/list - List all updatable elements
/help - Show all commands
"""

import json
import os
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

# Configuration
BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'  # Replace with your bot token from @BotFather
DATA_FILE = 'content-data.json'
AUTHORIZED_USERS = []  # Add your Telegram user ID here for security (optional)

# Initialize content data structure
def init_content_data():
    return {
        "images": {
            "image-1": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23667eea' width='400' height='300'/%3E%3C/svg%3E",
            "image-2": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f093fb' width='400' height='300'/%3E%3C/svg%3E",
            "image-3": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%2343e97b' width='400' height='300'/%3E%3C/svg%3E",
            "review-image": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='500'%3E%3Crect fill='%234a5899' width='900' height='500'/%3E%3C/svg%3E"
        },
        "titles": {
            "title-1": "Best Wireless Earbuds for 2024",
            "title-2": "Ultimate Smart Watch Guide",
            "title-3": "Premium Phone Cases Collection",
            "product-title": "Premium Tech Product Review"
        },
        "descriptions": {
            "desc-1": "Discover the top-rated wireless earbuds with exceptional sound quality, comfort, and battery life.",
            "desc-2": "Compare the latest smart watches with fitness tracking, health monitoring, and premium features.",
            "desc-3": "Protect your device in style with our curated selection of durable, stylish phone cases."
        },
        "reviewContent": {}
    }

# Load or create content data
def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return init_content_data()

# Save content data
def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# Check if user is authorized (optional security)
def is_authorized(user_id):
    if not AUTHORIZED_USERS:
        return True  # If no users specified, allow everyone
    return user_id in AUTHORIZED_USERS

# Command: /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    welcome_message = """
🌟 Welcome to TechGear Reviews Content Manager!

This bot helps you update website content in real-time.

📝 Available Commands:

/update_image <id> <url>
Update an image by its ID
Example: /update_image image-1 https://example.com/image.jpg

/update_title <id> <text>
Update a title by its ID
Example: /update_title title-1 New Product Title

/update_desc <id> <text>
Update a description by its ID
Example: /update_desc desc-1 New product description here

/update_review <id> <html>
Update review content with HTML
Example: /update_review review-content <p>New content</p>

/list
List all updatable element IDs

/status
Show current content data

/help
Show this help message

Your user ID: {user_id}
"""
    await update.message.reply_text(welcome_message.format(user_id=update.effective_user.id))

# Command: /help
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await start(update, context)

# Command: /list
async def list_elements(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("❌ Unauthorized access")
        return

    data = load_data()
    
    message = "📋 Updatable Elements:\n\n"
    
    message += "🖼️ Images:\n"
    for img_id in data['images'].keys():
        message += f"  • {img_id}\n"
    
    message += "\n📝 Titles:\n"
    for title_id in data['titles'].keys():
        message += f"  • {title_id}\n"
    
    message += "\n📄 Descriptions:\n"
    for desc_id in data['descriptions'].keys():
        message += f"  • {desc_id}\n"
    
    await update.message.reply_text(message)

# Command: /status
async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("❌ Unauthorized access")
        return

    data = load_data()
    message = f"📊 Current Status:\n\n"
    message += f"Images: {len(data['images'])}\n"
    message += f"Titles: {len(data['titles'])}\n"
    message += f"Descriptions: {len(data['descriptions'])}\n"
    message += f"Review Content: {len(data['reviewContent'])}\n"
    
    await update.message.reply_text(message)

# Command: /update_image
async def update_image(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("❌ Unauthorized access")
        return

    if len(context.args) < 2:
        await update.message.reply_text("Usage: /update_image <id> <image_url>")
        return
    
    element_id = context.args[0]
    image_url = context.args[1]
    
    data = load_data()
    data['images'][element_id] = image_url
    save_data(data)
    
    await update.message.reply_text(f"✅ Image '{element_id}' updated successfully!\nURL: {image_url}")

# Command: /update_title
async def update_title(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("❌ Unauthorized access")
        return

    if len(context.args) < 2:
        await update.message.reply_text("Usage: /update_title <id> <title_text>")
        return
    
    element_id = context.args[0]
    title_text = ' '.join(context.args[1:])
    
    data = load_data()
    data['titles'][element_id] = title_text
    save_data(data)
    
    await update.message.reply_text(f"✅ Title '{element_id}' updated successfully!\nNew title: {title_text}")

# Command: /update_desc
async def update_desc(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("❌ Unauthorized access")
        return

    if len(context.args) < 2:
        await update.message.reply_text("Usage: /update_desc <id> <description_text>")
        return
    
    element_id = context.args[0]
    desc_text = ' '.join(context.args[1:])
    
    data = load_data()
    data['descriptions'][element_id] = desc_text
    save_data(data)
    
    await update.message.reply_text(f"✅ Description '{element_id}' updated successfully!\nNew description: {desc_text}")

# Command: /update_review
async def update_review(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("❌ Unauthorized access")
        return

    if len(context.args) < 2:
        await update.message.reply_text("Usage: /update_review <id> <html_content>")
        return
    
    element_id = context.args[0]
    content = ' '.join(context.args[1:])
    
    data = load_data()
    data['reviewContent'][element_id] = content
    save_data(data)
    
    await update.message.reply_text(f"✅ Review content '{element_id}' updated successfully!")

# Handle photo uploads
async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("❌ Unauthorized access")
        return

    # Get the highest resolution photo
    photo = update.message.photo[-1]
    file = await context.bot.get_file(photo.file_id)
    
    # Download the photo
    file_path = f"uploaded_images/{photo.file_id}.jpg"
    os.makedirs('uploaded_images', exist_ok=True)
    await file.download_to_drive(file_path)
    
    await update.message.reply_text(
        f"📸 Photo uploaded successfully!\n"
        f"File saved to: {file_path}\n\n"
        f"To use this image, you can:\n"
        f"1. Upload it to your GitHub repo\n"
        f"2. Use /update_image <id> <github_raw_url>"
    )

def main():
    """Start the bot."""
    # Create the Application
    application = Application.builder().token(BOT_TOKEN).build()

    # Register command handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("list", list_elements))
    application.add_handler(CommandHandler("status", status))
    application.add_handler(CommandHandler("update_image", update_image))
    application.add_handler(CommandHandler("update_title", update_title))
    application.add_handler(CommandHandler("update_desc", update_desc))
    application.add_handler(CommandHandler("update_review", update_review))
    
    # Handle photo uploads
    application.add_handler(MessageHandler(filters.PHOTO, handle_photo))

    # Initialize data file
    if not os.path.exists(DATA_FILE):
        save_data(init_content_data())
        print(f"✅ Created {DATA_FILE}")

    # Start the bot
    print("🤖 Bot started! Press Ctrl+C to stop.")
    print(f"📁 Content data will be saved to: {DATA_FILE}")
    print(f"🔑 Your bot token: {BOT_TOKEN[:10]}...")
    
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
