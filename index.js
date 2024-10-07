const express = require('express');
const app = express();
app.use(express.json()); // To parse JSON request bodies

const VendingMachine = require('./VendingMachine');

const port = 3000;
// Assuming IDs are 1-3
const vending = new VendingMachine([5,5,5], 2, 0);


app.put('/', (req, res) => {
    const {coin} = req.body;
    try{
        vending.insertCoin(coin)
        return res.set('X-Coins', vending.acceptedCoins)
            .status(204)
            .send();
    } catch (error) {
        if(error.id){
            return res.status(error.status).send(error.message)
        }
    }
})

app.get('/inventory', (req, res) => {
    return res.status(200)
        .send(vending.inventory);
})

app.delete('/', (req, res) => {

    // get coin count before returning to user
    const remainingCoins = vending.acceptedCoins
    vending.returnCoins();

    return res.status(204)
        .set('X-Coins', remainingCoins)
        .send();

})

app.get('/inventory/:id', (req, res) => {
    // basic id param validation
    let id = req.params.id;
    // If a non integer string is passed id will return null
    id = parseInt(id);
    try{
       return res.status(200)
            .send(`${ vending.getItemStock(id)}`);
    }
    catch (error) {
        if(error.id){
            return res.status(error.status).send(error.message)
        }
    }
})

app.put('/inventory/:id', (req, res) => {
    
    // basic id param validation
    let id = req.params.id;
    // If a non integer string is passed id will return null
    id = parseInt(id);
    try {
        // We want to return the quantity, and coins returned before resetting the values 
        const callback = () => {
            res.set('X-Inventory-Remaining', vending.getItemStock(id))
                .set('X-Coins', vending.acceptedCoins)
                .status(200)
                .send(`quantity: ${vending.quantityDispensed}`);    
        }
        return vending.purchaseItem(id, callback)
    } catch (error) {
        if(error.id){
            return res.set('X-Coins', vending.acceptedCoins)
                .status(error.status)
                .send(error.message)
        } 
    }
})

app.listen(port, () => {
    console.log(`Server running at ${port}`)
})