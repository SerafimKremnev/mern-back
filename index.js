import express from 'express'
import mongoose from "mongoose";
import {loginValidation, postCreateValidation, registerValidation} from './validation.js'
import {PostController, UserController} from "./controllers/index.js"
import multer from 'multer'
import {checkAuth, handleValidationErrors} from "./utils/index.js";

mongoose.connect('mongodb+srv://serafimkremnev:11062004@cluster0.hoqxm7u.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB OK'))
  .catch((e) => console.log('DB ERROR', e))

const app = express()
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({storage})


app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})
app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)


app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

//на каком порту будет запуск
app.listen(4444, (err) => {
  if(err) {
    return console.log(err)
  }
  console.log('Server OK')
})