const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const token = "";

class VariantValueComtroller{
    constructor(variantValueDataFile, variantDataFile, secretKey){
        this.variantValueDataFile = variantValueDataFile;
        this.variantDataFile = variantDataFile;
        this.secretKey = secretKey;
    }

    loadVariantValueData() {
        try {
            const data = fs.readFileSync(this.variantValueDataFile, 'utf8');
            return JSON.parse(data);
          } catch (error) {
            return [];
          }
    }

    loadVariantData() {
        try {
            const data = fs.readFileSync(this.variantDataFile, 'utf8');
            return JSON.parse(data);
          } catch (error) {
            return [];
          }
    }

    saveVariantValueData(data) {
        fs.writeFileSync(this.variantValueDataFile, JSON.stringify(data, null, 2), 'utf8');
    }

    async addVariantValue(req, res) {
        const { VariantName, Value, ExtraPrice } = req.body;
        console.log('Request body:', req.body);  // Debug: Log the request body

        if (!VariantName || !Value || !ExtraPrice) {
            console.log('Request body:', req.body);
            return res.status(400).json({ message: 'All fields are required: ', req });
        }

        try {
            const variantValues = this.loadVariantValueData();
        
            const existingVariantValue = variantValues.find(variantValues => variantValues.VariantName === VariantName && variantValues.Value === Value);
            if (existingVariantValue) {
                return res.status(400).json({ message: 'Variant Value already exists' });
            }
        
            const newVariantValue = { id: uuidv4(), VariantName, Value, ExtraPrice };
            variantValues.push(newVariantValue);
            this.saveVariantValueData(variantValues);
        
            res.json({ message: 'Create successful' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getListAll(req, res) {
        try {
            const value = this.loadVariantValueData();
            res.json({ value, message: 'Success' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getListValueByVariantName(req, res) {
        const { VariantName } = req.body;

        if (!VariantName) {
            return res.status(400).json({ message: 'Variant Name is required' });
        }
        
        try {
            const variantValues = this.loadVariantValueData();
            const filteredVariantValues = variantValues.filter(variantValues => variantValues.VariantName === VariantName);
            
            if (filteredVariantValues.length === 0) {
                return res.status(404).json({ message: 'No value found for this variant' });
            }

            res.json({ variantValues: filteredVariantValues, message: 'Success' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateVariantValue(req, res) {
        const { Id, VariantName, Value, ExtraPrice } = req.body;

        if (!Id || !VariantName || !Value || !ExtraPrice) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const values = this.loadVariantValueData();
            const valueIndex = values.findIndex(values => values.id === Id);

            if (valueIndex === -1) {
                return res.status(404).json({ message: 'Variant Value not found' });
            }

            const variants = this.loadVariantData();
            const existingVariants = variants.find(variants => variants.Name === VariantName);
            if (!existingVariants) {
                return res.status(400).json({ message: 'Variant does not exist' });
            }

            values[valueIndex] = { id: uuidv4(), VariantName, Value, ExtraPrice };
            this.saveVariantValueData(values);

            res.json({ values: values, message: 'Variant Value updated successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async removeVariantValueByID(req, res) {
        const { VariantValueID } = req.body;

        if (!VariantValueID) {
            return res.status(400).json({ message: 'Variant Value ID is required' });
        }

        try {
            const variantValues = this.loadVariantValueData();
            const index = variantValues.findIndex(variantValues => variantValues.id === VariantValueID);

            if (index === -1) {
                return res.status(404).json({ message: 'Variant Value not found' });
            }

            variantValues.splice(index, 1);
            this.saveVariantValueData(variantValues);

            res.json({ message: 'Variant Value removed successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async removeVariantValueByVariantName(req, res) {
        const { Name } = req.body;

        if (!Name) {
            return res.status(400).json({ message: 'Variant Value Name is required' });
        }

        try {
            let variantValues = this.loadVariantValueData();

            // Filter out all variants that contain the specified name
            const filteredVariantValues = variantValues.filter(variantValue => !variantValue.VariantName.includes(Name));

            if (filteredVariantValues.length === variantValues.length) {
                return res.status(404).json({ message: 'No matching variants found' });
            }

            this.saveVariantValueData(filteredVariantValues);

            res.json({ message: 'Variant Values removed successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


}
module.exports = VariantValueComtroller;