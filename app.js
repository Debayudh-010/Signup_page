const express = require ("express");
const https = require ("https");
const app= express();

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}))


app.get("/", (req,res)=>{
    res.sendFile(__dirname +"/signup.html");
})

app.post("/", (req,res)=>{

    const fName= req.body.fName;
    const lName= req.body.lName;
    const email= req.body.email;
    console.log(fName, lName, email);
    const data= {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: fName,
                LNAME: lName
            }
        }],
        update_existing:true
    };
    const jsonData= JSON.stringify(data);

    //to sub/unsub the syntax for POST: {endpoint}/lists/{list_id}
    //endpoint: https://usX.api.mailchimp.com/
    const url="https://us13.api.mailchimp.com/3.0/lists/6f6ba8f8fd";
    
    const options={
        method: "POST",
        auth: "deba:4af8f95506ee0ee1ee4607c56f8bb6c6-us13"
    }

    const request=https.request(url, options, (response)=>{
        if(response.statusCode!=200)
            res.sendFile(__dirname +"/failure.html")
        else{
            response.on("data", (dat)=>{
                const jsonDat=JSON.parse(dat);
                if(jsonDat.new_members.length>0 || jsonDat.updated_members.length>0)
                    res.sendFile(__dirname +"/success.html")
                else   
                    res.sendFile(__dirname +"/failure.html")
                console.log(jsonDat);
            })
        }
    });
    request.on('error', (e) => {
        console.error(e);
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", (req,res)=>{
    res.redirect("/");
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//API key
//4af8f95506ee0ee1ee4607c56f8bb6c6-us13
//List ID
//6f6ba8f8fd