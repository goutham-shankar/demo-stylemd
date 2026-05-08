# Testing Database Template Fetching

## Setup

Make sure both services are running:

```bash
# Terminal 1: Frontend
cd /Users/gouthamsankar/Codes/stylemd-ui
npm run dev

# Terminal 2: Backend API (if running separately)
cd <backend-path>
npm run dev  # or your backend start command
```

## Test Cases

### Test 1: Verify Database Connection

**Goal**: Confirm the API can fetch template runs from database

```bash
# Check API is accessible
curl http://localhost:3002/api/stylemd/by-slug/levainbakery-2

# Should return:
# {
#   "ok": true,
#   "data": {
#     "runId": "...",
#     "styleMd": "```stylemd-ui\n{...}\n```\n...",
#     "url": "...",
#     ...
#   }
# }
```

### Test 2: Generate with Default Template

**Goal**: Verify default levainbakery-2 template loads

**Steps:**
1. Navigate to: `http://localhost:3000/generate`
2. Enter any URL to analyze
3. Wait for generation to complete
4. **Expected**: See levainbakery-2 design system on left sidebar
5. **In browser console**: Should see no errors
6. **Network tab**: Should show request to `/api/stylemd/by-slug/levainbakery-2`

### Test 3: Use Custom Database Run

**Goal**: Verify custom run IDs work as templates

**Setup:**
1. Find a run ID in your database: `stylemd_1777797974291`
2. Edit `app/(main)/generate/GeneratePageContent.tsx`:
```typescript
<DesignDetailPage
  // ...
  templateRunId="stylemd_1777797974291"
/>
```

3. Save and let Next.js rebuild
4. Generate a new design
5. **Expected**: Custom run displays in sidebar instead of levainbakery-2

### Test 4: Error Handling - Invalid Run ID

**Goal**: Verify graceful error handling

**Setup:**
1. Edit `app/(main)/generate/GeneratePageContent.tsx`:
```typescript
templateRunId="invalid_run_that_does_not_exist"
```

2. Generate a design
3. **Expected**: See error message in the UI
4. **Console**: Should show error like "Template design data not found in database"

### Test 5: Responsive Layout

**Goal**: Verify template sidebar shows/hides correctly

**Steps:**
1. Generate a design with template enabled
2. **Desktop (1024px+)**: Template sidebar visible on left (33%)
3. **Tablet (768-1024px)**: Template hidden, full width content
4. **Mobile (<768px)**: Template hidden, full width content
5. Resize browser and verify layout changes

### Test 6: Tabs and Actions

**Goal**: Verify all buttons work

**Steps:**
1. Generate a design
2. Test "Live Preview" tab - should show styled preview
3. Test "STYLE.md" tab - should show code
4. Test "Copy style.md" button - should copy to clipboard
5. Test "Download" button - should download .md file
6. Test "Back" button - should return to home

## Performance Checks

### Check 1: Load Time
- Generate a design
- Open DevTools Network tab
- Note time for `/api/stylemd/by-slug/...` request
- Should be < 200ms

### Check 2: No Blocking
- Template should load in background
- Page should be interactive while template loads
- User should not see blank screen waiting for template

### Check 3: Memory
- Open DevTools Memory tab
- Generate multiple designs
- Memory should not grow indefinitely
- Template data should be garbage collected when component unmounts

## Debugging

### If Template Won't Load

1. **Check Network Tab**:
   - Look for request to `/api/stylemd/by-slug/{templateRunId}`
   - Should return 200 status with data

2. **Check Console**:
   - Look for errors like "Failed to load template design"
   - Note the specific error message

3. **Verify Database**:
   - Check run exists in database
   - Verify run has valid `styleMd` field
   - Run ID might be different (check exact ID)

4. **Check API_BASE**:
   - Verify API_BASE is configured correctly
   - Check `lib/api-config.ts` for correct endpoint

### If Build Fails

```bash
# Clean and rebuild
rm -rf .next
npm run build
```

## Verification Checklist

- [ ] Frontend dev server running on port 3000
- [ ] Backend API running on port 3002 (if separate)
- [ ] Default template (levainbakery-2) loads when generating
- [ ] Custom run IDs work as templates
- [ ] Error handling works for invalid runs
- [ ] Template sidebar responsive on different screen sizes
- [ ] All buttons (Copy, Download, Back) work
- [ ] Live Preview and STYLE.md tabs toggle
- [ ] No console errors
- [ ] Network requests under 200ms
- [ ] No memory leaks with multiple generations

## Test Results Template

```
Date: ________________
Tester: ______________

✓ Default template loads
✓ Custom run ID works
✓ Error handling works
✓ Responsive layout works
✓ All buttons functional
✓ No console errors
✓ Performance acceptable

Notes:
______________________
______________________
```

## Common Issues & Solutions

### Issue: "Template design data not found in database"
**Solution**: Verify the run ID exists in database and has valid styleMd

### Issue: CORS error when fetching template
**Solution**: Ensure API_BASE is configured correctly

### Issue: Template shows but with wrong design
**Solution**: Check templateRunId value - make sure it's the correct run

### Issue: Sidebar doesn't appear on desktop
**Solution**: Check browser zoom level (should be 100%), clear cache

---

**Last Updated**: May 3, 2026
