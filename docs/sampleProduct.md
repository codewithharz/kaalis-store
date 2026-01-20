# Sample Products for Testing Variant Expansion

Use these two samples to test the new variant expansion logic in the **Add Product** form.

---

## 🎧 Sample 1: Lumina Pro Wireless Earbuds
**Goal:** Test expanding ONE variant block into THREE separate variants (3 Colors × 1 Size).

### 1. Basic Information
- **Category:** Electronics > Audio > Earbuds
- **Product Name:** Lumina Pro Wireless Earbuds
- **Brand:** Lumina
- **Primary Display Color:** `#1A1A1A` (Name: Obsidian Black)
- **Description:** Premium wireless earbuds with active noise cancellation, 40-hour battery life, and crystal-clear audio quality. Sleek matte finish with a minimalist charging case.

### 2. Images (Upload these 3)
- ![Obsidian Black](/Users/harz/.gemini/antigravity/brain/8c632c16-97c9-4a1c-9913-07f90d30694a/lumina_pro_black_1768909814286.png)
- ![Arctic White](/Users/harz/.gemini/antigravity/brain/8c632c16-97c9-4a1c-9913-07f90d30694a/lumina_pro_white_1768909833414.png)
- ![Cosmic Blue](/Users/harz/.gemini/antigravity/brain/8c632c16-97c9-4a1c-9913-07f90d30694a/lumina_pro_blue_1768909853288.png)

### 3. Pricing & Inventory
- **Price:** 55,000
- **Original Price:** 75,000
- **Stock:** 350
- **Unit Category:** Quantity (Base Unit: pieces)

### 4. Variants (THE TEST: EASY MODE)
1. Click **"Add Variant"** once.
2. **Upload 3 images** specifically to this variant block (instead of the main gallery).
3. In the **Attributes** section of that single variant, add these:
   - **Color**: `Black` (System will map to #000000)
   - **Color**: `White` (System will map to #FFFFFF)
   - **Color**: `Blue`  (System will map to #0000FF)
   - **Size**: `Standard`

### Expected Result:
The system will create **3 variants**. Because you uploaded **3 images** to the block with **3 colors**, it will automatically assign:
- Variant 1 (Black) -> Gets the 1st image
- Variant 2 (White) -> Gets the 2nd image
- Variant 3 (Blue)  -> Gets the 3rd image

*In the product selection grid, you will now see the images instead of just colors!*
 Riverside
---

## ⌚ Sample 2: Zenith Smart Watch
**Goal:** Test expanding ONE variant block into FOUR separate variants (2 Colors × 2 Sizes).

### 1. Basic Information
- **Category:** Electronics > Wearables > Smart Watches
- **Product Name:** Zenith Smart Watch Series X
- **Brand:** Zenith
- **Primary Display Color:** `#000000` (Name: Midnight Black)
- **Description:** The ultimate fitness companion. Features a high-resolution OLED display, heart rate monitoring, GPS, and water resistance up to 50 meters.

### 2. Images (Upload these 2)
- ![Midnight Black](/Users/harz/.gemini/antigravity/brain/8c632c16-97c9-4a1c-9913-07f90d30694a/zenith_watch_black_1768910463905.png)
- ![Silver Steel](/Users/harz/.gemini/antigravity/brain/8c632c16-97c9-4a1c-9913-07f90d30694a/zenith_watch_silver_1768910478294.png)

### 3. Pricing & Inventory
- **Price:** 120,000
- **Stock:** 200
- **Unit Category:** Quantity (Base Unit: unit)

### 4. Variants (THE MULTI-TEST)
1. Click **"Add Variant"** once.
2. Under **Attributes**, add these 4 options:
   - **Color**: `Midnight Black | #000000`
   - **Color**: `Silver Steel | #C0C0C0`
   - **Size**: `40mm`
   - **Size**: `44mm`

### Expected Result for Sample 2:
When you submit, it should create **4 separate variants** in the database:
1. Midnight Black / 40mm
2. Midnight Black / 44mm
3. Silver Steel / 40mm
4. Silver Steel / 44mm
