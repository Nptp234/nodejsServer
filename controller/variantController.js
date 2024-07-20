const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const token = "";

class VariantController{
    constructor(variantDataFile, secretKey){
        this.variantDataFile = variantDataFile;
        this.secretKey = secretKey;
    }

    loadVariantData() {
        try {
            const data = fs.readFileSync(this.variantDataFile, 'utf8');
            return JSON.parse(data);
          } catch (error) {
            return [];
          }
    }

    saveVariantData(data) {
        fs.writeFileSync(this.variantDataFile, JSON.stringify(data, null, 2), 'utf8');
    }

    async addVariant(req, res) {
        const { Name } = req.body;
        console.log('Request body:', req.body);  // Debug: Log the request body

        if (!Name) {
            console.log('Request body:', req.body);
            return res.status(400).json({ message: 'All fields are required: ', req });
        }

        try {
            const variants = this.loadVariantData();
        
            const existingVariant = variants.find(variants => variants.Name === Name);
            if (existingVariant) {
                return res.status(400).json({ message: 'Variant already exists' });
            }
        
            const newVariant = { id: uuidv4(), Name };
            variants.push(newVariant);
            this.saveVariantData(variants);
        
            res.json({ message: 'Create successful' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getListAll(req, res) {
        try {
            const variants = this.loadVariantData();
            res.json({ variants, message: 'Success' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async removeVariantByName(req, res) {
        const { Name } = req.body;

        if (!Name) {
            return res.status(400).json({ message: 'Variant Name is required' });
        }

        try {
            const variants = this.loadVariantData();
            const index = variants.findIndex(variants => variants.Name === Name);

            if (index === -1) {
                return res.status(404).json({ message: 'Variant not found' });
            }

            variants.splice(index, 1);
            this.saveVariantData(variants);

            res.json({ message: 'Variant removed successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}
module.exports = VariantController;