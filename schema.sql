-- ClubForge Database Schema
-- SQLite compatible

-- ============================================
-- CORE ENTITIES
-- ============================================

CREATE TABLE brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    website TEXT,
    adapter_system TEXT,  -- e.g., "surefit", "optifit", "tip_sleeve"
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE club_heads (
    id TEXT PRIMARY KEY,
    brand_id TEXT NOT NULL REFERENCES brands(id),
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    club_type TEXT NOT NULL,  -- 'driver', 'fairway', 'hybrid'
    
    -- Specs
    loft_options TEXT,  -- JSON array: ["9", "10.5", "12"]
    head_weight_grams INTEGER,
    adjustable BOOLEAN DEFAULT FALSE,
    
    -- Compatibility
    adapter_type TEXT NOT NULL,  -- brand-specific adapter system
    tip_size TEXT DEFAULT '.335',  -- '.335' or '.350'
    
    -- SEO/Display
    full_name TEXT,  -- "Titleist TSR3 Driver"
    slug TEXT UNIQUE,
    description TEXT,
    image_url TEXT,
    
    -- Meta
    discontinued BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shafts (
    id TEXT PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    
    -- Variants (JSON arrays)
    flex_options TEXT,      -- ["R", "S", "X"]
    weight_options TEXT,    -- ["50", "60", "70"]
    
    -- Specs (typical/base values)
    tip_size TEXT DEFAULT '.335',
    launch TEXT,            -- 'low', 'mid', 'high'
    spin TEXT,              -- 'low', 'mid', 'high'
    torque REAL,            -- degrees
    kick_point TEXT,        -- 'low', 'mid', 'high'
    
    -- SEO/Display
    full_name TEXT,         -- "Fujikura Ventus Blue"
    slug TEXT UNIQUE,
    description TEXT,
    image_url TEXT,
    
    -- Meta
    shaft_type TEXT DEFAULT 'graphite',  -- 'graphite', 'steel'
    club_type TEXT DEFAULT 'wood',       -- 'wood', 'iron', 'putter'
    discontinued BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE adapters (
    id TEXT PRIMARY KEY,
    brand_id TEXT NOT NULL REFERENCES brands(id),
    name TEXT NOT NULL,
    adapter_type TEXT NOT NULL,  -- matches club_heads.adapter_type
    tip_size TEXT DEFAULT '.335',
    
    -- Some adapters have settings
    adjustable BOOLEAN DEFAULT TRUE,
    loft_adjustment_range TEXT,  -- e.g., "-1.5 to +1.5"
    lie_adjustment BOOLEAN DEFAULT FALSE,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grips (
    id TEXT PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    
    -- Variants
    size_options TEXT,      -- JSON: ["standard", "midsize", "jumbo"]
    color_options TEXT,     -- JSON: ["black", "white", "blue"]
    
    -- Specs
    weight_grams INTEGER,   -- typical weight
    material TEXT,          -- 'rubber', 'cord', 'wrap'
    
    -- SEO/Display
    full_name TEXT,
    slug TEXT UNIQUE,
    image_url TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- COMPATIBILITY
-- ============================================

-- Explicit compatibility overrides (most are inferred from tip_size + adapter_type)
CREATE TABLE compatibility_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    head_id TEXT REFERENCES club_heads(id),
    shaft_id TEXT REFERENCES shafts(id),
    compatible BOOLEAN NOT NULL,
    notes TEXT,  -- e.g., "Requires different adapter"
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PRICING
-- ============================================

CREATE TABLE retailers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    website TEXT NOT NULL,
    affiliate_network TEXT,  -- 'awin', 'shareasale', 'direct'
    affiliate_id TEXT,
    commission_rate REAL,    -- decimal, e.g., 0.05 for 5%
    logo_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Polymorphic reference to any component
    component_type TEXT NOT NULL,  -- 'head', 'shaft', 'grip', 'adapter'
    component_id TEXT NOT NULL,
    
    -- Specific variant (optional)
    variant TEXT,  -- e.g., "9.0" for loft, "60S" for shaft weight+flex
    
    -- Retailer & Price
    retailer_id TEXT NOT NULL REFERENCES retailers(id),
    price_cents INTEGER NOT NULL,
    original_price_cents INTEGER,  -- for showing discounts
    currency TEXT DEFAULT 'USD',
    
    -- Availability
    in_stock BOOLEAN DEFAULT TRUE,
    url TEXT NOT NULL,
    
    -- Meta
    last_checked DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(component_type, component_id, variant, retailer_id)
);

-- ============================================
-- USER BUILDS
-- ============================================

CREATE TABLE builds (
    id TEXT PRIMARY KEY,
    
    -- Components
    head_id TEXT NOT NULL REFERENCES club_heads(id),
    head_variant TEXT,  -- selected loft
    
    shaft_id TEXT NOT NULL REFERENCES shafts(id),
    shaft_variant TEXT,  -- selected weight + flex, e.g., "60S"
    
    adapter_id TEXT REFERENCES adapters(id),
    
    grip_id TEXT REFERENCES grips(id),
    grip_variant TEXT,  -- selected size
    
    -- Calculated
    total_price_cents INTEGER,
    
    -- Sharing
    share_slug TEXT UNIQUE,
    
    -- Optional user association
    user_id TEXT,
    name TEXT,  -- user-given name for the build
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_heads_brand ON club_heads(brand_id);
CREATE INDEX idx_heads_type ON club_heads(club_type);
CREATE INDEX idx_heads_year ON club_heads(year);
CREATE INDEX idx_heads_slug ON club_heads(slug);

CREATE INDEX idx_shafts_brand ON shafts(brand);
CREATE INDEX idx_shafts_type ON shafts(club_type);
CREATE INDEX idx_shafts_slug ON shafts(slug);

CREATE INDEX idx_prices_component ON prices(component_type, component_id);
CREATE INDEX idx_prices_retailer ON prices(retailer_id);
CREATE INDEX idx_prices_updated ON prices(last_checked);

CREATE INDEX idx_builds_share ON builds(share_slug);

-- ============================================
-- SEED DATA: BRANDS
-- ============================================

INSERT INTO brands (id, name, adapter_system, website) VALUES
('titleist', 'Titleist', 'surefit', 'https://www.titleist.com'),
('taylormade', 'TaylorMade', 'tip_sleeve', 'https://www.taylormadegolf.com'),
('callaway', 'Callaway', 'optifit', 'https://www.callawaygolf.com'),
('ping', 'PING', 'ping_adapter', 'https://ping.com'),
('cobra', 'Cobra', 'myfly', 'https://www.cobragolf.com');

-- ============================================
-- SEED DATA: ADAPTERS
-- ============================================

INSERT INTO adapters (id, brand_id, name, adapter_type, tip_size, loft_adjustment_range) VALUES
('titleist_surefit', 'titleist', 'SureFit Adapter', 'surefit', '.335', '-1.5 to +1.5'),
('taylormade_sleeve', 'taylormade', 'TaylorMade Tip Sleeve', 'tip_sleeve', '.335', '-2 to +2'),
('callaway_optifit', 'callaway', 'OptiFit Hosel', 'optifit', '.335', '-1 to +2'),
('ping_adapter', 'ping', 'PING Adapter', 'ping_adapter', '.335', '-1.5 to +1.5'),
('cobra_myfly', 'cobra', 'MyFly8 Adapter', 'myfly', '.335', '-1.5 to +1.5');

-- ============================================
-- SEED DATA: RETAILERS
-- ============================================

INSERT INTO retailers (id, name, website, affiliate_network, commission_rate) VALUES
('2ndswing', '2nd Swing', 'https://www.2ndswing.com', 'awin', 0.05),
('globalgolf', 'GlobalGolf', 'https://www.globalgolf.com', 'unknown', 0.05),
('golfworks', 'The GolfWorks', 'https://www.golfworks.com', 'unknown', 0.05),
('rockbottom', 'Rock Bottom Golf', 'https://www.rockbottomgolf.com', 'unknown', 0.05);
