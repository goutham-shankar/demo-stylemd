# Backend Persistence Guide: `/api/stylemd/persist`

## Overview
The frontend now actively persists generated `styleMd` data to the database immediately after run completion, instead of relying on polling/implicit saves.

## Endpoint Specification

### Request
```
POST /api/stylemd/persist
Content-Type: application/json
```

### Request Body (RunData)
```typescript
{
  runId: string;          // Unique run identifier (e.g., "abc123xyz")
  url: string;            // Source URL analyzed (e.g., "https://levainbakery.com")
  slug: string;           // URL slug/hostname (can be empty, DB should infer from URL)
  styleMd: string;        // Generated style.md markdown content
  screenshot: string;     // Screenshot URL (may be empty)
  provider: string;       // LLM provider (e.g., "kimi", "openai", "claude")
  model: string;          // Model name (e.g., "gpt-4", "claude-3")
  status: string;         // "completed" | "completed_with_warnings" | "failed" | "canceled"
  createdAt: string;      // ISO 8601 timestamp (e.g., "2026-05-03T10:30:00Z")
}
```

### Response (Success)
```json
{
  "ok": true,
  "data": {
    "runId": "...",
    "url": "...",
    "slug": "...",
    "styleMd": "...",
    "screenshot": "...",
    "provider": "...",
    "model": "...",
    "status": "...",
    "createdAt": "..."
  }
}
```

### Response (Error)
```json
{
  "ok": false,
  "error": "Detailed error message"
}
```

## Implementation Steps

### 1. **Create/Update Database Schema**
Ensure your `runs` or `stylemd_runs` table has these columns:

```sql
CREATE TABLE stylemd_runs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  run_id VARCHAR(255) UNIQUE NOT NULL,
  url VARCHAR(2048) NOT NULL,
  slug VARCHAR(255),
  style_md LONGTEXT NOT NULL,
  screenshot VARCHAR(2048),
  provider VARCHAR(50),
  model VARCHAR(100),
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_run_id (run_id),
  INDEX idx_slug (slug)
);
```

### 2. **Implement the Handler**

