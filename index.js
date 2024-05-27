import express from 'express';
import multer from 'multer';

import mongoose from 'mongoose';

import * as UserController from './controllers/UserController.js';

import * as PostController from './controllers/PostController.js';

import {registerValidator, loginValidator, postCreateValidation} from './validations.js';


import checkAuth from './utils/checkAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';


mongoose.connect(
    'mongodb+srv://tzunch:1234@cluster0.yquh1rz.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => 
    console.log('DB is UP'))
    .catch((err) => console.log('DB connection error', err));

    const app = express();
//функция созранения картинок 
    const storage = multer.diskStorage({
        destination: (_, __, cb) => {
            cb(null, 'uploads');
        },
        filename: (_, file, cb) => {
            cb(null, file.originalname);
        },
    });



const upload = multer({storage});

//читаем жсон который приходит нам в запросе
app.use(express.json());

app.use('/uploads', express.static('uploads'));

//авторизация
app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);
//регистрация
app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);


app.post('/upload', checkAuth,upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}` ,
    });
});


app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth,postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('SErver is UP')
});