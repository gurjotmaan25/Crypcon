import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required: true
    },
    username :{
        type : String,
        required: true
    },
    password :{
        type : String,
        required: true
    }, 
    role :{
        type: Number
    },
    watchlist: [
        {
          name: String,
          id: String,        // Add id field
          image: String, 
          // type: mongoose.Schema.Types.ObjectId,
          // ref: 'Coin', // Reference to the Coin model
        },
      ],
}, {timestamps:true})
export default mongoose.model('users', userSchema)