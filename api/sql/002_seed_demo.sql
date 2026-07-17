-- DEMO seed — entirely synthetic data. Never load on production.
INSERT INTO staff_users (name, email, password_hash, role) VALUES
  ('Consultant T.', 'consultant@example.test', '$2y$10$REPLACE_WITH_REAL_HASH_BEFORE_USE_0000000000000000000', 'consultant'),
  ('Admin A.', 'admin@example.test', '$2y$10$REPLACE_WITH_REAL_HASH_BEFORE_USE_0000000000000000000', 'admin');

INSERT INTO customers (name, phone, city) VALUES
  ('Nomvula D.', '0600000001', 'Pinetown'),
  ('Sipho M.', '0600000002', 'Durban'),
  ('Ayesha K.', '0600000003', 'Umhlanga');

INSERT INTO applications (reference, customer_id, customer_name, vehicle_need, budget, stage, consultant) VALUES
  ('EZ-2431', 1, 'Nomvula D.', 'Pre-owned hatchback (Suzuki Swift or similar), automatic preferred', 'R3 500/month · R15 000 deposit', 'options', 'Consultant T.'),
  ('EZ-2432', 2, 'Sipho M.', 'New 1-ton bakkie, white, canopy required', 'R450 000 cash + finance mix', 'sourcing', 'Consultant K.'),
  ('EZ-2433', 3, 'Ayesha K.', '2022 VW Polo 1.0 TSI found at a Durban dealership', 'R289 000 asking price', 'finance', 'Consultant T.');

INSERT INTO application_status_history (application_id, stage, changed_by) VALUES
  (1, 'received', 'system'), (1, 'review', 'Consultant T.'), (1, 'sourcing', 'Consultant T.'), (1, 'options', 'Consultant T.'),
  (2, 'received', 'system'), (2, 'review', 'Consultant K.'), (2, 'sourcing', 'Consultant K.'),
  (3, 'received', 'system'), (3, 'review', 'Consultant T.'), (3, 'finance', 'Consultant T.');

INSERT INTO vehicle_options (application_id, title, year, price, est_instalment, mileage, dealership, image, notes, published) VALUES
  (1, 'Suzuki Swift 1.2 GL AMT', 2023, 219900, 3480, '18 400 km', 'Suzuki dealer, Durban', '/assets/vehicles/vehicle-delivery-swift-04.jpg', 'Automatic, balance of service plan, one owner.', 1),
  (1, 'Suzuki Swift 1.2 GLX', 2022, 204500, 3260, '31 200 km', 'Suzuki dealer, Pinetown', '/assets/vehicles/vehicle-delivery-swift-01.jpg', 'Manual, higher spec, full service history.', 1);

INSERT INTO document_requests (application_id, label, status) VALUES
  (1, 'Certified copy of ID', 'verified'),
  (1, 'Latest payslip', 'requested'),
  (1, '3 months bank statements', 'requested'),
  (3, 'Certified copy of ID', 'verified');

INSERT INTO tasks (application_id, label, who, done) VALUES
  (1, 'Upload your latest payslip', 'customer', 0),
  (1, 'Compare your two vehicle options and select one', 'customer', 0),
  (1, 'Confirm trade-in inspection slot', 'staff', 1),
  (2, 'Request quotes from 3 dealerships', 'staff', 0);

INSERT INTO messages (application_id, sender, author, body) VALUES
  (1, 'staff', 'Consultant T.', 'Hi Nomvula! Two Swift options are ready for you — have a look and tell me which one feels right.'),
  (1, 'customer', 'Nomvula D.', 'Thank you! The automatic looks perfect. Uploading my payslip tonight.');

INSERT INTO leads (reference, journey, name, phone, city, consent_version, status) VALUES
  ('EZ-2431','find','Nomvula D.','0600000001','Pinetown','v1-2026-07','converted'),
  ('EZ-2432','find','Sipho M.','0600000002','Durban','v1-2026-07','qualified'),
  ('EZ-2433','found','Ayesha K.','0600000003','Umhlanga','v1-2026-07','qualified'),
  ('EZ-2434','fleet','Khanyile Logistics','0600000004','Pinetown','v1-2026-07','new'),
  ('EZ-2435','find','Thabo N.','0600000005','PMB','v1-2026-07','new');
