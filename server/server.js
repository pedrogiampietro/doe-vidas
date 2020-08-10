const express = require('express')
const server = express()


// configurando o servidor para apresentar arquivos estáticos.
server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))

//configurando a conexão com o db.
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '899681',
    host: 'localhost',
    port: '5432',
    database: 'doe',
})

// configurando a template engine.
const nunjucks = require('nunjucks')
nunjucks.configure('./', {
    noCache: true,
    express: server,
})


// configurando a apresentação da pagina.
server.get('/', (req, res) => {
    
    db.query(`SELECT * FROM donors`, (err, result) => {
        if (err) return res.send('Error no banco de dados.')

        const donors = result.rows
        return res.render('index.html', { donors })

    })

})

server.post('/', (req, res) => {
    // pegando dados do formulário.
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == '' || email == '' || blood == '') {
        return res.send('Todos os campos são obrigatórios.')
    }

    // colocando valores dentro do db.
    const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)
    `;

    const values = [name, email, blood]
    db.query(query, values, (err) => {
        if (err) return res.send('Error no banco de dados.')

        return res.redirect('/')
    })
})

// configurando
server.listen(3333, () => {
    console.log('******* Servidor iniciado.')
})