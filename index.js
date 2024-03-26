import  express  from "express";
import  {MongoClient}  from "mongodb";
import  {storedb,getdata,createUser,getuserbyname,genPassword,getuser}  from "./helper.js";
import cors from "cors";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config'


let app = express();


app.use(cors());
app.use(express.json());

// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());


let port = 5000

const MONGO_URL = "mongodb+srv://Mahesh:8610382228@cluster0.0uefsyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


async function createconnetion(){
    try{
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        console.log("Mongodb is connected");
        return client;
    }
    catch(err){
        console.log(err);
        process.exit(1)
    }
   
}  
                                                                                                
 export const client = await createconnetion()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

app.post("/register", async(req,res)=>{

    try{
        const {name,email,gender,state,contact,city,address} = req.body;
        

        const storeddb =  await storedb(name,email,gender,state,contact,city,address);
         res.send(storeddb)  
         console.log("stooredb",storedb) 
           
    }
    catch(err){
      res.json({Error:"Internal server Error"})
    }
   
});


app.post("/create", async (req, res) => {
    const { Username, Password } = req.body;

    try {
        const isUserExist = await getuserbyname(Username);
        if (isUserExist) {
            return res.status(200).send({ message: 'User already exists' });
        }

        else if (!/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[@!$%&_#]).{8,}$/g.test(Password)) {
            return res.status(202).send({ message: "Password doesn't match" });
        }

        const hashPassword = await genPassword(Password);
        const db = createUser(Username, hashPassword);
        return res.status(201).json(db);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/login', async(req,res)=>{
    const {Username,Password} = req.body;
 

  const  userfromdb = await getuser(Username);
  console.log(userfromdb)

   let passwordfromdb =  userfromdb.password


  const ismatch = await bcrypt.compare(Password,passwordfromdb);


if(!ismatch){
   res.status(201).json({message: "invalid credential"})
   return ;
 }
  else{   
let token = jwt.sign({id:userfromdb._id},process.env.SECRET_KEY)
console.log(token);

return res.status(200).json({ message: "Successfully logged in", token: token })


  }


})



// app.post("/create", async (req,res) => {
//     try{
//         let data = req.body
//         let emailid=data.email
        
//         let userExist = await userData.findOne({"emailId":emailid})
//         if(userExist){
//             return res.json({error:"User already exits"}).status(400)
//         }
        
//         const date = Date.now().toString();

//         const hashPassword = async (password) => {
//             return new Promise((resolve, reject) => {
//                 bcrypt.hash(password, 10, (err, hash) => {
//                     if (err) reject(err);
//                     resolve(hash);
//                 });
//             });
//         };
        
//         const hashedPassword = await hashPassword(data.pass.toString());
//         const dataToInsert = {
//             "userId": date,
//             "emailId": data.email,
//             "password": hashedPassword,
            
//         }


//         let registerUser = await userData.insertOne(dataToInsert)
    
//         res.status(200).json({message:"User Registered Successfully",userId:date})
//     }catch(error){
//         res.status(500).json({ error: "Internal Server Error" });
//     } 
// })



// app.post("/login",async(req,res)=>{
//     const {username,password} =req.body;

//     const userfromdb = await getuser(username,password);

//     if(!userfromdb){
//         res.send("invalid crecdial")
//     }else{
//         res.send("successfully logged")
//     }
     
    
// })

app.get("/clients", async(req,res)=>{
    const data =  await getdata();

    res.json(data)

})

app.post("/gmail",(req,res)=>{

  const {to,subject,message} = req.body;
  
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'maheshrdrv@gmail.com',
      pass: 'gpzozkacjhysjwyl'
    }
  });
  
  var mailOptions = {
    from: "20eel10@kpriet.ac.in",
    to: to,
    subject: subject,
    text: message
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
        res.status(200).send('Email sent: ' + info.response)
      console.log('Email sent: ' + info.response);
    }
  });
  
  
})



app.listen(port,()=>console.log(`port is listening on ${port}`))