CREATE DATABASE IF NOT EXISTS expense_tracker;

USE expense_tracker;

CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  items VARCHAR(255) NOT NULL,
  tags VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional seed data
INSERT INTO expenses (items, tags, amount, date, time) VALUES
('Peanut butter', 'Groceries', 1578, '2026-09-20', '02:46:58 PM'),
('Groceries', 'Groceries', 2450, '2026-09-18', '10:15:32 AM'),
('Coffee', 'Food', 150, '2026-09-15', '08:05:12 AM'),
('Bus fare', 'Travel', 40, '2026-09-12', '09:30:00 AM'),
('Lunch', 'Food', 320, '2026-09-10', '01:00:45 PM');
