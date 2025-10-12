export const WATER_QUALITY_THRESHOLDS = {
    nitrogen: {
        safe: { min: 0, max: 5 },
        moderate: { min: 5, max: 10 },
        critical: { min: 10, max: Infinity }
    },
    ph: {
        safe: { min: 6.5, max: 8.5 },
        moderate: { min: 5.5, max: 9.5 },
        critical: { min: 0, max: 14 }
    },
    temperature: {
        safe: { min: 15, max: 25 },
        moderate: { min: 10, max: 30 },
        critical: { min: 0, max: 50 }
    },
    turbidity: {
        safe: { min: 0, max: 5 },
        moderate: { min: 5, max: 20 },
        critical: { min: 20, max: Infinity }
    },
    dissolvedOxygen: {
        safe: { min: 6, max: 14 },
        moderate: { min: 4, max: 6 },
        critical: { min: 0, max: 4 }
    }
};

export const USER_ROLES = {
    USER: 'user',
    AUTHORITY: 'authority',
    ADMIN: 'admin'
};

export const REPORT_TYPES = {
    HOURLY: 'hourly',
    DAILY: 'daily'
};

export const QUALITY_CLASSIFICATIONS = {
    SAFE: 'safe',
    MODERATE: 'moderate',
    CRITICAL: 'critical'
};

export const SENSOR_RANGES = {
    nitrogen: { min: 0, max: 15 },
    ph: { min: 5.0, max: 9.5 },
    temperature: { min: 10, max: 35 },
    turbidity: { min: 0, max: 30 },
    dissolvedOxygen: { min: 2, max: 12 }
};