import PostModel from "../models/Post.js";
import Post from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec()
    res.json(posts)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Не удалось получить статьи"
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = await req.params.id
    const post = await PostModel.findById(postId)

    if(!post) {
      return res.status(404).json({
        message: "Статья не найдена"
      })
    }
    res.json(post)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Не удалось получить статью"
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = await req.params.id
    const post = await PostModel.findById(postId)
    if(!post) {
      return res.status(404).json({
        message: "Статья не найдена"
      })
    } else {
      await PostModel.findByIdAndDelete(postId)
      res.json({
        success: true
      })
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Не удалось удалить статью"
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    })
    const post = await doc.save()
    return res.json(post)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Не удалось создать статью"
    })
  }
}

export const update = async (req, res) => {
  try {
    const postId = await req.params.id
    await PostModel.updateOne({
      _id:postId
    }, {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.body.user,
      tags: req.body.tags,
    })
    res.json({
      success: true
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Не удалось обновить статью"
    })
  }
}
