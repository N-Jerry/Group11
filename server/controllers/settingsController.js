const Setting = require('../models/Setting');
const User = require('../models/User');

// Method to update settings
const updateSettings = async (userID, notificationPreferences, securitySettings, privacySettings) => {
    try {
        const user = await User.findById(userID);
        if (!user) throw new Error('User not found');

        let userSettings = await Setting.findOne({ user: userID });

        if (!userSettings) {
            userSettings = new Setting({
                user: userID,
                notificationPreferences,
                securitySettings,
                privacySettings
            });
        } else {
            if (notificationPreferences) userSettings.notificationPreferences = notificationPreferences;
            if (securitySettings) userSettings.securitySettings = securitySettings;
            if (privacySettings) userSettings.privacySettings = privacySettings;
        }

        await userSettings.save();
        return userSettings;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Method to view settings
const viewSettings = async (userID) => {
    try {
        const userSettings = await Setting.findOne({ user: userID });
        if (!userSettings) throw new Error('Settings not found');

        return userSettings;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { updateSettings, viewSettings };
