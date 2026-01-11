-- =============================================
-- Full Cleanup - Remove All Duplicates
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Delete duplicate profiles (keep only the most recent one)
DELETE FROM profile
WHERE id NOT IN (
  SELECT id FROM profile
  ORDER BY created_at DESC
  LIMIT 1
);

-- 2. Delete duplicate projects (keep only the most recent one for each slug)
DELETE FROM projects
WHERE id NOT IN (
  SELECT DISTINCT ON (slug) id
  FROM projects
  ORDER BY slug, created_at DESC
);

-- 3. Verify the cleanup
SELECT 'Profiles remaining:' as info, COUNT(*) as count FROM profile
UNION ALL
SELECT 'Projects remaining:', COUNT(*) FROM projects;

-- 4. Show final projects list
SELECT slug, title, client FROM projects ORDER BY created_at DESC;
