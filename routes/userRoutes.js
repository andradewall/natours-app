const express = require('express')

const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')

const router = express.Router();

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password/:token', authController.resetPassword)

router.patch('/updateMyPassword', authController.protect, authController.updatePassword)

router.get('/me',
  authController.protect,
  userController.getMe,
  userController.getUser
)
router.patch('/updateMe', authController.protect, userController.updateMe)
router.delete('/deleteMe', authController.protect, userController.deleteMe)

router
  .route('/')
  .get(authController.protect, userController.getAllUsers)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router
