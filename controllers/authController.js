
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/authModel');

const secret = process.env.SECRET;
// when we hash password here then one issue happens that to validator defined in model hashed password is passed
//  which pass the password validator becaused hashed password satisfy all constraints always. To avoid that 
// if we use model validate function here then it solves the issue but now validate called twice once on plain password 
// when we do data.validate() and next when we do data.save() which is ineffecient. So we use mongoose.pre('save') hook
// const register = async (req,res) => {
//     try{
//         const data = new User(req.body)
//         // validate the password
//         await data.validate();
//         // generate 10 rounds of salt
//         const salt = await bcrypt.genSalt(10);
//         console.log(salt);
//         // hash the password with the generated salt
//         const hashedPassword = await bcrypt.hash(data.password,salt);
//         data.password = hashedPassword;
//         console.log(data);
//         const registeredUser = await data.save();
//         res.status(201).json(registeredUser);
//     } catch(err){
//         console.error(`Error in registration ${err}`);
//         res.status(400).json(`Error registering user ${err.message}`);
//     }
// }


const register = async (req, res) => {
    try {
        const user = new User(req.body);

        const registeredUser = await user.save();
        res.status(201).json({ id: registeredUser._id, name: registeredUser.name, email: registeredUser.email });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }
        console.error(err);
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const storedData = await User.findOne({ email });
        if (!storedData) {
            return res.status(401).json({ message: "Invalid Email or Password" })
        }

        const storedHash = storedData.password;
        const validPassword = await bcrypt.compare(password, storedHash);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        const user = { id: storedData._id, email: storedData.email };
        const token = jwt.sign(user, secret, { expiresIn: '7h' }) // never pass any password or any confidential information in jwt as jwt is base64 encoded which can be decoded easily

        return res.status(200).json(token);

    } catch (error) {
        return res.status(500).json({ message:"Something went wrong" })
    }
}

const profile = async (req, res) => {
    try {
        const email = req.user.email;
        const userData = await User.findOne({ email }).select('-password');
        if (!userData) {
            return res.status(404).json({ message: "user not found" });
        }

        return res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({  message:"Something went wrong" });
    }
}

module.exports = {
    register, login, profile
}