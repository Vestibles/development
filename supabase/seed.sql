-- Sample seed for ZCCEW Family Fun Day
-- Replace event UUID after first insert or use returned id

insert into events (id, name, event_date, attendance_estimate)
values (
  '00000000-0000-4000-8000-000000000001',
  'ZCCEW Family Fun Day',
  '2026-06-14',
  350
) on conflict (id) do nothing;

insert into stalls (id, event_id, name, item_cost, selling_price, quantity) values
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Cake Stall', 0.85, 2.50, 120),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'BBQ Burgers', 1.90, 4.50, 150),
  ('10000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', 'Tombola', 0.40, 1.00, 200),
  ('10000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', 'Craft Corner', 1.20, 3.00, 80),
  ('10000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000001', 'Refreshments', 0.35, 1.50, 250)
on conflict (id) do nothing;

insert into expenses (id, event_id, category, description, budgeted, actual) values
  ('20000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Venue', 'Field hire & insurance', 250, 250),
  ('20000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'Equipment', 'Tents, tables & chairs hire', 180, 165),
  ('20000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', 'Marketing', 'Posters & social ads', 60, 45),
  ('20000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', 'Licences', 'Food hygiene & raffle licence', 85, 85)
on conflict (id) do nothing;

insert into suppliers (id, event_id, name, contact, notes) values
  ('30000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Wholesale Foods Co', 'orders@wholesalefoods.example', 'BBQ & drinks'),
  ('30000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'Bakehouse Supplies', '01400 123456', 'Cake ingredients'),
  ('30000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', 'Craft & Party Ltd', 'sales@craftparty.example', null)
on conflict (id) do nothing;

insert into purchases (id, event_id, supplier_id, item_name, budgeted, actual, quantity, stock_on_hand, purchased) values
  ('40000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'Burger buns & patties', 120, 115, 150, 150, true),
  ('40000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002', 'Flour, icing & boxes', 45, 0, 1, 0, false),
  ('40000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000003', 'Craft kits', 96, 92, 80, 80, true),
  ('40000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'Soft drinks (crates)', 55, 0, 12, 0, false)
on conflict (id) do nothing;

insert into ticket_sales (id, event_id, adult_count, adult_price, family_count, family_price, child_count, child_price, raffle_count, raffle_price, donations) values
  ('50000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 85, 3, 42, 8, 120, 1.5, 200, 1, 275)
on conflict (event_id) do nothing;

insert into volunteers (id, event_id, name, email, phone, role) values
  ('60000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Sarah Mitchell', 'sarah.mitchell@email.example', '07700 900123', 'Stall lead'),
  ('60000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'James Okonkwo', 'j.okonkwo@email.example', '07700 900456', 'Setup crew'),
  ('60000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', 'Emily Chen', 'emily.chen@email.example', '07700 900789', 'Tickets & welcome'),
  ('60000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', 'David Hughes', 'david.h@email.example', '07700 900321', 'BBQ team')
on conflict (id) do nothing;

insert into volunteer_shifts (id, event_id, volunteer_id, stall_or_area, shift_start, shift_end) values
  ('70000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', 'Cake Stall', '10:00', '13:00'),
  ('70000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000004', 'BBQ Burgers', '11:00', '15:00'),
  ('70000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000003', 'Entrance / Tickets', '09:30', '12:30'),
  ('70000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000002', 'Setup & teardown', '08:00', '10:00')
on conflict (id) do nothing;
