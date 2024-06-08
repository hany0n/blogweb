import express from 'express';
import multer from 'multer';
import cors from 'cors';
import mongoose from 'mongoose';


import {UserController, PostController} from './controllers/index.js';

import {registerValidator, loginValidator, postCreateValidation} from './validations.js';

import {handleValidationErrors, checkAuth} from './utils/index.js';


mongoose.connect(
    'mongodb+srv://dagger2010:QtZtOGAsNcfO7Pr9@cluster0.vwv78wd.mongodb.net/U_blog?retryWrites=true&w=majority&appName=Cluster0')
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
app.use(cors());
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


app.get('/tags', PostController.getLastTags);


app.get('/posts', PostController.getAll);
//app.get('/posts/tags', PostController.getLastTags);
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