#### Node.js / Express Example
```typescript
import express from 'express';
import { db } from './database'; // Your DB connection

interface PersistRunRequest {
  runId: string;
  url: string;
  slug: string;
  styleMd: string;
  screenshot: string;
  provider: string;
  model: string;
  status: string;
  createdAt: string;
}

app.post('/api/stylemd/persist', async (req, res) => {
  try {
    const payload: PersistRunRequest = req.body;

    // Validate required fields
    if (!payload.runId || !payload.styleMd) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: runId, styleMd'
      });
    }

    // Infer slug from URL if empty
    let slug = payload.slug?.trim();
    if (!slug && payload.url) {
      try {
        const urlObj = new URL(payload.url);
        slug = urlObj.hostname.replace('www.', '');
      } catch {
        slug = '';
      }
    }

    // Upsert into database (insert or update if runId exists)
    const query = `
      INSERT INTO stylemd_runs 
      (run_id, url, slug, style_md, screenshot, provider, model, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        style_md = VALUES(style_md),
        screenshot = VALUES(screenshot),
        status = VALUES(status),
        updated_at = CURRENT_TIMESTAMP
    `;

    const params = [
      payload.runId,
      payload.url,
      slug,
      payload.styleMd,
      payload.screenshot || null,
      payload.provider || null,
      payload.model || null,
      payload.status || 'completed',
      payload.createdAt || new Date().toISOString()
    ];

    await db.query(query, params);

    // Return the saved data
    res.json({
      ok: true,
      data: {
        runId: payload.runId,
        url: payload.url,
        slug,
        styleMd: payload.styleMd,
        screenshot: payload.screenshot,
        provider: payload.provider,
        model: payload.model,
        status: payload.status,
        createdAt: payload.createdAt
      }
    });
  } catch (err) {
    console.error('Error persisting run:', err);
    res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : 'Failed to persist run'
    });
  }
});
```

#### Python / FastAPI Example
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from urllib.parse import urlparse
import sqlalchemy

router = APIRouter()

class PersistRunRequest(BaseModel):
    runId: str
    url: str
    slug: str
    styleMd: str
    screenshot: str
    provider: str
    model: str
    status: str
    createdAt: str

@router.post('/api/stylemd/persist')
async def persist_run(payload: PersistRunRequest, db: Session):
    try:
        # Validate
        if not payload.runId or not payload.styleMd:
            raise HTTPException(400, 'Missing required fields: runId, styleMd')

        # Infer slug
        slug = payload.slug
        if not slug and payload.url:
            try:
                parsed = urlparse(payload.url)
                slug = parsed.hostname.replace('www.', '')
            except:
                slug = ''

        # Upsert
        stmt = sqlalchemy.text("""
            INSERT INTO stylemd_runs 
            (run_id, url, slug, style_md, screenshot, provider, model, status, created_at)
            VALUES (:run_id, :url, :slug, :style_md, :screenshot, :provider, :model, :status, :created_at)
            ON DUPLICATE KEY UPDATE
              style_md = VALUES(style_md),
              screenshot = VALUES(screenshot),
              status = VALUES(status)
        """)

        db.execute(stmt, {
            'run_id': payload.runId,
            'url': payload.url,
            'slug': slug,
            'style_md': payload.styleMd,
            'screenshot': payload.screenshot or None,
            'provider': payload.provider or None,
            'model': payload.model or None,
            'status': payload.status or 'completed',
            'created_at': payload.createdAt or datetime.now().isoformat()
        })
        db.commit()

        return {
            'ok': True,
            'data': {
                'runId': payload.runId,
                'url': payload.url,
                'slug': slug,
                'styleMd': payload.styleMd,
                'screenshot': payload.screenshot,
                'provider': payload.provider,
                'model': payload.model,
                'status': payload.status,
                'createdAt': payload.createdAt
            }
        }
    except Exception as err:
        raise HTTPException(500, f'Failed to persist run: {str(err)}')
```

#### Go / Gin Example
```go
package handlers

import (
	"net/http"
	"net/url"
	"strings"
	"github.com/gin-gonic/gin"
	"yourapp/db"
)

type PersistRunRequest struct {
	RunID     string `json:"runId" binding:"required"`
	URL       string `json:"url" binding:"required"`
	Slug      string `json:"slug"`
	StyleMd   string `json:"styleMd" binding:"required"`
	Screenshot string `json:"screenshot"`
	Provider  string `json:"provider"`
	Model     string `json:"model"`
	Status    string `json:"status"`
	CreatedAt string `json:"createdAt"`
}

func PersistRun(c *gin.Context) {
	var payload PersistRunRequest
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"ok":    false,
			"error": "Invalid request body",
		})
		return
	}

	// Infer slug from URL
	slug := strings.TrimSpace(payload.Slug)
	if slug == "" && payload.URL != "" {
		if parsed, err := url.Parse(payload.URL); err == nil {
			slug = strings.TrimPrefix(parsed.Hostname(), "www.")
		}
	}

	// Upsert into database
	query := `
	INSERT INTO stylemd_runs 
	(run_id, url, slug, style_md, screenshot, provider, model, status, created_at)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	ON DUPLICATE KEY UPDATE
		style_md = VALUES(style_md),
		screenshot = VALUES(screenshot),
		status = VALUES(status)
	`

	_, err := db.Exec(query, payload.RunID, payload.URL, slug, 
		payload.StyleMd, payload.Screenshot, payload.Provider,
		payload.Model, payload.Status, payload.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"ok":    false,
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"ok": true,
		"data": gin.H{
			"runId":      payload.RunID,
			"url":        payload.URL,
			"slug":       slug,
			"styleMd":    payload.StyleMd,
			"screenshot": payload.Screenshot,
			"provider":   payload.Provider,
			"model":      payload.Model,
			"status":     payload.Status,
			"createdAt":  payload.CreatedAt,
		},
	})
}
```

### 3. **Update `/api/stylemd/by-slug/{slugOrId}` Endpoint**
Ensure this endpoint checks both `slug` and `run_id` columns:

```sql
SELECT * FROM stylemd_runs 
WHERE slug = ? OR run_id = ?
LIMIT 1;
```

### 4. **Test the Endpoint**

```bash
curl -X POST http://localhost:3000/api/stylemd/persist \
  -H "Content-Type: application/json" \
  -d '{
    "runId": "test-run-123",
    "url": "https://example.com",
    "slug": "example",
    "styleMd": "# Color System\n...",
    "screenshot": "",
    "provider": "kimi",
    "model": "kimi-1.5",
    "status": "completed",
    "createdAt": "2026-05-03T10:30:00Z"
  }'
