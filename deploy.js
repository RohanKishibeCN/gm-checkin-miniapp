/**
 * Deployment script for GM Check-in contracts on Base Mainnet
 */

const { ethers } = require('hardhat');

async function main() {
    console.log('Deploying GM Check-in contracts to Base Mainnet...');
    
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log('Deploying with account:', deployer.address);
    
    // Check balance
    const balance = await deployer.getBalance();
    console.log('Account balance:', ethers.utils.formatEther(balance), 'ETH');
    
    if (balance.lt(ethers.utils.parseEther('0.01'))) {
        throw new Error('Insufficient balance for deployment');
    }
    
    // Deploy GM Token
    console.log('\n1. Deploying GM Token...');
    const GMToken = await ethers.getContractFactory('GMToken');
    const gmToken = await GMToken.deploy();
    await gmToken.deployed();
    console.log('GM Token deployed to:', gmToken.address);
    
    // Deploy GM Check-in Contract
    console.log('\n2. Deploying GM Check-in Contract...');
    const GMCheckin = await ethers.getContractFactory('GMCheckin');
    const gmCheckin = await GMCheckin.deploy();
    await gmCheckin.deployed();
    console.log('GM Check-in Contract deployed to:', gmCheckin.address);
    
    // Set up contracts
    console.log('\n3. Setting up contracts...');
    
    // Set GM token in check-in contract
    await gmCheckin.setGMToken(gmToken.address);
    console.log('GM Token set in check-in contract');
    
    // Add check-in contract as minter
    await gmToken.addMinter(gmCheckin.address);
    console.log('Check-in contract added as minter');
    
    // Transfer some tokens to check-in contract for rewards
    const rewardPool = ethers.utils.parseEther('100000'); // 100k tokens
    await gmToken.transfer(gmCheckin.address, rewardPool);
    console.log('Transferred', ethers.utils.formatEther(rewardPool), 'GM tokens to check-in contract');
    
    // Verify contracts on BaseScan
    console.log('\n4. Contract verification info:');
    console.log('GM Token:', gmToken.address);
    console.log('GM Check-in:', gmCheckin.address);
    console.log('\nTo verify on BaseScan, run:');
    console.log(`npx hardhat verify --network base ${gmToken.address}`);
    console.log(`npx hardhat verify --network base ${gmCheckin.address}`);
    
    // Save deployment info
    const deploymentInfo = {
        network: 'base',
        timestamp: new Date().toISOString(),
        deployer: deployer.address,
        contracts: {
            GMToken: {
                address: gmToken.address,
                txHash: gmToken.deployTransaction.hash
            },
            GMCheckin: {
                address: gmCheckin.address,
                txHash: gmCheckin.deployTransaction.hash
            }
        },
        gasUsed: {
            GMToken: (await gmToken.deployTransaction.wait()).gasUsed.toString(),
            GMCheckin: (await gmCheckin.deployTransaction.wait()).gasUsed.toString()
        }
    };
    
    // Write deployment info to file
    const fs = require('fs');
    fs.writeFileSync(
        'deployment-info.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log('\n✅ Deployment completed successfully!');
    console.log('Deployment info saved to deployment-info.json');
    
    return {
        gmToken: gmToken.address,
        gmCheckin: gmCheckin.address
    };
}

// Handle deployment
main()
    .then((addresses) => {
        console.log('\n🎉 All contracts deployed successfully!');
        console.log('GM Token:', addresses.gmToken);
        console.log('GM Check-in:', addresses.gmCheckin);
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Deployment failed:');
        console.error(error);
        process.exit(1);
    });