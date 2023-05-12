import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'

import {
	registerValidation,
	loginValidation,
	postCreateValidation,
	updateValidation,
	passwordValidation,
} from './validations.js'
import handleValidationErrors from './utils/handleValidationErrors.js'

import checkAuth from './utils/checkAuth.js'

import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'

mongoose
	.connect(
		'mongodb+srv://admin:wwwwww@cluster0.kw7w9aj.mongodb.net/blog?retryWrites=true&w=majority'
	)
	.then(() => console.log('DB is connected'))
	.catch(err => console.log(`DB error: ${err}`))

const app = express()

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post(
	'/auth/login',
	loginValidation,
	handleValidationErrors,
	UserController.login
)
app.post(
	'/auth/register',
	registerValidation,
	handleValidationErrors,
	UserController.register
)
app.get('/auth/me', checkAuth, UserController.getMe)
app.patch(
	'/auth/me',
	updateValidation,
	handleValidationErrors,
	checkAuth,
	UserController.update
)
app.patch(
	'/auth/password',
	passwordValidation,
	handleValidationErrors,
	checkAuth,
	UserController.changePassword
)

app.post('/upload', upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post(
	'/posts',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.create
)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch(
	'/posts/:id',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update
)

app.listen(4444, err => {
	if (err) {
		return console.log(err)
	}
	console.log('Server is listening')
})
