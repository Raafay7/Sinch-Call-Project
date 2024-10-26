const bcrypt = require('bcrypt'); // Import bcrypt for hashing
const users = []; // In-memory array to store users

// Function to find a user
const findUser = async (username, password) => {
  const user = users.find((user) => user.username === username);
  if (user) {
    // Compare the entered password with the stored hashed password
    const match = await bcrypt.compare(password, user.password);
    return match ? user : null; // Return user if the password matches
  }
  return null; // User not found
};

// Function to add a user
const addUser = async (username, password) => {
  if (users.find((user) => user.username === username)) {
    return false; // Username already exists
  }

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
  users.push({ username, password: hashedPassword }); // Store hashed password
  return true; // User added successfully
};

module.exports = { findUser, addUser };
