DROP VIEW IF EXISTS x_profiles;

CREATE OR REPLACE VIEW x_profiles
  AS
SELECT
  users.id,
  users.raw_user_meta_data->>'provider_id' AS twitterId,
  users.raw_user_meta_data->>'full_name' AS fullName,
  users.raw_user_meta_data->>'user_name' AS slug,
  users.raw_user_meta_data->>'avatar_url' AS avatar,
  users.raw_user_meta_data->>'email_verified' AS emailVerified,
  users.raw_user_meta_data->>'phone_verified' AS phoneVerified,
  users.created_at
FROM auth.users
WHERE
  users.raw_app_meta_data->>'provider' = 'twitter';
