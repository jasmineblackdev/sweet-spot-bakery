
-- Replace product list with the real Frosted Remedies menu
DELETE FROM public.order_items WHERE product_id IS NOT NULL;
DELETE FROM public.products;

INSERT INTO public.products (name, description, price_cents, category, sort_order, available) VALUES
-- Jumbo Muffins
('Blueberry Bliss (Jumbo Muffin)', 'Bursting with juicy blueberries. 1 jumbo = 2 regular muffins.', 350, 'sweet_treat', 10, true),
('Fudge Therapy (Jumbo Muffin)', 'Rich chocolate-fudge muffin to soothe the soul.', 350, 'sweet_treat', 11, true),
('Chocolate Comfort (Jumbo Muffin)', 'Cozy chocolate muffin made for cozy days.', 350, 'sweet_treat', 12, true),
-- Cookies
('Classic Chocolate Cure (Cookie)', 'Our classic chocolate chip — 2 for $5.', 275, 'sweet_treat', 20, true),
('Soothing Snickerdoodle (Cookie)', 'Cinnamon-sugar snickerdoodle — 2 for $5.', 275, 'sweet_treat', 21, true),
('Sweet Sugar Relief (Cookie)', 'Soft sugar cookie — 2 for $5.', 275, 'sweet_treat', 22, true),
-- Cakes / loaves
('Chocolate Remedies — Single Slice', 'A slice of our signature chocolate loaf.', 350, 'sweet_treat', 30, true),
('Chocolate Remedies — Whole', 'Whole chocolate loaf. 48-hour notice required.', 2500, 'sweet_treat', 31, true),
('Banana Bravery — Single Slice', 'A slice of our banana bread, baked brave.', 350, 'sweet_treat', 32, true),
('Banana Bravery — Whole', 'Whole banana bread loaf. 48-hour notice required.', 2500, 'sweet_treat', 33, true),
-- Beverages
('Lemonade', 'Fresh lemonade — $1 refill in person.', 300, 'sweet_treat', 40, true),
('Sweet Tea', 'Southern-style sweet tea.', 200, 'sweet_treat', 41, true),
('Coffee', 'Hot coffee with liquid sugar & half-and-half.', 200, 'on_site_only', 50, true),
('Bottled Water', 'Cold bottled water.', 200, 'on_site_only', 51, true);
