const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const token = "";

class CombinationValueController{
    constructor( combinationValueDataFile, combinationDataFile, variantDataFile, productDataFile, secretKey){
        this.combinationValueDataFile = combinationValueDataFile;
        this.combinationDataFile = combinationDataFile;
        this.variantDataFile = variantDataFile;
        this.productDataFile = productDataFile;
        this.secretKey = secretKey;
    }

    loadCombinationValueData() {
        try {
            const data = fs.readFileSync(this.combinationValueDataFile, 'utf8');
            return JSON.parse(data);
          } catch (error) {
            return [];
          }
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

    saveCombinationValueData(data) {
        fs.writeFileSync(this.combinationValueDataFile, JSON.stringify(data, null, 2), 'utf8');
    }

    async addCombinationValue(req, res) {
        const { CombinationID, VariantID, VariantValueID } = req.body;
        console.log('Request body:', req.body);  // Debug: Log the request body

        if (!CombinationID || !VariantID || !VariantValueID) {
            console.log('Request body:', req.body);
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const combinationValues = this.loadCombinationValueData();
            const combinations = this.loadCombinationData();
            
            // Check if the combination exists
            const existingCombination = combinations.find(combination => combination.id === CombinationID);
            if (!existingCombination) {
                return res.status(404).json({ message: 'Combination not found' });
            }
            
            // Check if the combination value already exists
            const existingCombinationValue = combinationValues.find(value => 
                value.CombinationID === CombinationID && 
                value.VariantID === VariantID && 
                value.VariantValueID === VariantValueID
            );
            if (existingCombinationValue) {
                return res.status(400).json({ message: 'Combination value already exists' });
            }
            
            // Add new combination value
            const newCombinationValue = { 
                id: uuidv4(), 
                CombinationID, 
                VariantID, 
                VariantValueID 
            };
            combinationValues.push(newCombinationValue);
            this.saveCombinationValueData(combinationValues);

            res.json({ message: 'Combination value added successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateCombinationValue(req, res) {
        const { Id, CombinationID, VariantID, VariantValueID } = req.body;

        if (!Id || !CombinationID || !VariantID || !VariantValueID) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const combinationValues = this.loadCombinationValueData();
            const combinationIndex = combinationValues.findIndex(cv => cv.id === Id);

            if (combinationIndex === -1) {
                return res.status(404).json({ message: 'Combination Value not found' });
            }

            // Update the combination value
            combinationValues[combinationIndex] = { 
                id: uuidv4(), 
                CombinationID, 
                VariantID, 
                VariantValueID 
            };
            this.saveCombinationValueData(combinationValues);

            res.json({ combinationValues, message: 'Combination Value updated successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async removeCombinationValueByID(req, res) {
        const { Id } = req.body;

        if (!Id) {
            return res.status(400).json({ message: 'Combination Value ID is required' });
        }

        try {
            const combinationValues = this.loadCombinationValueData();
            const index = combinationValues.findIndex(cv => cv.id === Id);

            if (index === -1) {
                return res.status(404).json({ message: 'Combination Value not found' });
            }

            // Remove the combination value
            combinationValues.splice(index, 1);
            this.saveCombinationValueData(combinationValues);

            res.json({ message: 'Combination Value removed successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getListAll(req, res) {
        try {
            const value = this.loadCombinationValueData();
            res.json({ value, message: 'Success' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}
module.exports = CombinationValueController;