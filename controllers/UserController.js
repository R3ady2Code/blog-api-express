import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import UserModel from '../models/User.js'

export const register = async (req, res) => {
	try {
		const users = await UserModel.find()

		let newLoginIsUsed = false
		users.forEach(({ login }) => {
			if (login === req.body.login) newLoginIsUsed = true
		})

		if (newLoginIsUsed) {
			return res.status(401).json({
				message: 'Пользователь с таким логином уже существует',
			})
		}

		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new UserModel({
			login: req.body.login,
			fullName: req.body.fullName,
			passwordHash: hash,
			avatarUrl: req.body.avatarUrl,
		})

		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{ expiresIn: '30d' }
		)

		const { passwordHash, ...userData } = user._doc

		res.json({ ...userData, token })
	} catch (error) {
		res.status(500).json({ message: 'Не удалось зарегистрироваться' })
	}
}

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ login: req.body.login })

		if (!user) {
			return res.status(401).json({
				message: 'Неверный логин или пароль',
			})
		}

		const isValidPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		)

		if (!isValidPass) {
			return res.status(401).json({
				message: 'Неверный логин или пароль',
			})
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{ expiresIn: '30d' }
		)

		const { passwordHash, ...userData } = user._doc

		res.json({ ...userData, token })
	} catch (error) {
		res.status(500).json({ message: 'Не удалось авторизоваться' })
	}
}

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)

		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' })
		}

		const { passwordHash, ...userData } = user._doc

		res.json(userData)
	} catch (error) {
		res.status(500).json({
			message: error.message,
		})
	}
}

export const update = async (req, res) => {
	try {
		await UserModel.updateOne(
			{ _id: req.body._id },
			{
				login: req.body.login,
				fullName: req.body.fullName,
				avatarUrl: req.body.avatarUrl,
			}
		)
		const user = await UserModel.findOne({ _id: req.body._id })

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{ expiresIn: '30d' }
		)

		const { passwordHash, ...userData } = user._doc

		res.json({ ...userData, token })
	} catch (error) {
		res.status(500).json({
			message: error.message,
		})
	}
}

export const changePassword = async (req, res) => {
	try {
		if (req.body.oldPassword === req.body.newPassword)
			return res
				.status(400)
				.json({ message: 'Новый пароль должен отличаться от старого' })

		const user = await UserModel.findOne({ login: req.body.login })

		const isValidPass = await bcrypt.compare(
			req.body.oldPassword,
			user.passwordHash
		)

		if (!isValidPass) {
			return res.status(400).json({
				message: 'Неверный пароль',
			})
		}

		const newPassword = req.body.newPassword
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(newPassword, salt)

		await UserModel.updateOne(
			{ _id: req.body._id },
			{
				passwordHash: hash,
			}
		)

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{ expiresIn: '30d' }
		)

		res.json({ token })
	} catch (error) {
		res.status(500).json({
			message: error.message,
		})
	}
}
