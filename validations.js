import { body } from 'express-validator'

export const registerValidation = [
	body('password', 'Пароль должен содержать минимум 5 символов').isLength({
		min: 5,
	}),
	body('fullName', 'Укажите корректное имя').isLength({ min: 3 }),
	body('login', 'Логин должен содержать минимум 3 символа').isLength({
		min: 3,
	}),
	body('avatarUrl', 'Неверная ссылка на аватарку').optional(),
]

export const updateValidation = [
	body('fullName', 'Укажите корректное имя').isLength({ min: 3 }),
	body('login', 'Логин должен содержать минимум 3 символа').isLength({
		min: 3,
	}),
	body('avatarUrl', 'Неверная ссылка на аватарку').optional(),
]

export const passwordValidation = [
	body(
		'newPassword',
		'Новый пароль должен содержать минимум 5 символов'
	).isLength({
		min: 5,
	}),
]

export const postCreateValidation = [
	body('title', 'Введите заголовок статьи(минимум 3 символа)')
		.isLength({ min: 3 })
		.isString(),
	body('text', 'Введите текст статьи(минимум 5 символов)')
		.isLength({ min: 5 })
		.isString(),
	body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]
