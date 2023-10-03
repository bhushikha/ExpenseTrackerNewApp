

// const User = require('../models/user');

// const signup = async (req, res) => {
//     console.log('Signup controller is being executed.');
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//         return res.status(400).json({ message: 'Please provide name, email, and password.' });
//     }

//     try {
//         const newUser = await User.create({ name, email, password });
//         res.status(201).json({ message: 'Successfully created a new user!', user: newUser });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while creating the user.' });
//     }
// };


// const login = async (req, res) => {
//     console.log('Login controller is being executed.');
//     const { email, password } = req.body;
//     console.log(password);
//     if (!email || !password) {
//         return res.status(400).json({ message: 'Please provide email and password.' });
//     } else {
//         try {
//             const user = await User.findOne({ where: { email: email } });
//             if (!user) {
//                 return res.status(401).json({ message: 'User not found.' });
//             }

//             // Add these console.log statements to debug the login process
//             console.log('User:', user);
//             console.log('Provided Password:', password);
//             console.log('Password Comparison Result:', password === user.password);

//             if (password !== user.password) {
//                 return res.status(401).json({ message: 'Incorrect password.' });
//             }
//             res.status(200).json({ message: 'Login successful!', user: user });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ message: 'An error occurred during login.' });
//         }
//     }
// }


// module.exports = { signup, login };


const User = require('../models/users');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const Filelink = require('../models/filelink');

function isstringinvalid(string) {
    if (string == undefined || string.length === 0) {
        return true
    } else {
        return false
    }
}
function uploadToS3(data, filename) {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        // Bucket:BUCKET_NAME
    })
    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('something went wrong', err)
                reject(err)

            }
            else {
                // console.log('success',s3response)
                resolve(s3response.Location);
            }
        })
    })



}

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('email', email)
        if (isstringinvalid(name) || isstringinvalid(email || isstringinvalid(password))) {
            return res.status(404).json({ err: "Bad parameters . Something is missing" })
        }
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            console.log(err)
            await User.create({ name, email, password: hash })
            res.status(201).json({ message: 'Successfuly create new user' })
        })
    } catch (err) {
        res.status(500).json(err);
    }

}

const generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name, ispremiumuser }, 'secretkey');
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (isstringinvalid(email) || isstringinvalid(password)) {
            return res.status(400).json({ message: 'EMail id or password is missing ', success: false })
        }
        console.log(password);
        const user = await User.findAll({ where: { email } })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    throw new Error('Something went wrong')
                }
                if (result === true) {
                    return res.status(200).json({ success: true, message: "User logged in successfully", token: generateAccessToken(user[0].id, user[0].name, user[0].ispremiumuser) })
                }
                else {
                    return res.status(400).json({ success: false, message: 'Password is incorrect' })
                }
            })
        } else {
            return res.status(404).json({ success: false, message: 'User Doesnot exitst' })
        }
    } catch (err) {
        res.status(500).json({ message: err, success: false })
    }
}



module.exports = {
    signup,
    login,
    generateAccessToken

}