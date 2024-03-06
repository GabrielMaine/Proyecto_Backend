import multer from 'multer'
import { __dirname } from '../helpers/utils.js'

const destination = function (req, file, cb) {
    let uploadPath = ''
    if (file.mimetype.startsWith('image')) {
        if (file.originalname.startsWith('profile')) {
            uploadPath = 'profiles'
        } else if (file.originalname.startsWith('product')) {
            uploadPath = 'products'
        } else {
            uploadPath = 'documents'
        }
    } else {
        uploadPath = 'documents'
    }
    const absolutePath = `${__dirname}/../../public/${uploadPath}`

    cb(null, absolutePath)
}

const storage = multer.diskStorage({
    destination: destination,
    filename: function (req, file, cb) {
        const userId = req.params.id
        let fileName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        if (file.originalname.startsWith('product')) {
            fileName = uniqueSuffix + '-' + file.originalname
        } else {
            userId ? (fileName = userId + '-' + file.originalname) : (fileName = uniqueSuffix + '-' + file.originalname)
        }
        cb(null, fileName)
    },
})

export const uploader = multer({ storage })
