const Setting = require('../models/Setting');
const User = require('../models/User');

// Method to update settings
const updateSettings = async (req, res) => {
    const { userID } = req.params;
    const { notificationPreferences, securitySettings, privacySettings } = req.body;
    
    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

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
        res.status(200).json(userSettings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Method to view settings
const viewSettings = async (req, res) => {
    const { userID } = req.params;
    try {
        const userSettings = await Setting.findOne({ user: userID });
        if (!userSettings) {
            return res.status(404).json({ error: 'Settings not found' });
        }

        res.status(200).json(userSettings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { updateSettings, viewSettings };
