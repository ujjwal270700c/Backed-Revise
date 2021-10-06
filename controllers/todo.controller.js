const TodoModel=require('../models/todo.model')

// func to create todo 
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

// func to getAll data by Login user
exports.getAllListByUser=async(req,res,next)=>{
    try {
        const {limit,offset}=req.query;
        let perPage=parseInt(limit)
        let Page=limit * parseInt(offset) 
        let dataLimit=perPage ? perPage:5;
        let pageNo=Page > 0 ? Page:0;
        const {_id}=req.user
        const todoLists=await TodoModel.find({createdBy:_id}).sort({createdAt:1}).limit(dataLimit).skip(PageNo).lean().exec();
        return res.status(201).json({
            status:"Success",
            data:todoLists
        });
    } catch (error) {
        next(error)
    }
}

// func to get data by id
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

// func to update specific todo
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

// func to delete specific todo
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

// func filter all todo by category and title
exports.filterByTitleAndCategory=async (req,res,next)=>{
    try {
        const {title,category}=req.query
        console.log(title,category);
        let findQuery={}
        if(category && category !== ""){
            findQuery.category=category
        }
        if(title && title !==""){
            findQuery.title={$regex:title,$options: '$i'};
        }
        const data= await TodoModel.find(findQuery)
        return res.status(201).json({
            status:"Success",
            data:data
        });
    } catch (error) {
      next(error)
    }
}