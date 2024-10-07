const express = require('express');
const app = express();
app.use(express.json()); // To parse JSON request bodies

const port = 3000;

let acceptedCoins = 0;
const inventory = [5, 5, 5]
const DRINK_PRICE = 2;

app.get('/', (req, res) => {
    res.send('<h1> vending time </h1>');
});

app.put('/', (req, res, next) => {

    
    const {coin} = req.body;

    if(typeof coin === 'undefined' || coin !== 1){
        return res.status(403).send('Please insert a single US quarter')
    }

    acceptedCoins += coin;

    res.set('X-Coins', acceptedCoins)
        .status(204)
        .send();

})

app.get('/inventory', (req, res) => {
    res.status(200)
        .send(inventory)
})

app.delete('/', (req, res) => {
    res.status(204)
        .set('X-Coins', acceptedCoins)
        .send();

    acceptedCoins = 0;
})

// Assuming IDs are 1-3
app.get('/inventory/:id', (req, res, next) => {
    // basic id param validation
    let id = req.params.id;

    // If a non integer string is passed id will return null
    id = parseInt(id);
    
    if(id > 3 || id < 1 || typeof id !== 'number' ){
        return res.status(403).send('Please enter a valid ID[1-3]')
    }

    if(inventory[id + 1]) {
        res.status(200).send(`${inventory[id + 1]}`);
    } else {
        throw error;
    }

})

app.put('/inventory/:id', (req, res, next) => {
    try{
        let {id} = req.params;

        id = parseInt(id);

        if(id > 3 || id < 1 || typeof id !== 'number' ){
            throw new Error('Please enter a valid ID[1-3]')
        }
        //Coins response header is returned in all responses
        res.set('X-Coins', acceptedCoins)
        if(acceptedCoins < DRINK_PRICE){
            return res.status(403)
                .send()
        } else if (inventory[id] === 0){
            return res.status(404)
                .send()
        } if(inventory[id] > 0) {
            acceptedCoins -= DRINK_PRICE;
            inventory[id] -= 1;
            res.set('X-Inventory-Remaining', inventory[id + 1])
                .status(200)
                .send(`quantity: 1`);    
            
            //Transaction complete, coins were returned
            acceptedCoins = 0;
            return;
        } 
    }
    catch (error){
        next(error)
    }
})


app.listen(port, () => {
    console.log(`Server running at ${port}`)
})