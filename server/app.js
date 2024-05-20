const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

//middleware
app.use(cors())
app.use(express.json())

//connect to mongodb
mongoose.connect("mongodb://Ecom:1234@ac-u9mivls-shard-00-00.mwnpbet.mongodb.net:27017,ac-u9mivls-shard-00-01.mwnpbet.mongodb.net:27017,ac-u9mivls-shard-00-02.mwnpbet.mongodb.net:27017/Ecommerce?ssl=true&replicaSet=atlas-s5dzhq-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0",{
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(()=>console.log("Connection Start"))
.catch((error)=>console.log(error.message))

//to make cart item schemas
const cartItemSchema=new mongoose.Schema({
    id : Number,
    name : String,
    img : String,
    amount : Number,
    Price : Number,
})

const CartItem = mongoose.model('CartItem',cartItemSchema)
module.exports= CartItem

app.get("/",(req,res)=>{
    res.send("Hello")
})

//Route to add an an item to the cart
app.post('/add-to-cart', async (req, res) => {
    const { id, name, img, amount, Price} = req.body;
  
    try {
      const existingItem = await CartItem.findOne({ id });
  
      if (existingItem) {
        res.json({ message: 'Item already added to cart' });
      } else {
        const newItem = new CartItem({ id, name, img, amount, Price });
        await newItem.save();
        res.json({ message: 'Item added to cart' });
      }
    } catch (error) {
      res.json({ message: 'Error adding item to cart', error });
    }
  });


// Route to fetch cart items
app.get('/cart-items', async (req, res) => {
  try {
    const items = await CartItem.find();
    res.json(items);
  } catch (error) {
    res.json({ message: 'Error fetching cart items', error });
  }
});


app.listen(4000,()=>{
    console.log("Server runs at http://localhost:4000")
})