const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const token = "";

class ProductController{
    constructor(productDataFile, categoryDataFile, secretKey){
        this.productDataFile = productDataFile;
        this.categoryDataFile = categoryDataFile;
        this.secretKey = secretKey;
    }

    loadProductData() {
        try {
            const data = fs.readFileSync(this.productDataFile, 'utf8');
            return JSON.parse(data);
          } catch (error) {
            return [];
          }
    }

    loadCategoryData() {
        try {
            const data = fs.readFileSync(this.categoryDataFile, 'utf8');
            return JSON.parse(data);
          } catch (error) {
            return [];
          }
    }

    saveProductData(data) {
        fs.writeFileSync(this.productDataFile, JSON.stringify(data, null, 2), 'utf8');
    }

    async addProduct(req, res) {
        const { Name, Price, Des, Img, CateID, CateName } = req.body;
        console.log('Request body:', req.body);  // Debug: Log the request body

        if (!Name || !Img || !Price || !CateID || !CateName) {
            console.log('Request body:', req.body);
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const categories = this.loadCategoryData();
            const existingCategory = categories.find(category => category.Name === CateName);
            if (!existingCategory) {
                return res.status(400).json({ message: 'Category does not exist' });
            }

            const products = this.loadProductData();
            const existingProduct = products.find(products => products.Name === Name);
            if (existingProduct) {
                return res.status(400).json({ message: 'Product already exists' });
            }
            const newProduct = { id: uuidv4(), Name, Price, Des, Img, CateID, CateName };
            products.push(newProduct);
            this.saveProductData(products);

            res.json({ message: 'Product created successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getListAll(req, res) {
        try {
            const products = this.loadProductData();
            res.json({ products, message: 'Success' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getListByCategoryName(req, res) {
        const { CategoryName } = req.body;

        if (!CategoryName) {
            return res.status(400).json({ message: 'Category Name is required' });
        }
        
        try {
            const products = this.loadProductData();
            const filteredProducts = products.filter(product => product.CateName === CategoryName);
            
            if (filteredProducts.length === 0) {
                return res.status(404).json({ products: [], message: 'No products found for this category' });
            }

            res.json({ products: filteredProducts, message: 'Success' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ products: [], message: 'Internal server error' });
        }
    }

    async removeProductByID(req, res) {
        const { ProductID } = req.body;

        if (!ProductID) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        try {
            const products = this.loadProductData();
            const index = products.findIndex(product => product.id === ProductID);

            if (index === -1) {
                return res.status(404).json({ message: 'Product not found' });
            }

            products.splice(index, 1);
            this.saveProductData(products);

            res.json({ message: 'Product removed successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateProductByID(req, res) {
        const { Id } = req.body;
        const { Name, Price, Des, Img, CateID, CateName } = req.body;

        if (!Id || !Name || !Img || !Price || !CateID || !CateName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const products = this.loadProductData();
            const productIndex = products.findIndex(product => product.id === Id);

            if (productIndex === -1) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const categories = this.loadCategoryData();
            const existingCategory = categories.find(category => category.Name === CateName);
            if (!existingCategory) {
                return res.status(400).json({ message: 'Category does not exist' });
            }

            products[productIndex] = { id: uuidv4(), Name, Price, Des, Img, CateID, CateName };
            this.saveProductData(products);

            res.json({ products: products, message: 'Product updated successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


}
module.exports = ProductController;