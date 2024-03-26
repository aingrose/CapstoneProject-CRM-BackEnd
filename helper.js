import { client } from "./index.js";
import bcrypt from "bcrypt";



async function storedb(name,email,gender,state,contact,city,address){
    return await client.db("Clients").collection("Users").insertOne({Name:name,Email:email,Gender:gender,State:state,Contact:contact,City:city,Address:address})
   
}

async function getdata(){
    return await client.db("Clients").collection("Users").find().toArray();
}

async function createUser(Username,Password){
    return await client.db("Clients").collection("Register").insertOne({username:Username,password:Password})
}



async function getuserbyname(Username){
    return await client.db("Clients").collection("Register").findOne({username:Username})
}

async function getuser(Username){
    return await client.db("Clients").collection("Register").findOne({username:Username})
}

async function genPassword(password){
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);
    return hashPassword;

}
export {storedb,getdata,createUser,getuserbyname,genPassword,getuser}