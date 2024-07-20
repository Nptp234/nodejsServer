const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const token = "";

class BillController{
    constructor(billDataFile, secretKey) {
        this.billDataFile = billDataFile;
        this.secretKey = secretKey;
    }

    loadBillData() {
        try {
            const data = fs.readFileSync(this.billDataFile, 'utf8');
            return JSON.parse(data);
          } catch (error) {
            return [];
          }
    }

    saveBillData(data) {
        fs.writeFileSync(this.billDataFile, JSON.stringify(data, null, 2), 'utf8');
    }

    async addBill(req, res) {
        const { Id, UserID, Status, Date, AmountCart, CartImg } = req.body;
        console.log('Request body:', req.body);  // Debug: Log the request body

        if (!Id || !UserID || !Status || !Date || !AmountCart || !CartImg) {
            console.log('Request body:', req.body);
            return res.status(400).json({ message: 'All fields are required: ', req });
        }

        try {
            const bills = this.loadBillData();
        
            const newBill = { id: Id, UserID, Status, Date, AmountCart, CartImg };
            bills.push(newBill);
            this.saveBillData(bills);
        
            res.json({ message: 'Create successful' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getBillByUserID(req, res) {
        const { UserID } = req.body;

        if (!UserID) {
            return res.status(400).json({ message: 'Bill ID is required' });
        }

        try {
            const bills = this.loadBillData();
            const filteredBills = bills.filter(bills => bills.UserID === UserID);

            res.json({ bills: filteredBills, message: 'Success' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getListAll(req, res) {
        try {
            const bills = this.loadBillData();
            res.json({ bills, message: 'Success' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async removeBillByID(req, res) {
        const { Id } = req.body;

        if (!Id) {
            return res.status(400).json({ message: 'Bill ID is required' });
        }

        try {
            const bills = this.loadBillData();
            const index = bills.findIndex(bills => bills.id === Id);

            if (index === -1) {
                return res.status(404).json({ message: 'Bill not found' });
            }

            // Remove the cart
            bills.splice(index, 1);
            this.saveBillData(bills);

            res.json({ message: 'Bill removed successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}
module.exports = BillController;