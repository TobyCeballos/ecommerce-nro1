const { promises: fs } = require('fs')
const moment = require("moment");
class Contenedor {
    constructor(archivo) {
        this.archivo = archivo;
    }

    async updateById(productId, object) {
        try {
            const data = await this.getProds();
            const productIndex = data.findIndex(e => e.id === parseInt(productId));
            
            if (productIndex >= 0) {
                const updatedObject = await {
                    ...object,
                    timestamp: moment().format("L LTS"),
                    id: productId
                };
                data[productIndex] = updatedObject;
                await fs.writeFile(this.archivo, JSON.stringify(data, null, 2));
                return updatedObject;
            } else {
                return false;
            }
        }
        catch (err) {
            console.log('ERROR ->', err);
        }
    }


    async saveProds(obj) {
        try {
            const objs = await this.getProds();
            let newId = 1;
            if (objs.length > 0) {
                newId = objs[objs.length - 1].id + 1;
            }
            const newObj = { ...obj, timestamp: moment().format("L LTS"), id: newId }
            objs.push(newObj)

            fs.writeFile(this.archivo, JSON.stringify(objs, null, 2))

        } catch (error) {
            console.log('ERROR => ', error);
        }
    };

    async deleteById(idProducto) {
        try {
            const productos = await this.getProds()
            const nuevoArr = await productos.filter(e => e.id != idProducto)
            fs.writeFile(this.archivo, JSON.stringify(nuevoArr, null, 2))
            return (`Se borro correctamente el producto con el id: ${idProducto}`);
        } catch (error) {
            return error
        }

    }

    async getProdById(idProducto) {
        try {
            const productos = await this.getProds()
            const idGet = await productos.filter(x => x.id == idProducto)
            return idGet
        } catch (error) {
            return error
        }
    }

    async getProds() {
        try {
            const objs = await fs.readFile(this.archivo, 'utf-8');
            return JSON.parse(objs);
        } catch (error) {
            return error;
        }
    }
};


const prod = new Contenedor("./db/prodDB.txt")
module.exports = prod;
