//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library priceConverter{
     function getPrice( AggregatorV3Interface priceFeed) internal view returns(uint256){
       
        (,int price,,,) = priceFeed.latestRoundData();
        return uint256(price*1e18);
    }

    //  function getVersion() internal view returns(uint256){
    //     AggregatorV3Interface priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
    //     return priceFeed.version();
    // }

    function getConversionRate (uint256 ethAmount, AggregatorV3Interface priceFeed) internal view returns(uint256){
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUsd =(ethAmount * ethPrice)/1e18;
        return ethAmountInUsd;

    }

    
}