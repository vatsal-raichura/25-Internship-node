console.log("user file is created")

var userName="Vatsal"
 var userAge=21

const printUserData =(a)=>{
    console.log("print data",a)
}


// module.exports(userName)
// module.exports(userAge)\

module.exports={
    userName,userAge,printUserData
}