const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const token = "";

class CartVariantController{
    constructor(cartVariantDataFile, secretKey) {
        this.cartVariantDataFile = cartVariantDataFile;
        this.secretKey = secretKey;
    }

    loadCartVariantData() {
        try {
            const data = fs.readFileSync(this.cartVariantDataFile, 'utf8');
            return JSON.parse(data);
          } catch (error) {
            return [];
          }
    }

    saveCartVariantData(data) {
        fs.writeFileSync(this.cartVariantDataFile, JSON.stringify(data, null, 2), 'utf8');
    }

    async addCartVariant(req, res) {
        const { CartID, ValueComboID } = req.body;
        console.log('Request body:', req.body);  // Debug: Log the request body

        if (!CartID || !ValueComboID) {
            console.log('Request body:', req.body);
            return res.status(400).json({ message: 'All fields are required: ', req });
        }

        try {
            const cartVariant = this.loadCartVariantData();
        
            const newCartVariant = { id: uuidv4(), CartID, ValueComboID };
            cartVariant.push(newCartVariant);
            this.saveCartVariantData(cartVariant);
        
            res.json({ message: 'Create successful' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getCartVariantByCartID(req, res) {
        const { CartID } = req.body;
        console.log('Request body:', req.body);  // Debug: Log the request body

        if(!CartID){
            console.log('Request body:', req.body);
            return res.status(400).json({ message: 'All fields are required: ', req });
        }

        try {
            const cartVariant = this.loadCartVariantData();
            const filteredCartVariant = cartVariant.filter(cartVariant => cartVariant.CartID === CartID);

            res.json({ cartVariant: filteredCartVariant, message: 'Success' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async removeCartVariant(req, res) {
        const { Id } = req.body;

        if (!Id) {
            return res.status(400).json({ message: 'Cart Variant ID is required' });
        }

        try {
            const cartVariant = this.loadCartVariantData();
            const index = cartVariant.findIndex(cartVariant => cartVariant.id === Id);

            if (index === -1) {
                return res.status(404).json({ message: 'Cart Variant not found' });
            }

            // Remove the cart
            cartVariant.splice(index, 1);
            this.saveCartVariantData(cartVariant);

            res.json({ message: 'Cart Variant removed successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}
module.exports = CartVariantController;