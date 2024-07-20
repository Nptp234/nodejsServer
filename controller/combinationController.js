const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const token = "";

class CombinationController{
    constructor(combinationDataFile, variantDataFile, productDataFile, secretKey){
        this.combinationDataFile = combinationDataFile;
        this.variantDataFile = variantDataFile;
        this.productDataFile = productDataFile;
        this.secretKey = secretKey;
    }

    loadCombinationData() {
        try {
            const data = fs.readFileSync(this.combinationDataFile, 'utf8');
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

    loadProductData() {
        try {
            const data = fs.readFileSync(this.productDataFile, 'utf8');
            return JSON.parse(data);
          } catch (error) {
            return [];
          }
    }

    saveCombinationData(data) {
        fs.writeFileSync(this.combinationDataFile, JSON.stringify(data, null, 2), 'utf8');
    }

    async addCombination(req, res) {
        const { ProductID, VariantID } = req.body;
        console.log('Request body:', req.body);  // Debug: Log the request body

        if (!ProductID || !VariantID) {
            console.log('Request body:', req.body);
            return res.status(400).json({ message: 'All fields are required: ', req });
        }

        try {
            const combinations = this.loadCombinationData();
        
            const existingCombination = combinations.find(combinations => combinations.ProductID === ProductID && combinations.VariantID === VariantID);
            if (existingCombination) {
                return res.status(400).json({ message: 'Combination already exists' });
            }
        
            const newCombination = { id: uuidv4(), ProductID, VariantID };
            combinations.push(newCombination);
            this.saveCombinationData(combinations);
        
            res.json({ message: 'Create successful' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateCombination(req, res) {
        const { Id, ProductID, VariantID } = req.body;

        if (!Id || !ProductID || !VariantID) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const combinations = this.loadCombinationData();
            const combinationIndex = combinations.findIndex(combinations => combinations.id === Id);

            if (combinationIndex === -1) {
                return res.status(404).json({ message: 'Combination not found' });
            }

            const variants = this.loadVariantData();
            const existingVariants = variants.find(variants => variants.id === VariantID);
            if (!existingVariants) {
                return res.status(400).json({ message: 'Variant does not exist' });
            }

            const products = this.loadProductData();
            const existingProducts = products.find(products => products.id === ProductID);
            if (!existingProducts) {
                return res.status(400).json({ message: 'Product does not exist' });
            }

            combinations[combinationIndex] = { id: uuidv4(), VariantID, ProductID };
            this.saveCombinationData(combinations);

            res.json({ combinations: combinations, message: 'Combination updated successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getListAll(req, res) {
        try {
            const value = this.loadCombinationData();
            res.json({ value, message: 'Success' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async removeCombinationByProductID(req, res) {
        const { ProductID } = req.body;

        if (!ProductID) {
            return res.status(400).json({ message: 'ProductID is required' });
        }

        try {
            let combinations = this.loadCombinationData();
            const initialLength = combinations.length;
            combinations = combinations.filter(combination => combination.ProductID !== ProductID);

            if (combinations.length === initialLength) {
                return res.status(404).json({ message: 'No combinations found with the given ProductID' });
            }

            this.saveCombinationData(combinations);

            res.json({ message: 'Combinations removed successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async removeCombinationByVariantID(req, res) {
        const { VariantID } = req.body;

        if (!VariantID) {
            return res.status(400).json({ message: 'VariantID is required' });
        }

        try {
            let combinations = this.loadCombinationData();
            const initialLength = combinations.length;
            combinations = combinations.filter(combination => combination.VariantID !== VariantID);

            if (combinations.length === initialLength) {
                return res.status(404).json({ message: 'No combinations found with the given VariantID' });
            }

            this.saveCombinationData(combinations);

            res.json({ message: 'Combinations removed successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async removeCombinationByCombinationID(req, res) {
        const { Id } = req.body;

        if (!Id) {
            return res.status(400).json({ message: 'CombinationID is required' });
        }

        try {
            let combinations = this.loadCombinationData();
            const combinationIndex = combinations.findIndex(combination => combination.id === Id);

            if (combinationIndex === -1) {
                return res.status(404).json({ message: 'Combination not found' });
            }

            combinations.splice(combinationIndex, 1);
            this.saveCombinationData(combinations);

            res.json({ message: 'Combination removed successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}
module.exports = CombinationController;