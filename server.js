const express = require("express")
const server = express()

//config server para arquivos estaticos

server.use(express.static('public'))

//habilitar body formulario

server.use(express.urlencoded({extended: true}))

//conexao com db
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '12345678',
    host: 'localhost',
    port: 5432,
    database: 'DoacaoDeSangue'
})


//config template engine

const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCashe: true,
})


// lista de doadores:array lembrar do = e da chave

/*const doadores = [
    {
        nome: "Renato Alves",
        sangue: "Ab+"
    },
    {
        nome: "Jose Silva",
        sangue: "O+"
    },
    {
        nome: "Daciolo Cabo",
        sangue: "O-"
    },
    {
        nome: "Rubens Bar",
        sangue: "A+"
    },
]*/

//config apresentação de página 
server.get("/", function(req, res) {
    
    db.query('Select * from "Doadores"', function(err, result){
        if(err) return res.send("Erro no banco de dados.")

        const doadores = result.rows
        return res.render("Index.html",{ doadores })
    })    
    

})
 
server.post("/", function(req, res) {
    //pegar dados formulario
    const nome = req.body.nome
    const email = req.body.email
    const tipoSanguineo = req.body.tipoSanguineo 

   /*  colocar dentro do array
   doadores.push({

        nome: nome,
        sangue: tipoSanguineo,
    })*/

    if( nome == "" || email == "" || tipoSanguineo ==""){
        return res.send("Todos os campos são obrigatórios.")        
    }
    const query = `insert into "Doadores" ("nome", "email", "sangue") values ($1, $2, $3)`

    const values = [nome, email, tipoSanguineo]

    db.query(query,values, function(err){

        if(err) return res.send("Erro no banco de dados.")

        return res.redirect("/")
    })
  
})
  
server.listen(3001, function() {
    console.log("Server init.")
} )

