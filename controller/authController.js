const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const token = "";

class AuthController {
  constructor(userDataFile, secretKey) {
    this.userDataFile = userDataFile;
    this.secretKey = secretKey;
  }

  loadUserData() {
    try {
      const data = fs.readFileSync(this.userDataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveUserData(data) {
    fs.writeFileSync(this.userDataFile, JSON.stringify(data, null, 2), 'utf8');
  }


  //success
  async signUp(req, res) {
    const { Username, Email, Password } = req.body;
    console.log('Request body:', req.body);  // Debug: Log the request body
  
    if (!Username || !Email || !Password) {
        console.log('Request body:', req.body);
        return res.status(400).json({ message: 'All fields are required: ', req });
    }
  
    try {
        const users = this.loadUserData();
    
        const existingUser = users.find(user => user.Email === Email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
    
        const hashedPassword = await bcrypt.hash(Password, 8);
        const newUser = { id: uuidv4(), Username, Email, Password: hashedPassword };
        users.push(newUser);
        this.saveUserData(users);
    
        res.json({ message: 'SignUp successful' });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  //success
  async signIn(req, res) {
    const { Email, Password } = req.body;
    const users = this.loadUserData();
  
    const user = users.find(user => user.Email === Email);
    if (!user || !(await bcrypt.compare(Password, user.Password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
  
    const token = jwt.sign({ id: user.id, Email: user.Email, Username: user.Username, Password: Password }, this.secretKey);
    res.json({ message: 'Signin successful', token });
  }
  
  

  // success
  async getCurrentUser(req, res) {
    try {
        const { user } = req;
        const { id, Email, Username, Password } = user; // Extract necessary information

        // Assuming Username is part of req.user, ensure it's correctly populated
        if (!Username) {
            return res.status(400).json({ message: 'Username not found' });
        }

        // Fetch user data based on id (assuming loadUserData() retrieves all users)
        const users = this.loadUserData();
        const currentUser = users.find(user => user.id === id);

        if (!currentUser) {
            return res.status(400).json({ message: 'Invalid ID or password' });
        }

        // Return only necessary data
        res.json({ user: { id, Email, Username, Password }, message: 'Success' });
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

  

  updateProfile(req, res) {
    const { Username, Email } = req.body;
    const users = this.loadUserData();

    const userIndex = users.findIndex(user => user.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex] = { ...users[userIndex], Username, Email };
    this.saveUserData(users);

    res.json({ message: 'Profile updated successfully' });
  }

  async changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    const users = this.loadUserData();

    const userIndex = users.findIndex(user => user.id === req.user.id);
    if (userIndex === -1 || !(await bcrypt.compare(oldPassword, users[userIndex].password))) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      users[userIndex].password = hashedPassword;
      this.saveUserData(users);

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async forgetPass(req, res) {
    const { email, newPassword } = req.body;
    const users = this.loadUserData();

    const userIndex = users.findIndex(user => user.email === email);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      users[userIndex].password = hashedPassword;
      this.saveUserData(users);

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AuthController;
