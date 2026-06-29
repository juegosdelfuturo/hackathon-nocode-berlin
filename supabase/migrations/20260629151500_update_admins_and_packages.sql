-- Update admins table to only include the two specific users
DELETE FROM admins;

INSERT INTO admins (email, password_hash)
VALUES 
  ('pedro@team-nexio.com', extensions.crypt('Pluravita_8', extensions.gen_salt('bf'))),
  ('benat@team-nexio.com', extensions.crypt('Pluravita_8', extensions.gen_salt('bf')));
