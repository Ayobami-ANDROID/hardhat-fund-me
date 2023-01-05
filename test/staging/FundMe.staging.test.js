const { ethers,getNamedAccounts, network } = require("hardhat")
const {developmentChain} = require("../../helper-hardhat-config")
const {assert} = require("chai")

developmentChain.includes(network.name) ? describe.skip : describe("FundMe", function(){
    
    let fundMe
    let deployer 
    const sendValue = ethers.utils.parseEther("0.1")
    beforeEach(async function (){
         deployer = (await getNamedAccounts()).deployer
         fundMe = await ethers.getContract("FundMe",deployer)
    })
    it("allows people to fund and withdraw",async function (){
        
        const fundTxReponse = await fundMe.fund({value:sendValue})
        await fundTxReponse.wait(1)
        const withdrawTxReponse = await fundMe.withdraw()
        await withdrawTxReponse.wait(1)
        const endingBalance = await fundMe.provider.getBalance(fundMe.address)
        assert.equal(endingBalance.toString(),"0")
    })
})