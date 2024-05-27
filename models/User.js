import mongoose from 'mongoose';
//схема юзера с обязателным имененм, уникальной почтой и паролем в хэше
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash:{
        type: String,
        required: true,
    },
    avatarUrl: String,

}, {
    timestamps: true,
},
);

export default mongoose.model('User', UserSchema);



