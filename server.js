const express = require('express');
const Web3 = require('web3');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const ejs = require('ejs');

dotenv.config();

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

require('./helpers/css.js')

const contractABI = require('./contracts/simpleStorage.json').abi;
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

async function getEthPrice() {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    return response.data.ethereum.usd;
}

app.get('/', async (req, res) => {
    try {
        const price = await getEthPrice();
        res.render('index', { ethPrice: price });
    } catch (error) {
        res.status(500).send('Error fetching ETH price');
    }
});

app.get('/connect', async (req, res) => {
    res.send('Please connect to your wallet using MetaMask.');
});

app.get('/balance', async (req, res) => {
    const { address } = req.query;
    if (!web3.utils.isAddress(address)) {
        return res.status(400).send('Invalid address');
    }
    try {
        const balanceWei = await web3.eth.getBalance(address);
        const balance = web3.utils.fromWei(balanceWei, 'ether');
        res.json({ balance });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching balance' });
    }
});

app.get('/contract-read', async (req, res) => {
    try {
        const storedData = await contract.methods.get().call();
        res.json({ storedData });
    } catch (error) {
        res.status(500).json({ error: 'Error interacting with contract' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
