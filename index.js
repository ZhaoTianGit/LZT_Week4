const express = require('express')
const jwt = require('jsonwebtoken');
const app = express()
const port = 3000

app.use(express.json());
app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})

let dbUsers =[
  {
      username: "lee",
      password: "passwordlee",
      name: "lee zhao tian",
      email: "lzt@gmail.com"
  },
  {
      username: "hee",
      password: "passwordhee",
      name: "hee yee cinn",
      email: "hyc@gmail.com"
  },
  {
      username: "wee",
      password: "passwordwee",
      name: "wee mao phin",
      email: "wmp@gmail.com"
  }
] 

function login(username, password){
  console.log("someone try to login with",username , password);
  let matched = dbUsers.find(Element =>
      Element.username == username
  )
  if(matched){
      if(matched.password == password){
          return matched
      }else{
          return "Password not matched"
      }
  }else {
      return "User not found"
  }
}
app.post('/login', (req, res) => {
  let data = req.body
    const user = login(data.username, data.password);
    res.send(generateToken(user))
})

function register(
  regusername, 
  regpassword, 
  regname, 
  regemail
  ){
  //TODO: Check if username exist
  let regmatched = dbUsers.find(element =>
      element.username == regusername)
      if(regmatched){
          //console.log() is for server to read
          console.log("Server: User existed");
          //return is for user to read
          return "This user exist"
      }else {
  dbUsers.push({
      username: regusername,
      password: regpassword,
      name: regname,
      email :regemail
  })
  console.log("Successfully adding a new user");
  return "Registration Successful with the Username:" + regusername; // the sign '+' is used to combine line and var in "return"
}
}
app.post('/register', (req, res) => {
  let data = req.body
  res.send(
    register(
      //should be same as the POST function in client.http -- line 35 in client.http
      data.regusername,
      data.regpassword,
      data.regname,
      data.regemail
    )
  );
})

//To generate token
function generateToken(userProfile){
    return jwt.sign(
    userProfile,    //this is an obj
    'secret',       //password
    { expiresIn: '1h' }); //{ expiresIn: 60 * 60 })
}

// To verify JWT Token
function verifyToken(req, res, next){
    let header = req.headers.authorization
    console.log(header);

    let token = header.split(' ')[1];

    jwt.verify(token, 'my_supercalifragilisticexpialidocious_password_that_even_I_wont_remember', function(err, decoded){
        if(err){
            res.send("Invalid Token")
        }

        console.log(decoded); //bar
        next()
    })
}

app.get('/hello', verifyToken, (req, res) => { //verifyToken is added here
    res.send('Hello World!')
  })