const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Course = require('./Course')
const Setting = require('./Setting')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    tel: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['student', 'instructor', 'admin']
    },
    studentId: {
        type: String,
        required: function () { return this.userType === 'student'; }
    },
    instructorId: {
        type: String,
        required: function () { return this.userType === 'instructor'; }
    },
    courseCodes: {
        type: [String],
        default: []
    },
    department: {
        type: String,
    }
})

//static method to signup user
userSchema.statics.signup = async function (name, email, password, tel, userType, studentId, instructorId, courseCodes, department) {

    //validation 
    if (!name) {
        throw Error("name is required");
    }

    if (!email) {
        throw Error("Email is required");
    }

    if (!password) {
        throw Error("Password is required");
    }

    if (!tel) {
        throw Error("Phone number is required");
    }

    if (!validator.isEmail(email)) {
        throw Error("Email is not valid");
    }

    // Check if the phone number is valid  matches either format
    if (!(/^\d{9}$/).test(tel) && !(/^\+\d{3} \d{9}$/).test(tel)) {
        throw Error("your phone number should be 9 digits (if using a postal code, separate with a space");
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
        throw Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, a special character and one number");
    }

    const existingUser = await this.findOne({ email });
    if (existingUser) {
        throw Error("Email already in use")
    }

    // Additional validation based on userType
    if (userType === 'student' && !studentId) {
        throw Error("Student ID is required for students");
    }

    if (userType === 'instructor' && !instructorId) {
        throw Error("Instructor ID is required for instructors");
    }

    // Check if the provided course codes are valid
    if (courseCodes?.length > 0) {
        for (let code of courseCodes) {
            const course = await Course.findOne({ code });
            if (!course) throw Error(`Course with code ${code} does not exist`);
        }
    }

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //Create user
    const user = await this.create({ name, email, password: hash, tel, userType, studentId, instructorId, courseCodes, department });

    // Create default settings for the user
    const defaultSettings = {
        user: user._id
    };

    await Setting.create(defaultSettings);

    return user;
}

//static method to login user
userSchema.statics.login = async function (email, password) {
    //validation 
    if (!email || !password) {
        throw Error("All fields must be filled");
    }

    const user = await this.findOne({ email });

    if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('username or email does not exist')
}

const User = mongoose.model('User', userSchema);

module.exports = User;
