const networkConfig ={
    5:{
        name:" goerli",
        ethUsdPriceFeed :"0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
    137:{
        name:"polygon",
        ethUsdPriceFeed:"0xF9680D99D6C9589e2a93a78A04A279e509205945"
    }
}

const developmentChain = ["hardhat","localhost"]
const Decimals = 8
const INitial_ANSWER = 200000000
module.exports ={networkConfig,developmentChain, Decimals,INitial_ANSWER}