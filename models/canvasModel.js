
const mongoose = require('mongoose');

const canvasSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    sharedWith:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    elements:[{
        type:mongoose.Schema.Types.Mixed,
        default:[]
    }],
    
},
{
  timestamps: {createdAt:'createdAt',updatedAt:'modifiedAt'}
}

)

const Canvas = mongoose.model('Canvas',canvasSchema)

module.exports = Canvas;