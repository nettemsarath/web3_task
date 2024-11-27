const Web3 = require('web3');

const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

async function getCurrentBlock() {
    try {
        const blockNumber = await web3.eth.getBlockNumber();
        console.log('Current block number:', blockNumber);
    } catch (error) {
        console.error('Error fetching block number:', error);
    }
}

async function getBalance(address) {
    try {
        const balanceWei = await web3.eth.getBalance(address);
        const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
        console.log(`Balance of ${address}: ${balanceEther} ETH`);
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}

(async () => {
    await getCurrentBlock();

    const address = '0xYourEthereumAddressHere';
    await getBalance(address);
})();
