const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const token = "";

class CartController{
    constructor(cartDataFile, secretKey) {
        this.cartDataFile = cartDataFile;
        this.secretKey = secretKey;
    }

    loadCartData() {
        try {
            const data = fs.readFileSync(this.cartDataFile, 'utf8');
            return JSON.parse(data);
          } catch (error) {
            return [];
          }
    }

    saveCartData(data) {
        fs.writeFileSync(this.cartDataFile, JSON.stringify(data, null, 2), 'utf8');
    }

    async addCart(req, res) {
        const { BillID, Amount, MainPrice } = req.body;
        console.log('Request body:', req.body);  // Debug: Log the request body

        if (!BillID || !Amount || !MainPrice) {
            console.log('Request body:', req.body);
            return res.status(400).json({ message: 'All fields are required: ', req });
        }

        try {
            const carts = this.loadCartData();
        
            const newCart = { id: uuidv4(), BillID, Amount, MainPrice };
            carts.push(newCart);
            this.saveCartData(carts);
        
            res.json({ message: 'Create successful' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async removeCartByID(req, res) {
        const { CartID } = req.body;

        if (!CartID) {
            return res.status(400).json({ message: 'Cart ID is required' });
        }

        try {
            const carts = this.loadCartData();
            const index = carts.findIndex(cart => cart.id === CartID);

            if (index === -1) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            // Remove the cart
            carts.splice(index, 1);
            this.saveCartData(carts);

            res.json({ message: 'Cart removed successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getListByBillID(req, res) {
        const { BillID } = req.body;

        if (!BillID) {
            return res.status(400).json({ message: 'Bill ID is required' });
        }

        try {
            const carts = this.loadCartData();
            const filteredCarts = carts.filter(cart => cart.BillID === BillID);

            res.json({ carts: filteredCarts, message: 'Success' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}
module.exports = CartController;