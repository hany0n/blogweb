import mongoose from 'mongoose';
//схема юзера с обязателным имененм, уникальной почтой и паролем в хэше
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        unique: true,
    },
    tags:{
        type: Array,
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: String,
    /* likes: {
        type: [String],
        default: [],
    } */
}, {
    timestamps: true,
},
);

export default mongoose.model('Post', PostSchema);



