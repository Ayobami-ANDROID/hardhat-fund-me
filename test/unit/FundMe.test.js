const {deployments,ethers, getNamedAccounts, network} = require("hardhat")
const{assert, expect } = require("chai")
const {developmentChain} = require("../../helper-hardhat-config")

let deployer
let fundMe
let mockV3Aggregator
const sendValue = ethers.utils.parseEther("1")
!developmentChain.includes(network.name) ? describe.skip :describe("FundMe",async function (){
    beforeEach(async function (){

       deployer = (await getNamedAccounts()).deployer
    //   const accounts = await ethers.Signer()
    //   const accountZero = accounts[0]
       await deployments.fixture(["all"])
       fundMe = await ethers.getContract("FundMe",deployer)
       mockV3Aggregator = await ethers.getContract("MockV3Aggregator",deployer)
    })

    describe("constructor",async function(){
       it("set the aggregator address correctly",async function(){
        const reponse = await fundMe.getPriceFeed()
        assert.equal(reponse,mockV3Aggregator.address)
       }) 
    })

    describe("fund",async function(){
        it("it fails if you don't send enough ethers",async function(){
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
        it("updated the amount funded data structure",async function(){
            await fundMe.fund({value:sendValue})
            const reponse =await fundMe.getAddressToAmountFunded(deployer)
            assert.equal(reponse.toString(),sendValue.toString())
        })
        it("Adds funder to arrays of funders",async function(){
            await fundMe.fund({value:sendValue})
            const funders = await fundMe.getFunder(0)
            assert.equal(funders,deployer)
        })
    })

    describe("withdraw",async function (){
        beforeEach(async function (){
            await fundMe.fund({value:sendValue})
        })

        it("withdraw ETH from a single founder",async function(){
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
            const transactionReponse = await fundMe.withdraw()
            const transactionReceipt = await transactionReponse.wait(1)
            const {gasUsed,effectiveGasPrice} = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundBalance = await fundMe.provider.getBalance(fundMe.address) 
            const endingDeployerBalance =  await fundMe.provider.getBalance(deployer)
            assert.equal(endingFundBalance,0)
            assert.equal(startingDeployerBalance.add(startingFundMeBalance).toString(), endingDeployerBalance.add(gasCost).toString() )
        })

        it("allows us to withdraw with multiple funders",async function(){
            const accounts = await ethers.getSigners()
            for(let i =1; i < 6; i++ ){
                const fundMeConnectedContract = await fundMe.connect(accounts[i])
                await fundMeConnectedContract.fund({value:sendValue})
            }
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
            const transactionReponse = await fundMe.withdraw()
            const transactionReceipt = await transactionReponse.wait(1)
            const endingFundBalance = await fundMe.provider.getBalance(fundMe.address) 
            const endingDeployerBalance =  await fundMe.provider.getBalance(deployer)
            const{gasUsed,effectiveGasPrice} = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)
            assert.equal(endingFundBalance,0)
            assert.equal(startingDeployerBalance.add(startingFundMeBalance).toString(), endingDeployerBalance.add(gasCost).toString() )
            await expect(fundMe.getFunder(0)).to.be.reverted

            for (i=1; i<6; i++){
                assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address),0)
            }
        })

        it("withdraw ETH from a single founder",async function(){
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
            const transactionReponse = await fundMe.cheaperWithdraw()
            const endingFundBalance = await fundMe.provider.getBalance(fundMe.address)
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer)
            const transactionReceipt = await transactionReponse.wait(1)
            const {gasUsed,effectiveGasPrice} = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)
            assert.equal(endingFundBalance,0)
            assert.equal(startingDeployerBalance.add(startingFundMeBalance).toString(),endingDeployerBalance.add(gasCost).toString())
        })

        it("cheaper withdraw...",async function (){
            const accounts = await ethers.getSigners()
            for(i=1; i<6; i++){
                const fundMeConnectedContract = await fundMe.connect(accounts[i])
                await fundMeConnectedContract.fund({value:sendValue})
            }
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
            const transactionReponse = await fundMe.cheaperWithdraw()
            const transactionReceipt = await transactionReponse.wait(1)
            const endingFundBalance = await fundMe.provider.getBalance(fundMe.address)
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer)
            const{gasUsed,effectiveGasPrice} = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)
            assert.equal(endingFundBalance,0)
            assert.equal(startingDeployerBalance.add(startingFundMeBalance).toString(),endingDeployerBalance.add(gasCost).toString())
            await expect(fundMe.getFunder(0)).to.be.reverted
            for (i=1; i<6; i++){
                assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address),0)
            }
        })
    })
})