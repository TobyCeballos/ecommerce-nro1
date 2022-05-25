const express = require('express');
const app = express();
const { Router } = express
const contenedor = require('./classes/containerProds.js');
const container = require('./classes/containerCarts.js');
const prods = new Router();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('./public'))

const errObj = { error: 'Producto no encontrado' };
const err401 = { error: 'No estás autorizado para acceder a ésta URL'}

const admin = true;

prods.get('/', async (req, res) => {
    const objetos = await contenedor.getProds()
    res.send(objetos)
});


prods.post('/', async (req, res) => {
    const a = req.body
    const add = await contenedor.saveProds(a)
    
    if (admin != true) {
        res.send(err401)
    } else {
        res.send(add)
    }
})


prods.get('/:id', async (req, res) => {
    const id = req.params.id
    const objetos = await contenedor.getProdById(id)
    res.send(objetos)
})

prods.delete('/:id', async (req, res) => {
    const idDelete = req.params.id
    const deleteId = await contenedor.deleteById(idDelete)
    res.send(deleteId)
})

prods.put('/:id', async (req, res) => {
    const ids = req.params.id;
    const obj = req.body;
    const updatedObj = await contenedor.updateById(ids, obj);
    res.send(updatedObj)
})

// CARTS

const carts = new Router()

carts.get('/', async (req, res) => {
    const carros = await container.getAllCarts()
    res.send( carros );
});

carts.post('/', async (req, res) => {
    container.create().then(resp => res.send(resp))
})

carts.delete('/:id', async (req, res) => {
    const id = req.params.id
    const deleteCart = await container.deleteCartByID(id)
    if(isNaN(id)) {
        res.send('El valor ingresado no es un numero')
    } else {
        res.send(deleteCart)
    }
})

carts.get('/:id/productos', async (req, res) => {
    const id = req.params.id
    const idProd = await container.getByIdProds(id)
    res.send(idProd)
})

carts.post('/:id/productos/:id_prod', async (req, res) => {
    const id = req.params.id
    const id_prod = req.params.id_prod
    contenedor.getProdById(id_prod)
        .then(resp => {
            container.saveById(resp, id).then(respuesta => res.send(respuesta))
        })
})

carts.delete('/:id/productos/:id_prod', async (req, res) => {
    const id = req.params.id
    const id_prod = req.params.id_prod
    const updCartId = await container.updateById(id, id_prod)
    res.send(updCartId)
})


app.use('/api/carritos', carts)
app.use('/api/productos', prods);
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`El server está a la escucha en el puerto ${server.address().port}`);
});
server.on('error', error => console.log(`Error al iniciar el servidor: ${error}`));
