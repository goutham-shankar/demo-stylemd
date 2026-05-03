# Backend Fix Prompt - Images & Metadata Not Being Stored

## Issue Description

The scraping pipeline is not storing the following fields in MongoDB:

```
_current DB entry:_
{
  _id: 69f70e3f475cd02b7169cca0,
  url: "https://drinkghia.com/",
  title: null,          ← NOT CAPTURED
  description: null,    ← NOT CAPTURED
  h1: null,            ← NOT CAPTURED
  canonical: null,      ← NOT CAPTURED
  images: [],           ← NOT CAPTURED (empty array!)
  contentText: "Now I have sufficient evidence to..." ← THIS IS CAPTURED
  rawHtml: null
}
```

## What Needs to be Fixed

### 1. Capture and Store Images
- Currently: `images` array is empty `[]`
- Expected: Array of image URLs from the scraped page
- Should scrape all images from `<img>` tags
- Should also capture og:image, twitter:image meta tags
- Save full image URLs to `images` array in DB

### 2. Capture and Store Metadata
- `title` - Page title from `<title>` or `<meta property="og:title">`
- `description` - Page description from `<meta name="description">` or `<meta property="og:description">`
- `h1` - First `<h1>` tag text content
- `canonical` - Canonical URL from `<link rel="canonical">`

### 3. Add Logging to Terminal
Add console.log statements throughout the scraping pipeline to show:
- When each stage starts
- What data is being extracted
- When data is saved to database
- Any errors that occur

## Expected Final DB Entry

```
_expected:_
{
  _id: "same_id_if_same_url",
  url: "https://drinkghia.com/",
  title: "Ghia - Drink ghia",           ← SHOULD BE POPULATED
  description: "...",                   ← SHOULD BE POPULATED  
  h1: "Some H1 Text",                   ← SHOULD BE POPULATED
  canonical: "https://drinkghia.com/",  ← SHOULD BE POPULATED
  images: [                            ← SHOULD BE POPULATED
    "https://drinkghia.com/image1.jpg",
    "https://drinkghia.com/image2.png"
  ],
  contentText: "...",
  rawHtml: "...",
  createdAt: "..."
}
```

## Locations to Check

1. **Scraper/Crawler code** - Where HTML is fetched and parsed
2. **Capture stage** - Where images/metadata should be extracted
3. **Pipeline code** - Where data is saved to MongoDB
4. **API endpoint** - That receives and stores the data

## Example Logging to Add

```typescript
// At the start of scraping
console.log(`[SCRAPER] Starting to scrape: ${url}`);

// When fetching HTML
console.log(`[SCRAPER] Fetched HTML, length: ${html.length}`);

// When extracting title
console.log(`[EXTRACTOR] Extracted title: ${title}`);

// When extracting images
console.log(`[EXTRACTOR] Found ${images.length} images:`, images);

// When saving to DB
console.log(`[DB] Saving to MongoDB...`);
console.log(`[DB] Saved successfully, _id: ${result._id}`);

// On error
console.error(`[ERROR] Failed to extract images:`, error);
```

## Tasks for Agent

1. Find the scraper/capture code in the backend
2. Add image extraction logic (og:image, twitter:image, <img> tags)
3. Add metadata extraction (title, description, h1, canonical)
4. Add comprehensive console.log logging throughout
5. Test by re-scraping https://drinkghia.com/
6. Verify all fields are populated in MongoDB

## Success Criteria

- [ ] `title` is populated in DB
- [ ] `description` is populated in DB
- [ ] `h1` is populated in DB
- [ ] `canonical` is populated in DB
- [ ] `images` array has image URLs
- [ ] Terminal shows logging for each step
- [ ] Re-scraping same URL updates existing entry (preserves _id)