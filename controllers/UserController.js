import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
//import { validationResult } from "express-validator";

import UserModel from '../models/User.js';

export const register = async (req, res) =>{
    try {
    //Достаём пароль из запроса и шифруем его бкриптом
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    //готовим пользователя
    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
    })
    //сохраняем результат из монго в юзера
    const user = await doc.save();
    //шифруем токен по секретному ключу и стави ему время жизн, 30 дней
    const token = jwt.sign({
        _id: user._id,
    },
    'secret333', 
    {
        expiresIn: '30d',
    },);


    const {passwordHash, ...userData} = user._doc;


    res.json({
        ...userData,
        token,
    });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось провести регистрацию',
        });
    }
};

export const login = async (req, res) => {
    try{
        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }
        //сравним пароли в ответе и в документе 
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        //если не совпадают, то 
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }
        //генерируем токен
        const token = jwt.sign({
            _id: user._id,
        },
        'secret333', 
        {
            expiresIn: '30d',
        },);

        //забираем информацию о пользователе, убираем хэш и возвращаем ответ
        const {passwordHash, ...userData} = user._doc;


        res.json({
        ...userData,
        token,
    });

    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user){
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

    const {passwordHash, ...userData} = user._doc;


    res.json(userData);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа',
        });
    }
};

/* export const likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if(blog.likes.includes(req.user.id)){
            blog.likes = blog.likes.filter((userId) => userId !== req.user.id)
            await blog.save()

            return res.status(200).json({msg: 'Successfully unliked the blog'})
        } else {
            blog.likes.push(req.user.id)
            await blog.save()

            return res.status(200).json({msg: "Successfully liked the blog"})
        }

    } catch (error) {
        return res.status(500).json(error)
    }
}; */