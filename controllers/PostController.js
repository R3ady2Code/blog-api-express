import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find()
			.populate({ path: 'author', select: ['fullName', 'imageUrl', 'login'] })
			.exec()

		res.json(posts.reverse())
	} catch (error) {
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id

		const updatedPost = await PostModel.findOneAndUpdate(
			{ _id: postId },
			{ $inc: { viewsCount: 1 } },
			{ new: true }
		).populate('author')

		if (!updatedPost) {
			return res.status(404).json({ message: 'Статья не найдена' })
		}

		res.json(updatedPost)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить статью',
		})
	}
}

export const remove = async (req, res) => {
	try {
		const postId = req.params.id

		const removedPost = await PostModel.findOneAndDelete({ _id: postId })

		if (!removedPost) {
			return res
				.status(404)
				.json({ message: 'Статью не удалось удалить или она не найдена' })
		}

		res.json({
			success: true,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось получить статью',
		})
	}
}

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			author: req.userId,
		})

		const post = await doc.save()

		res.json(post)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось создать статью',
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id

		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
			}
		)

		res.json({
			success: true,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось обновить статью',
		})
	}
}
