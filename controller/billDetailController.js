const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const token = "";

class BillDetailController{
    constructor(billDetailDataFile, secretKey) {
        this.billDetailDataFile = billDetailDataFile;
        this.secretKey = secretKey;
    }

    loadBillDetailData() {
        try {
            const data = fs.readFileSync(this.billDetailDataFile, 'utf8');
            return JSON.parse(data);
          } catch (error) {
            return [];
          }
    }

    saveBillDetailData(data) {
        fs.writeFileSync(this.billDetailDataFile, JSON.stringify(data, null, 2), 'utf8');
    }

    async addBillDetail(req, res) {
        const { BillID, CartID, CartPrice } = req.body;
        console.log('Request body:', req.body);  // Debug: Log the request body

        if (!BillID || !CartID || !CartPrice) {
            console.log('Request body:', req.body);
            return res.status(400).json({ message: 'All fields are required: ' });
        }

        try {
            const billDetails = this.loadBillDetailData();
        
            const newBillDetail = { BillID, CartID, CartPrice };
            billDetails.push(newBillDetail);
            this.saveBillDetailData(billDetails);
        
            res.json({ message: 'Create successful' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getBillDetailByBillID(req, res) {
        const { BillID } = req.body;

        if (!BillID) {
            return res.status(400).json({ message: 'Bill ID is required' });
        }

        try {
            const billDetail = this.loadBillDetailData();
            const filteredBillDetail = billDetail.filter(billDetail => billDetail.BillID === BillID);

            res.json({ billDetail: filteredBillDetail, message: 'Success' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}
module.exports = BillDetailController;