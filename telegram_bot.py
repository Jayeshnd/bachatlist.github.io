"""
BachatList Telegram Bot - Content Management System
Manage your website content directly from Telegram!

Setup:
1. pip install python-telegram-bot --break-system-packages
2. Create bot with @BotFather
3. Setup your .env file with your token
4. Run: python telegram_bot.py
5. Upload content-data.json to GitHub after updates

Commands:
/start - Welcome & instructions
/update_deal_image <id> <url> - Update deal image
/update_deal_title <id> <text> - Update deal title
/update_deal_desc <id> <text> - Update deal description
/update_price <id> <price> - Update price
/list - List all IDs
/help - Show commands
"""

import json
import os
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

# Load environment variables
load_dotenv()

# Configuration
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
DATA_FILE = 'content-data.json'
AUTHORIZED_USERS = [int(id) for id in os.getenv('AUTHORIZED_USER_IDS', '').split(',') if id]

# Initialize content structure
def init_content_data():
    return {
        "dealImages": {
            "deal-image-1": "",
            "deal-image-2": "",
            "deal-image-3": ""
        },
        "dealTitles": {
            "deal-title-1": "Premium Wireless Earbuds with ANC",
            "deal-title-2": "Fitness Smart Watch - Health Tracker",
            "deal-title-3": "20000mAh Fast Charging Power Bank"
        },
        "dealDescriptions": {
            "deal-desc-1": "Active noise cancellation, 30hr battery",
            "deal-desc-2": "Heart rate monitor, sleep tracking",
            "deal-desc-3": "20W fast charging, dual USB ports"
        },
        "prices": {
            "price-1": "₹2,499",
            "price-2": "₹1,999",
            "price-3": "₹899"
        },
        "customContent": {}
    }

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return init_content_data()

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def is_authorized(user_id):
    if not AUTHORIZED_USERS:
        return True
    return user_id in AUTHORIZED_USERS

# Commands
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    welcome = f"""
🌟 Welcome to BachatList Content Manager!

Manage your website content in real-time through Telegram.

📝 Available Commands:

📸 Update Images:
/update_deal_image <id> <url>
Example: /update_deal_image deal-image-1 https://example.com/image.jpg

📝 Update Titles:
/update_deal_title <id> <text>
Example: /update_deal_title deal-title-1 Best Wireless Earbuds 2024

📄 Update Descriptions:
/update_deal_desc <id> <text>
Example: /update_deal_desc deal-desc-1 Amazing sound quality with ANC

💰 Update Prices:
/update_price <id> <price>
Example: /update_price price-1 ₹1,999

📋 Other Commands:
/list - Show all element IDs
/status - Show current stats
/help - Show this message

Your User ID: {update.effective_user.id}

💡 Tip: After updates, upload content-data.json to GitHub!
"""
    await update.message.reply_text(welcome)

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await start(update, context)

