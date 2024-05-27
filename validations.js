import { body } from "express-validator";

export const loginValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть не менее 5 символов').isLength({min: 5}),
];

export const registerValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть не менее 5 символов').isLength({min: 5}),
    body('fullName', 'Должно быть указано имя').isLength({min: 3}),
    body('avatarUrl', 'Некорректная ссылка на аватар').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
    body('tags', 'Неверный формат тэгов(укажите массив)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
  ];