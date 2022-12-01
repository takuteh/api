const express = require("express");
const app =express();
const mysql=require("mysql");
app.use(express.json());
app.listen(3000,console.log("サーバーが開始されました"));

app.get("/",(req,res)=>{
res.send("test")
});

const stocks=[];
const sales=[];
const connection=mysql.createConnection({
	host:"192.168.3.245",
	user:"takumi",
	database:"mydb",
	password:"takumi0317",
});

connection.connect((err)=> {
	if(err){
		console.log("error connecting:"+err.stack);
		return;
	}
	console.log("success");
});


app.get("/v1/stocks",(req,res)=>{
		connection.query("SELECT * FROM stocks",(error,results)=>{
			if(error){
				console.log(error);
			res.status(500).send("error");
			return;
			}
		res.json(results);
		});
	});


app.get("/v1/stocks/:name",(req,res)=>{
	const reqe=req.params.name
	query_string="SELECT * FROM stocks where name='"+reqe+"'"
	connection.query(query_string,(error,results)=>{
		if(error){
			console.log(error);
		res.status(500).send("error");
		return;
		}
		//const stock=stocks.find((c)=>c.name === req.params.name);
	res.send(results);
	});
	
	

});

//post method
app.post("/v1/stocks",(req,res)=>{
	const stock={
		name:req.body.name,
		amount:req.body.amount,
	};
//	stocks.push(stock);
	res.send(stock);
connection.query("INSERT INTO stocks SET ?",stock,(error,results)=>{
	if(error){
		console.log(error);
		res.status(500).send("error");
		return;
	}
	//res.send("ok");
});


});

profit=0;
app.post("/v1/sales",(req,res)=>{
	const sale={
		name:req.body.name,
		amount:req.body.amount,
		price:req.body.price,
	}
	res.send(sale);

       connection.query("INSERT INTO sales SET ?",sale,(error,results)=>{
	if(error){
		console.log(error);
		res.status(500).send("error");
		return;
	}
	profit=req.body.amount*req.body.price;
	connection.query("UPDATE sum SET gokei=gokei+?",profit);

});
});

app.get("/v1/sales",(req,res)=>{
		connection.query("SELECT * FROM sum",(error,results)=>{
			if(error){
				console.log(error);
			res.status(500).send("error");
			return;
			}
		res.json(results);
		});
	
});

app.delete("/v1/stocks",(req,res)=>{
connection.query("DELETE FROM stocks");
	console.log("ok");
});