async def list_elements(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("❌ Unauthorized")
        return

    data = load_data()
    
    message = "📋 Updatable Elements:\n\n"
    
    message += "📸 Deal Images:\n"
    for img_id in data['dealImages'].keys():
        message += f"  • {img_id}\n"
    
    message += "\n📝 Deal Titles:\n"
    for title_id in data['dealTitles'].keys():
        message += f"  • {title_id}\n"
    
    message += "\n📄 Deal Descriptions:\n"
    for desc_id in data['dealDescriptions'].keys():
        message += f"  • {desc_id}\n"
    
    message += "\n💰 Prices:\n"
    for price_id in data['prices'].keys():
        message += f"  • {price_id}\n"
    
    await update.message.reply_text(message)

async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("❌ Unauthorized")
        return

    data = load_data()
    message = f"""📊 Content Status:

📸 Images: {len(data['dealImages'])}
📝 Titles: {len(data['dealTitles'])}
📄 Descriptions: {len(data['dealDescriptions'])}
💰 Prices: {len(data['prices'])}
🎨 Custom Content: {len(data['customContent'])}

Last updated: Just now
"""
    await update.message.reply_text(message)

async def update_deal_image(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("❌ Unauthorized")
        return

    if len(context.args) < 2:
        await update.message.reply_text("Usage: /update_deal_image <id> <image_url>")
        return
    
    element_id = context.args[0]
    image_url = context.args[1]
    
    data = load_data()
    data['dealImages'][element_id] = image_url
    save_data(data)
    
    await update.message.reply_text(f"✅ Image '{element_id}' updated!\n\n🔗 URL: {image_url}\n\n💡 Upload content-data.json to GitHub")

async def update_deal_title(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("❌ Unauthorized")
        return

    if len(context.args) < 2:
        await update.message.reply_text("Usage: /update_deal_title <id> <title_text>")
        return
    
    element_id = context.args[0]
    title_text = ' '.join(context.args[1:])
    
    data = load_data()
    data['dealTitles'][element_id] = title_text
    save_data(data)
    
    await update.message.reply_text(f"✅ Title '{element_id}' updated!\n\n📝 New: {title_text}\n\n💡 Upload content-data.json to GitHub")

async def update_deal_desc(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("❌ Unauthorized")
        return

    if len(context.args) < 2:
        await update.message.reply_text("Usage: /update_deal_desc <id> <description_text>")
        return
    
    element_id = context.args[0]
    desc_text = ' '.join(context.args[1:])
    
    data = load_data()
    data['dealDescriptions'][element_id] = desc_text
    save_data(data)
    
    await update.message.reply_text(f"✅ Description '{element_id}' updated!\n\n📄 New: {desc_text}\n\n💡 Upload content-data.json to GitHub")

async def update_price(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("❌ Unauthorized")
        return

    if len(context.args) < 2:
        await update.message.reply_text("Usage: /update_price <id> <price>")
        return
    
    element_id = context.args[0]
    price = ' '.join(context.args[1:])
    
    data = load_data()
    data['prices'][element_id] = price
    save_data(data)
    
    await update.message.reply_text(f"✅ Price '{element_id}' updated!\n\n💰 New: {price}\n\n💡 Upload content-data.json to GitHub")

async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_user.id):
        await update.message.reply_text("❌ Unauthorized")
        return

    photo = update.message.photo[-1]
    file = await context.bot.get_file(photo.file_id)
    
    file_path = f"uploaded_images/{photo.file_id}.jpg"
    os.makedirs('uploaded_images', exist_ok=True)
    await file.download_to_drive(file_path)
    
    await update.message.reply_text(
        f"📸 Photo saved!\n\n"
        f"📁 Location: {file_path}\n\n"
        f"Next steps:\n"
        f"1. Upload to GitHub: bachatlist.github.io/images/\n"
        f"2. Get URL: https://bachatlist.github.io/images/filename.jpg\n"
        f"3. Use: /update_deal_image deal-image-1 <URL>"
    )

def main():
    application = Application.builder().token(BOT_TOKEN).build()

    # Register handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("list", list_elements))
    application.add_handler(CommandHandler("status", status))
    application.add_handler(CommandHandler("update_deal_image", update_deal_image))
    application.add_handler(CommandHandler("update_deal_title", update_deal_title))
    application.add_handler(CommandHandler("update_deal_desc", update_deal_desc))
    application.add_handler(CommandHandler("update_price", update_price))
    application.add_handler(MessageHandler(filters.PHOTO, handle_photo))

    # Initialize data file
    if not os.path.exists(DATA_FILE):
        save_data(init_content_data())
        print(f"✅ Created {DATA_FILE}")

    print("🤖 BachatList Bot Started!")
    print(f"📁 Content file: {DATA_FILE}")
    print(f"🔑 Token: {BOT_TOKEN[:10]}...")
    print("Press Ctrl+C to stop")
    
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
