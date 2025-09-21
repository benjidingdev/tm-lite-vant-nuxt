DROP VIEW IF EXISTS profiles;

CREATE OR REPLACE VIEW profiles
  AS
SELECT
  users.id,
  users.created_at
FROM auth.users
