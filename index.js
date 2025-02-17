const express = require('express');
const mongoose = require('mongoose');
const MenuItem = require('./schema');

const app = express();
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://nandhinims76:Nandhu_2004@cluster4.yxntz.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));


app.post('/menu', async (req, res) => {
  try {
    // Check if request body is an array or a single object
    if (Array.isArray(req.body)) {
      // Insert multiple items if array
      const savedItems = await MenuItem.insertMany(req.body);
      res.status(201).json({ message: 'Menu items created successfully', data: savedItems });
    } else {
      // Insert single item if object
      const newMenuItem = new MenuItem(req.body);
      const savedMenuItem = await newMenuItem.save();
      res.status(201).json({ message: 'Menu item created successfully', data: savedMenuItem });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error creating menu item(s)', error: error.message });
  }
});


/** 
 * GET /menu - Fetch all menu items
 */
app.get('/menu', async (req, res) => {mongodb
  try {
    const menuItems = await MenuItem.find({});
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
});

/** 
 * GET /menu/:id - Fetch a single menu item by ID
 */
app.get('/menu/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu item', error: error.message });
  }
});


app.put('/menu/:id', async (req, res) => {
  try {
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return updated item & validate before saving
    );
    if (!updatedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item updated successfully', data: updatedMenuItem });
  } catch (error) {
    res.status(400).json({ message: 'Error updating menu item', error: error.message });
  }
});


app.delete('/menu/:id', async (req, res) => {
  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));