```

## Key Points

- ✅ **Upsert, not insert** - If `runId` already exists (rerun), update it
- ✅ **Auto-infer slug** - If slug is empty, derive from URL hostname
- ✅ **Truncate large fields** - `styleMd` can be huge; use `LONGTEXT` or equivalent
- ✅ **Index on run_id and slug** - Fast lookups for `/by-slug/{slugOrId}`
- ✅ **Timestamp tracking** - Keep `created_at` (immutable) and `updated_at` (mutable)
- ✅ **Error handling** - Return clear error messages
- ✅ **Return full data** - Send back what was saved for validation

## Copy-Paste Prompt for Backend Implementation

Use this prompt with your backend developer or AI assistant to implement this endpoint:

---

### 🔧 Backend Task Prompt

**Goal**: Implement `/api/stylemd/persist` endpoint to persist generated style.md data to the database.

**Context**: The frontend (Next.js) now sends POST requests with generated design system metadata immediately after a run completes. Instead of polling and hoping the backend saved it, this endpoint actively persists the data.

**Requirements**:

1. **Endpoint**: `POST /api/stylemd/persist`
   - Accept JSON body with: `runId`, `url`, `slug`, `styleMd`, `screenshot`, `provider`, `model`, `status`, `createdAt`
   - All fields except `slug`, `screenshot` are required

2. **Database Operation**:
   - **Upsert** logic: If `runId` exists, update the row; otherwise insert new row
   - Auto-infer `slug` from URL hostname if slug is empty (strip "www.")
   - Store `styleMd` in a large text field (`LONGTEXT`, `TEXT`, or equivalent)
   - Track `created_at` (immutable) and `updated_at` (auto-update on changes)

3. **Database Schema**:
   ```sql
   CREATE TABLE stylemd_runs (
     id INT PRIMARY KEY AUTO_INCREMENT,
     run_id VARCHAR(255) UNIQUE NOT NULL,
     url VARCHAR(2048) NOT NULL,
     slug VARCHAR(255),
     style_md LONGTEXT NOT NULL,
     screenshot VARCHAR(2048),
     provider VARCHAR(50),
     model VARCHAR(100),
     status VARCHAR(50) DEFAULT 'completed',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     INDEX idx_run_id (run_id),
     INDEX idx_slug (slug)
   );
   ```

4. **Response Format** (Success):
   ```json
   {
     "ok": true,
     "data": {
       "runId": "...",
       "url": "...",
       "slug": "...",
       "styleMd": "...",
       "screenshot": "...",
       "provider": "...",
       "model": "...",
       "status": "...",
       "createdAt": "..."
     }
   }
   ```

5. **Error Handling**:
   - Return 400 if required fields missing
   - Return 500 with descriptive error message on DB failure
   - Log all errors for debugging

6. **Testing**:
   - Test upsert: POST twice with same `runId`, second should update
   - Test slug inference: Send with empty slug, verify it's inferred from URL
   - Test DB retrieval: After persist, query `/api/stylemd/by-slug/{runId}` returns saved data

7. **Integration**:
   - Ensure `/api/stylemd/by-slug/{slugOrId}` endpoint queries BOTH `slug` and `run_id` columns
   - Add indexes on `run_id` and `slug` for fast lookups

---

## Integration Checklist

- [ ] Database schema created with proper indexes
- [ ] `/api/stylemd/persist` endpoint implemented
- [ ] Upsert logic handles duplicate `runId`
- [ ] Slug auto-inference works correctly
- [ ] Response format matches frontend expectation
- [ ] Error handling and logging in place
- [ ] Endpoint tested with curl/Postman
- [ ] Updated `by-slug` endpoint to query both slug and run_id
