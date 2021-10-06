const TodoModel=require('../models/todo.model')


exports.create=async (req,res,next) =>{
    try {
        const {_id}=req.user
        const {title,category}=req.body
        const data={
            title,
            complete:false,
            category,
            createdBy:_id
        }
        const newTodoList=await TodoModel.create(data)
        return res.status(201).json({
            status:"Success",
            message:"Data saved successfully!",
            data:newTodoList
        });
    } catch (error) {
        next(error)
    }
}

exports.getAllListByUser=async(req,res,next)=>{
    try {
        const {_id}=req.user
        const todoLists=await TodoModel.find({createdBy:_id}).sort({createdAt:1})
        return res.status(201).json({
            status:"Success",
            data:todoLists
        });
    } catch (error) {
        next(error)
    }
}

exports.getTodoById=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const data=await TodoModel.findById(id)
        if(data){
            return res.status(201).json({
                status:"Success",
                data:data
            });
        }else{
            return next(new AppError("No data Found",404));
        }
      
    } catch (error) {
        next(error)
    }
}

exports.updateById=async (req,res,next)=>{
    try {
        const {id}=req.params;
        const {title,complete,category}=req.body;
        const data={title,complete,category,updatedAt:new Date()}
    const data1= await TodoModel.findByIdAndUpdate(id,data,{runValidators:true})
        return res.status(201).json({
            status:"Success",
            message:"Data updated successfully!",
            data:data1
        });
    } catch (error) {
      next(error)
    }
}

exports.deleteById=async(req,res,next)=>{
   try {
    const {id}=req.params ;
    await TodoModel.findByIdAndDelete(id)
    return res.status(201).json({
        status:"Success",
        message:"Data deleted successfully!",
    });
   } catch (error) {
    next(error)
   }

}