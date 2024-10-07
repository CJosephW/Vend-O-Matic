class VendingMachine {
    constructor(inventory, drinkPrice, acceptedCoins){
        this.inventory = inventory;
        this.drinkPrice = drinkPrice;
        this.acceptedCoins = acceptedCoins;
        this.quantityDispensed = 0;
        this.errors = {
            INVALID_COIN: { id: 1001, message: 'Please insert a single US quarter', status: 500 },
            INSUFFICIENT_FUNDS: { id: 1002, message: 'Insufficient funds',  status: 403 },
            OUT_OF_STOCK: { id: 1003, message: 'Out of stock',  status: 404  },
            INVALID_ID: { id: 1004, message: `Please enter a valid ID[1 - ${this.inventory.length}]`, status: 500  },
        };
    }

    getItemStock(id) {
        // if ID is not a number or is not a defined value in the array throw an error
        if(typeof id !== 'number' || typeof this.inventory[id] === 'undefined'){
            throw this.errors.INVALID_ID;
        }
        // adjust id to zero indexed array
        id -= 1;
        
        return this.inventory[id];
    }

    insertCoin(coin){
        
        //if coin is not defined or exactly 1 return an error
        if(typeof coin === 'undefined' || coin !== 1){
            throw this.errors.INVALID_COIN;
        }
         
        this.acceptedCoins += 1;
    }

    purchaseItem(id, callback) {

        // if ID is not a number or is not a defined value in the array throw an error
        if(typeof id !== 'number' || typeof this.inventory[id] === 'undefined'){
            throw this.errors.INVALID_ID;
        }

        // adjust id to zero indexed array
        id -= 1;

        if(this.acceptedCoins < this.drinkPrice){
            // current accepted coins greater than cost of drink, throw insufficent fund error
            throw this.errors.INSUFFICIENT_FUNDS;
        } else if (this.inventory[id] === 0){
            // selected item out of inventory
            throw this.errors.OUT_OF_STOCK;
        } else if(this.inventory[id] > 0) {
            
            // remove cost of drinks from accepted coins, remove purchased item from stock, and increment dispensed counter
            this.acceptedCoins -= this.drinkPrice;
            this.inventory[id] -= 1;
            this.quantityDispensed += 1;

            callback();
            // We want to display a success response with current accepted coins before returning the coins
            // Transaction complete, coins were returned, dispensed count reset
            this.acceptedCoins = 0;
            this.quantityDispensed = 0;
            return;
        } 
    }
    returnCoins(){
        this.acceptedCoins = 0;
    }
    
} module.exports = VendingMachine;
