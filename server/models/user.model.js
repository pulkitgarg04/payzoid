import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxLength: 50,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    phone: {
        type: String,
    },
    gender: {
        type: String,
    },
    bio: {
        type: String,
    },
    avatar: {
        type: String,
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    },
    postalcode: {
        type: String,
    },
    taxid: {
        type: String,
    }
}, {
    timestamps: true,
});


UserSchema.methods.createHash = async function (password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.validatePassword = async function (incomingPassword) {
    return await bcrypt.compare(incomingPassword, this.password);
};

export const User = mongoose.model('User', UserSchema);