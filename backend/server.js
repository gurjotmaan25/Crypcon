
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoute.js'
import cors from 'cors'
import userModel from './models/userModel.js'
import { isAdmin, requiredSignin } from './middlewares/authMid.js'


dotenv.config()

connectDB()

// mongoose.set('debug', true)


// rest object 
const app = express()

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const port = process.env.PORT || 8080

app.use('/api/v1/auth', authRoutes)


//API endpoint to fetch all users
app.get('/api/users', requiredSignin, isAdmin, async (req, res) => {
    try {
      const users = await userModel.find(); // Fetch all users from the database
      res.json(users); // Send the list of users as JSON response
    } catch (error) {
      console.error('Error fetching users', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//API endpoint to delete user
app.delete('/api/users/:userId', async (req,res)=>{
    const {userId} = req.params

    try {
        const dltUser = await userModel.findByIdAndDelete(userId)
        if(!dltUser){
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
// Add a coin to a user's watchlist
// app.post('/api/user/:userId/watchlist/add/:coinId', async (req, res) => {
app.post('/api/user/:userId/watchlist/add', async (req, res) => {
    try {
        const {userId, coinId} = req.params
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.json({ message: 'User not found' });
      }
      const coinData = req.body
  
      // Assuming you have a Coin model for coins
      // const coinId = req.params.coinId;
      
      // Check if the coin is already in the watchlist
      const coinIndex = user.watchlist.findIndex(coin => coin.id === coinData.id);
      if (coinIndex === -1) {
        user.watchlist.push(coinData);
        await user.save();
      }
      // if (!user.watchlist.includes(coinId)) {
      //   user.watchlist.push(coinId);
      //   await user.save();
      // }
  
      res.send({ message: 'Coin added to watchlist' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Remove a coin from a user's watchlist
  app.post('/api/user/:userId/watchlist/remove/:coinId', async (req, res) => {
    try {
        const {userId, coinId} = req.params
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Remove the coin from the watchlist
      user.watchlist = user.watchlist.filter((coin) => coin.id.toString() !== coinId);
      await user.save();
  
      res.send({ message: 'Coin removed from watchlist' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get('/api/user/:userId/watchlist', requiredSignin, async (req, res) => {
    try {
      const {userId} = req.params; // Assuming you store the user ID in the JWT
      const user = await userModel.findById(userId)
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user.watchlist);
  
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  // check coin
  app.get('/api/user/:userId/watchlist/check/:coinId', async (req, res) => {
    const { userId, coinId } = req.params;

    try {
        // Find the user by userId and check if the coin is in their watchlist
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const inWatchlist = user.watchlist.some((coin) => coin.id === coinId);
        res.status(200).json({ inWatchlist });
    } catch (error) {
        console.error('Error checking if in watchlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/', (req, res) =>{
    res.send("<h1>Welcome MAAN SAAB</h1>")
})

app.listen(port, () =>{
    console.log(`Server in running on ${port}`);
})