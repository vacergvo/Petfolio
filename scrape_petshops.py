from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import os
import requests
import json
import re
import time

generations = {
    "G1": "https://lpsmerch.com/g1/all/",
    "G2": "https://lpsmerch.com/g2/all/",
    "G3": "https://lpsmerch.com/g3/all/",
    "G4": "https://lpsmerch.com/g4/all/",
    "G5": "https://lpsmerch.com/g5/all/",
    "G6": "https://lpsmerch.com/g6/all/",
    "G7": "https://lpsmerch.com/g7/all/"
}

IMAGE_DIR = "images"
os.makedirs(IMAGE_DIR, exist_ok=True)
all_petshops = []

options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1920,1080")

def extract_id(text):
    match = re.search(r"#(\d+)", text)
    return f"LPS-{match.group(1)}" if match else None

for GEN, URL in generations.items():
    print(f"🔍 Scraping {GEN} from {URL} ...")
    driver = webdriver.Chrome(options=options)
    driver.get(URL)

    last_height = driver.execute_script("return document.body.scrollHeight")
    unchanged_scrolls = 0
    while unchanged_scrolls < 10:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1.5)
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            unchanged_scrolls += 1
        else:
            unchanged_scrolls = 0
            last_height = new_height

    items = driver.find_elements(By.CLASS_NAME, "data-item")
    if len(items) < 5:
        items = driver.find_elements(By.CLASS_NAME, "item")  # fallback G6-G7

    print(f"✅ Scrolling complete. Found {len(items)} petshops.")
    for i, item in enumerate(items):
        try:
            driver.execute_script("arguments[0].scrollIntoView();", item)
            time.sleep(0.05)
        except:
            continue

    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    dom_items = soup.select(".data-item")
    if len(dom_items) < 5:
        dom_items = soup.select(".item")

    found_ids = set()
    for item in dom_items:
        bottom = item.select_one(".data-bottom") or item.select_one(".item-details")
        if not bottom:
            continue
        raw_text = bottom.get_text()
        pet_id = extract_id(raw_text)
        if not pet_id:
            continue
        unique_key = f"{GEN}-{pet_id}"
        if unique_key in found_ids:
            continue
        found_ids.add(unique_key)

        # 🐾 Extract name
        name_tag = bottom.select_one("a")
        pet_name = name_tag.get_text(strip=True) if name_tag else "Unknown"

        # 🖼️ Extract image
        image_url = None
        for img in item.select("img"):
            src = img.get("data-src") or img.get("src")
            if src and "pixel.gif" not in src and "blank.gif" not in src:
                image_url = src
                break

        if not image_url:
            continue

        ext = os.path.splitext(image_url)[-1].split("?")[0]
        filename = f"{GEN}_{pet_id}{ext}"
        filepath = os.path.join(IMAGE_DIR, filename)

        try:
            if not os.path.exists(filepath):
                img_data = requests.get(image_url, timeout=10).content
                with open(filepath, "wb") as f:
                    f.write(img_data)
            print(f"📸 Saved image for {GEN} {pet_id}")
        except Exception as e:
            print(f"❌ Failed to download image for {GEN} {pet_id}: {e}")
            continue

        all_petshops.append({
            "id": pet_id,
            "name": pet_name,
            "generation": GEN,
            "image": filename
        })

# 💾 Save JSON
with open("all_petshops.json", "w", encoding="utf-8") as f:
    json.dump(all_petshops, f, indent=2, ensure_ascii=False)

print(f"✅ Done. Saved {len(all_petshops)} petshops and images.")
