# Bulk Product Upload Guide

---

## Overview

Create CSV/Excel files to upload multiple products at once. Reference file: `bulk_upload_final(Sheet1).csv`

**File Requirements:**

- Format: CSV or Excel (.xlsx, .xls)
- Max Size: 5MB
- First row MUST contain exact column headers

---

## Column Structure

### Basic Fields (Required/Optional)

| Column         | Required     | Format                | Example                                                      |
| -------------- | ------------ | --------------------- | ------------------------------------------------------------ |
| `slug`         | Optional\*   | lowercase-with-dashes | `steel-water-bottle`                                         |
| `name`         | **Required** | Text                  | `Steel Water Bottle`                                         |
| `about`        | Optional     | Text                  | `A premium insulated bottle...`                              |
| `categoryId`   | **Required** | MongoDB ObjectId      | `68a80017d54c7da9fee4477d`                                   |
| `applications` | Optional     | Comma-separated       | `Office, Gym, Outdoor`                                       |
| `price`        | Optional     | Number                | `25.99`                                                      |
| `images`       | Optional     | Comma-separated URLs  | `https://example.com/img1.jpg, https://example.com/img2.jpg` |
| `isTopSeller`  | Optional     | TRUE/FALSE or 1/0     | `TRUE`                                                       |

\*Auto-generated from `name` if not provided. Get `categoryId` from your admin panel.

---

## Dynamic Columns (Optional)

### 1. Parameters - Product Specifications

Add product variants and specifications using numbered pairs:

**Column Pattern:**

```
Parameter Label 1, Parameter Values 1
Parameter Label 2, Parameter Values 2
...
```

**Column Pattern:**

```
Parameter Label 1, Parameter Values 1
Parameter Label 2, Parameter Values 2
...
```

**Example:**

- `Parameter Label 1` = `Capacity`
- `Parameter Values 1` = `500ml, 750ml, 1000ml` _(comma-separated)_
- `Parameter Label 2` = `Color`
- `Parameter Values 2` = `Silver, Black, Blue`

---

### 2. Description Blocks - Formatted Product Details

Create organized description sections with headings, bullets, and text. Each block is numbered (1, 2, 3...), bullets use format N.M (block.bullet):

**Column Pattern:**

```
Description Heading N, Description Text N, Bullet Highlight N.1, Bullet Text N.1, Bullet Highlight N.2, Bullet Text N.2, ...
```

**Example (Block 1 - Key Features):**

- `Description Heading 1` = `Key Features`
- `Bullet Highlight 1.1` = `Durable` _(shown in bold)_
- `Bullet Text 1.1` = `Made from high-grade stainless steel`
- `Bullet Highlight 1.2` = `Insulated`
- `Bullet Text 1.2` = `Keeps drinks hot for 12h and cold for 24h`
- `Description Text 1` = `Perfect for travel, office, and outdoor use.`

**Example (Block 2 - Care Instructions):**

- `Description Heading 2` = `Care Instructions`
- `Bullet Highlight 2.1` = `Hand Wash`
- `Bullet Text 2.1` = `Recommended to extend lifespan`
- `Description Text 2` = `Follow these care tips.`

---

### 3. Metadata - Custom Product Information

Add any custom key-value pairs for extra product data:

**Column Pattern:**

```
Metadata Key 1, Metadata Value 1
Metadata Key 2, Metadata Value 2
...
```

**Example:**

- `Metadata Key 1` = `warranty`
- `Metadata Value 1` = `2 years`
- `Metadata Key 2` = `origin`
- `Metadata Value 2` = `Germany`

---

## Key Rules

1. **Column Headers**: Use exact names from template (case-sensitive)

2. **Required vs Optional**:

   - Must have: `name`, `categoryId`
   - Everything else: Optional (leave empty if not needed)

3. **Comma-Separated Fields**: Use commas within quotes for:

   - `applications` → `"Office, Gym, Outdoor"`
   - `images` → `"url1, url2, url3"`
   - `Parameter Values` → `"500ml, 750ml, 1000ml"`

4. **Numbering**:

   - Parameters/Descriptions/Metadata: 1, 2, 3...
   - Bullets: Block.Bullet format (1.1, 1.2, 2.1, 2.2...)

5. **CategoryId**: Get valid MongoDB ObjectId from your admin panel

---

## Upload Process

1. **Prepare** your CSV/Excel file using the template above
2. **Navigate** to Admin Panel → Products → Bulk Upload
3. **Select** your file (max 5MB)
4. **Upload** and review results:
   - ✅ **inserted**: Successfully imported
   - ❌ **errors**: Rows with issues
   - 📊 **totalProcessed**: Total rows checked

---

**Need Help?** Check the working example: `bulk_upload_final(Sheet1).csv` or visit [this link](https://1drv.ms/x/c/006999d64f58197a/Eb3bCFCDSWFHrc5lur91zWMBRtcfjgzve_UsUYIAAT9xNQ?e=bR13Se)
