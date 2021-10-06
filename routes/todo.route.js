
const express=require('express');
const router =express.Router();
const {protect}=require('../middlewares/Protect')
const {create,getAllListByUser, getTodoById, updateById, deleteById}=require('../controllers/todo.controller')

router.route('/').post(protect,create)
router.route('/ByUser').get(protect,getAllListByUser)
router.route('/:id').get(protect,getTodoById)
router.route('/:id').put(protect,updateById)
router.route('/:id').delete(protect,deleteById)

module.exports =router