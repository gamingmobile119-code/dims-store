-- Insert admin user
INSERT INTO users (id, email, password_hash, full_name, phone_number, role) 
VALUES ('550e8400-e29b-41d4-a716-446655440001', 'admin@dims-store.com', '$2a$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUmGEGmi', 'Admin User', '082123456789', 'admin');

-- Insert sample products for Mobile Legends
INSERT INTO products (id, game_name, denomination, price, description, active)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', 'Mobile Legends', '50 Diamond', 3000, 'Mobile Legends 50 Diamond', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Mobile Legends', '120 Diamond', 7000, 'Mobile Legends 120 Diamond', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Mobile Legends', '250 Diamond', 14000, 'Mobile Legends 250 Diamond', true);

-- Insert sample products for PUBG Mobile
INSERT INTO products (id, game_name, denomination, price, description, active)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440005', 'PUBG Mobile', '1800 UC', 48000, 'PUBG Mobile 1800 UC', true),
  ('550e8400-e29b-41d4-a716-446655440006', 'PUBG Mobile', '3850 UC', 99000, 'PUBG Mobile 3850 UC', true),
  ('550e8400-e29b-41d4-a716-446655440007', 'PUBG Mobile', '9000 UC', 225000, 'PUBG Mobile 9000 UC', true);

-- Insert sample products for Valorant
INSERT INTO products (id, game_name, denomination, price, description, active)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440008', 'Valorant', '1000 VP', 50000, 'Valorant 1000 VP', true),
  ('550e8400-e29b-41d4-a716-446655440009', 'Valorant', '2350 VP', 99000, 'Valorant 2350 VP', true);

-- Insert sample products for Roblox
INSERT INTO products (id, game_name, denomination, price, description, active)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440010', 'Roblox', '400 Robux', 35000, 'Roblox 400 Robux', true),
  ('550e8400-e29b-41d4-a716-446655440011', 'Roblox', '1000 Robux', 82000, 'Roblox 1000 Robux', true);

-- Insert sample products for Genshin Impact
INSERT INTO products (id, game_name, denomination, price, description, active)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440012', 'Genshin Impact', '1000 Genesis Crystal', 50000, 'Genshin Impact 1000 Genesis Crystal', true),
  ('550e8400-e29b-41d4-a716-446655440013', 'Genshin Impact', '2700 Genesis Crystal', 125000, 'Genshin Impact 2700 Genesis Crystal', true);

-- Note: The password hash above is bcrypt hash for "password123"
