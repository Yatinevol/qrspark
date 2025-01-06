import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        lowercase:true,
        unique:true,
        trim:true,
        required:true
    },
    pfp:{
        type:String,

    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    return next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
        return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
        return  jwt.sign(
            {
                _id:this._id,
                username:this.username,
                email: this.email
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:process.env.ACCESS_TOKEN_EXPIRY
            }
        )
}
export const User = mongoose.model("User",userSchema)