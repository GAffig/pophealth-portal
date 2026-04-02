-- County seed data for the Population Health Data Portal
-- NE Tennessee and SW Virginia service areas + surrounding counties
-- Idempotent: safe to re-run (ON CONFLICT DO NOTHING on unique fips)

INSERT INTO counties (name, state, region, fips) VALUES
  -- Northeast Tennessee (10 counties)
  ('Carter',     'TN', 'Northeast Tennessee', '47019'),
  ('Cocke',      'TN', 'Northeast Tennessee', '47029'),
  ('Greene',     'TN', 'Northeast Tennessee', '47059'),
  ('Hamblen',    'TN', 'Northeast Tennessee', '47063'),
  ('Hancock',    'TN', 'Northeast Tennessee', '47067'),
  ('Hawkins',    'TN', 'Northeast Tennessee', '47073'),
  ('Johnson',    'TN', 'Northeast Tennessee', '47091'),
  ('Sullivan',   'TN', 'Northeast Tennessee', '47163'),
  ('Unicoi',     'TN', 'Northeast Tennessee', '47171'),
  ('Washington', 'TN', 'Northeast Tennessee', '47179'),
  -- East Tennessee (additional TN counties in dataset)
  ('Knox',       'TN', 'East Tennessee',      '47093'),
  ('Sevier',     'TN', 'East Tennessee',      '47155'),
  -- Southwest Virginia (14 counties / independent cities)
  ('Bland',        'VA', 'Southwest Virginia', '51021'),
  ('Bristol City', 'VA', 'Southwest Virginia', '51520'),
  ('Buchanan',     'VA', 'Southwest Virginia', '51071'),
  ('Carroll',      'VA', 'Southwest Virginia', '51035'),
  ('Dickenson',    'VA', 'Southwest Virginia', '51051'),
  ('Galax City',   'VA', 'Southwest Virginia', '51640'),
  ('Grayson',      'VA', 'Southwest Virginia', '51077'),
  ('Lee',          'VA', 'Southwest Virginia', '51105'),
  ('Russell',      'VA', 'Southwest Virginia', '51167'),
  ('Scott',        'VA', 'Southwest Virginia', '51169'),
  ('Smyth',        'VA', 'Southwest Virginia', '51173'),
  ('Tazewell',     'VA', 'Southwest Virginia', '51185'),
  ('Washington',   'VA', 'Southwest Virginia', '51191'),
  ('Wise',         'VA', 'Southwest Virginia', '51195')
ON CONFLICT (fips) DO NOTHING;
