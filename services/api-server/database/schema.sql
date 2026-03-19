-- QuickClaim Database Schema for PostgreSQL/Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50),
    platform VARCHAR(20) CHECK (platform IN ('swiggy', 'zomato')),
    vehicle_type VARCHAR(20) CHECK (vehicle_type IN ('bike', 'scooter', 'cycle')),
    license_number VARCHAR(50),
    firebase_uid VARCHAR(128),
    profile_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Claims Table
CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    claim_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    location_address TEXT,
    weather_condition VARCHAR(50),
    temperature DECIMAL(5, 2),
    rainfall DECIMAL(5, 2),
    aqi INTEGER,
    traffic_delay INTEGER,
    risk_score DECIMAL(3, 2) CHECK (risk_score >= 0 AND risk_score <= 1),
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    rejection_reason TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payouts Table
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    claim_id UUID REFERENCES claims(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    payment_method VARCHAR(50) DEFAULT 'bank_transfer',
    transaction_id VARCHAR(100),
    bank_account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    upi_id VARCHAR(100),
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fraud Flags Table
CREATE TABLE fraud_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    claim_id UUID REFERENCES claims(id) ON DELETE SET NULL,
    flag_type VARCHAR(50) NOT NULL CHECK (flag_type IN ('gps_spoofing', 'duplicate_claim', 'suspicious_pattern', 'fake_location', 'multiple_devices')),
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT,
    evidence JSONB,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_positive')),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by VARCHAR(100),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Location History Table
CREATE TABLE location_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(6, 2),
    altitude DECIMAL(8, 2),
    speed DECIMAL(6, 2),
    heading DECIMAL(5, 2),
    is_spoofed BOOLEAN DEFAULT false,
    distance_from_last DECIMAL(10, 2),
    time_from_last INTEGER,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Risk History Table
CREATE TABLE risk_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    risk_score DECIMAL(3, 2) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    weather_condition VARCHAR(50),
    temperature DECIMAL(5, 2),
    rainfall DECIMAL(5, 2),
    aqi INTEGER,
    traffic_delay INTEGER,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('claim_approved', 'claim_rejected', 'payout_processed', 'fraud_alert', 'weather_alert', 'general')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_claims_user_id ON claims(user_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_created_at ON claims(created_at DESC);
CREATE INDEX idx_payouts_user_id ON payouts(user_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_fraud_flags_user_id ON fraud_flags(user_id);
CREATE INDEX idx_fraud_flags_status ON fraud_flags(status);
CREATE INDEX idx_location_history_user_id ON location_history(user_id);
CREATE INDEX idx_location_history_recorded_at ON location_history(recorded_at DESC);
CREATE INDEX idx_risk_history_user_id ON risk_history(user_id);
CREATE INDEX idx_risk_history_recorded_at ON risk_history(recorded_at DESC);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON payouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fraud_flags_updated_at BEFORE UPDATE ON fraud_flags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
