CREATE TABLE users (
  id UUID PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'sales')),
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE settings (
  id UUID PRIMARY KEY,
  company_name TEXT NOT NULL,
  logo_text TEXT NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT,
  country TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  tax_id TEXT,
  currency_code TEXT NOT NULL,
  currency_symbol TEXT NOT NULL,
  currency_position TEXT NOT NULL CHECK (currency_position IN ('prefix', 'suffix')),
  decimal_places INTEGER NOT NULL DEFAULT 2,
  default_tax_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_label TEXT NOT NULL DEFAULT 'Tax',
  payment_terms TEXT,
  invoice_prefix TEXT NOT NULL DEFAULT 'INV',
  quote_prefix TEXT NOT NULL DEFAULT 'EST',
  payment_prefix TEXT NOT NULL DEFAULT 'PAY',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE clients (
  id UUID PRIMARY KEY,
  display_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT,
  description TEXT,
  unit TEXT NOT NULL DEFAULT 'unit',
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  default_tax_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  reference TEXT,
  notes TEXT,
  terms TEXT,
  currency_code TEXT NOT NULL,
  source_quote_id UUID,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE invoice_items (
  id UUID PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'unit',
  quantity NUMERIC(12,2) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  tax_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE quotes (
  id UUID PRIMARY KEY,
  quote_number TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  issue_date DATE NOT NULL,
  valid_until DATE NOT NULL,
  reference TEXT,
  notes TEXT,
  terms TEXT,
  currency_code TEXT NOT NULL,
  converted_invoice_id UUID,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quote_items (
  id UUID PRIMARY KEY,
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'unit',
  quantity NUMERIC(12,2) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  tax_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE payments (
  id UUID PRIMARY KEY,
  payment_number TEXT NOT NULL UNIQUE,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  payment_date DATE NOT NULL,
  payment_method TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  reference TEXT,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE recurring_profiles (
  id UUID PRIMARY KEY,
  profile_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('active', 'paused')),
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  interval_count INTEGER NOT NULL DEFAULT 1,
  next_run_date DATE NOT NULL,
  payment_term_days INTEGER NOT NULL DEFAULT 14,
  reference TEXT,
  notes TEXT,
  terms TEXT,
  currency_code TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  last_generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE recurring_profile_items (
  id UUID PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES recurring_profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'unit',
  quantity NUMERIC(12,2) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  tax_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);
