const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const token = "";

class CategoryController{
    
    constructor(categoryDataFile, secretKey){
        this.categoryDataFile = categoryDataFile;
        this.secretKey = secretKey;
    }

    loadCategoryData() {
        try {
            const data = fs.readFileSync(this.categoryDataFile, 'utf8');
            return JSON.parse(data);
          } catch (error) {
            return [];
          }
    }

    saveCatergoryData(data) {
        fs.writeFileSync(this.categoryDataFile, JSON.stringify(data, null, 2), 'utf8');
    }

    async addCategory(req, res) {
        const { Name, Img } = req.body;
        console.log('Request body:', req.body);  // Debug: Log the request body

        if (!Name || !Img) {
            console.log('Request body:', req.body);
            return res.status(400).json({ message: 'All fields are required: ', req });
        }

        try {
            const categorys = this.loadCategoryData();
        
            const existingCategory = categorys.find(categorys => categorys.Name === Name);
            if (existingCategory) {
                return res.status(400).json({ message: 'Category already exists' });
            }
        
            const newCategory = { id: uuidv4(), Name, Img };
            categorys.push(newCategory);
            this.saveCatergoryData(categorys);
        
            res.json({ message: 'Create successful' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getListAll(req, res) {
        try {
            const categories = this.loadCategoryData();
            res.json({ categories, message: 'Success' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async removeCategoryById(req, res) {
        const { CategoryID } = req.body;

        if (!CategoryID) {
            return res.status(400).json({ message: 'Category ID is required' });
        }

        try {
            const categories = this.loadCategoryData();
            const index = categories.findIndex(category => category.id === CategoryID);

            if (index === -1) {
                return res.status(404).json({ message: 'Category not found' });
            }

            categories.splice(index, 1);
            this.saveCatergoryData(categories);

            res.json({ message: 'Category removed successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}
module.exports = CategoryController;