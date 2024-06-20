const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notificationPreferences: {
        type: Map,
        of: Boolean,
        default: {
            email: true,
            sms: false,
            push: true
        }
    },
    securitySettings: {
        type: Map,
        of: String,
        default: {
            twoFactorAuth: 'enabled',
            loginAlerts: 'enabled'
        }
    },
    privacySettings: {
        type: Map,
        of: String,
        default: {
            dataSharing: 'disabled',
            activityStatus: 'hidden'
        }
    }
});

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;
