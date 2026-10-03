require("dotenv").config();
const express=require("express");
const cors=require("cors");
const multer=require("multer");
const fs=require("fs");
const path=require("path");
const crypto=require("crypto");

const app=express();
const PORT=process.env.PORT||10000;
const DATA=path.join(__dirname,"data");
const UPLOADS=path.join(__dirname,"uploads");
fs.mkdirSync(DATA,{recursive:true}); fs.mkdirSync(UPLOADS,{recursive:true});
const DB=path.join(DATA,"movies.json");
if(!fs.existsSync(DB)) fs.writeFileSync(DB,"[]");

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use("/uploads",express.static(UPLOADS));

function read(){try{return JSON.parse(fs.readFileSync(DB,"utf8"))}catch{return []}}
function write(x){fs.writeFileSync(DB,JSON.stringify(x,null,2))}
function safe(s){return String(s||"").replace(/[^a-z0-9._-]/gi,"_")}
const storage=multer.diskStorage({
 destination:(req,file,cb)=>cb(null,UPLOADS),
 filename:(req,file,cb)=>cb(null,Date.now()+"-"+crypto.randomBytes(4).toString("hex")+"-"+safe(file.originalname))
});
const upload=multer({storage,limits:{fileSize:5*1024*1024*1024}});

app.get("/api/health",(req,res)=>res.json({ok:true,service:"MFLIX backend"}));
app.get("/api/movies",(req,res)=>res.json(read()));

app.post("/api/movies",upload.fields([{name:"poster",maxCount:1},{name:"video",maxCount:1}]),async(req,res)=>{
 try{
  if(!req.files?.poster?.[0] || !req.files?.video?.[0]) return res.status(400).json({error:"Poster and video are required"});
  const movie={
   id:crypto.randomUUID(),
   title:req.body.title,
   description:req.body.description||"",
   category:req.body.category||"Entertainment",
   year:req.body.year||"",
   posterUrl:"/uploads/"+path.basename(req.files.poster[0].path),
   videoUrl:"/uploads/"+path.basename(req.files.video[0].path),
   playbackUrl:"/uploads/"+path.basename(req.files.video[0].path),
   createdAt:new Date().toISOString()
  };
  const all=read(); all.unshift(movie); write(all); res.status(201).json(movie);
 }catch(e){console.error(e);res.status(500).json({error:"Upload failed"})}
});

app.get("/",(req,res)=>res.sendFile(path.join(__dirname,"index.html")));
app.listen(PORT,()=>console.log(`MFLIX running on port ${PORT}`));