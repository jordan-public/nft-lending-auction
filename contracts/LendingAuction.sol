// SPDX-License-Identifier: BUSL-1.1

pragma solidity >0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract LendingAuction {
  uint256 constant DENOMINATOR = 1000000;

  struct LoanAuction {
    address borrower;
    address topLender;
    address collateralAddress;
    uint256 collateralId;
    IERC20 loanCurrency;
    uint256 loanAmount;
    uint256 loanRepaymentAmount;
    uint256 auctionDepositAmount;
    uint256 minDecrementFactorNumerator;
    uint256 auctionEndTime;
    uint256 loanRepaymentDeadline;
  }

  LoanAuction[] public loanAuctions;

  function startAuction(address collateralAddress, uint256 collateralId, IERC20 loanCurrency,
                        uint256 loanAmount, uint256 maxLoanRepaymentAmount, uint256 auctionDepositAmount,
                        uint256 minDecrementFactorNumerator, uint256 auctionEndTIme,
                        uint256 loanRepaymentDeadline) external returns(uint256 loanAuctionId) {
    // Anyone can start an auction
    // No need: require(IERC721(collateralAddress).ownerOf(collateralId) == msg.sender, "COLLATERAL NOT OWNED");
    require(block.timestamp < auctionEndTIme, "CREATING ENDED AUCTION");
    require(loanRepaymentDeadline > auctionEndTIme, "CANT REPAY BEOFRE AUCTION END");
    require(auctionDepositAmount > 0, "MUST DEPOSIT");
    require(auctionDepositAmount <= loanAmount, "DEPOSIT CANNOT EXCEED LOAN");
    require(loanAmount < maxLoanRepaymentAmount, "REPAYMENT LESS THAN LOAN");
    require(minDecrementFactorNumerator < DENOMINATOR, "FACTOR MUST BE <1");
    require(minDecrementFactorNumerator > 0, "FACTOR MUST BE POSITIVE");

    IERC721(collateralAddress).transferFrom(msg.sender, address(this), collateralId);

    loanAuctionId = loanAuctions.length;
    loanAuctions.push();
    loanAuctions[loanAuctionId].borrower = msg.sender;
    // No need: loanAuctions[loanAuctionId].topLender = 0;
    loanAuctions[loanAuctionId].collateralAddress = collateralAddress;
    loanAuctions[loanAuctionId].collateralId = collateralId;
    loanAuctions[loanAuctionId].loanCurrency = loanCurrency;
    loanAuctions[loanAuctionId].loanAmount = loanAmount;
    loanAuctions[loanAuctionId].loanRepaymentAmount = maxLoanRepaymentAmount;
    loanAuctions[loanAuctionId].auctionDepositAmount = auctionDepositAmount;
    loanAuctions[loanAuctionId].minDecrementFactorNumerator = minDecrementFactorNumerator;
    loanAuctions[loanAuctionId].auctionEndTime = auctionEndTIme;
    loanAuctions[loanAuctionId].loanRepaymentDeadline = loanRepaymentDeadline;
  }

  function cancelAuction(uint256 loanAuctionId) external {
    require(loanAuctions[loanAuctionId].borrower == msg.sender, "NOT YOUR AUCTION");
    require(loanAuctions[loanAuctionId].topLender == address(0), "CANNOT CANCEL ACTIVE AUCTION");
    IERC721(loanAuctions[loanAuctionId].collateralAddress).transferFrom(address(this), msg.sender, loanAuctions[loanAuctionId].collateralId);
    // Lack of collateral indicated canceled auction or completed loan
  }

  function bid(uint256 loanAuctionId, uint256 repayAmount) external {
    require(msg.sender != loanAuctions[loanAuctionId].borrower, "CANNOT BID ON YOUR AUCTION");
    require(loanAuctions[loanAuctionId].loanAmount < repayAmount, "REPAYMENT LESS THAN LOAN");
    require(repayAmount <= loanAuctions[loanAuctionId].loanRepaymentAmount, "MUST BID WITHIN LIMIT");
    require(loanAuctions[loanAuctionId].topLender != address(0) || 
            repayAmount < loanAuctions[loanAuctionId].loanAmount + 
                (loanAuctions[loanAuctionId].loanRepaymentAmount - loanAuctions[loanAuctionId].loanAmount) 
                * loanAuctions[loanAuctionId].minDecrementFactorNumerator / DENOMINATOR, "MUST BID BETTER");

    if (loanAuctions[loanAuctionId].topLender != address(0))
        IERC20(loanAuctions[loanAuctionId].loanCurrency).transferFrom(msg.sender, loanAuctions[loanAuctionId].topLender, loanAuctions[loanAuctionId].auctionDepositAmount);
    else    
        IERC20(loanAuctions[loanAuctionId].loanCurrency).transferFrom(msg.sender, address(this), loanAuctions[loanAuctionId].auctionDepositAmount);

    loanAuctions[loanAuctionId].topLender = msg.sender;
  }

  // @returns true if loan can be withdrawn. Otherwise get the deposit as penalty and cancel the loan.
  function getLoan(uint256 loanAuctionId) external returns (bool success) {
    require(loanAuctions[loanAuctionId].borrower == msg.sender, "NOT YOUR AUCTION");
    require(block.timestamp > loanAuctions[loanAuctionId].auctionEndTime, "AUCTION NOT COMPLETED");
    require(loanAuctions[loanAuctionId].auctionDepositAmount > 0, "LOAN ALREADY TAKEN");
    require(IERC721(loanAuctions[loanAuctionId].collateralAddress).ownerOf(loanAuctions[loanAuctionId].collateralId) == address(this), "MISSING COLLATERAL");
    require(block.timestamp < loanAuctions[loanAuctionId].loanRepaymentDeadline, "PAST REPAYMENT DEADLINE");
    if (IERC20(loanAuctions[loanAuctionId].loanCurrency).allowance(loanAuctions[loanAuctionId].topLender, address(this)) >= 
        loanAuctions[loanAuctionId].loanAmount - loanAuctions[loanAuctionId].auctionDepositAmount) {
      // Success
      IERC20(loanAuctions[loanAuctionId].loanCurrency).transferFrom(loanAuctions[loanAuctionId].topLender, msg.sender, 
             loanAuctions[loanAuctionId].loanAmount - loanAuctions[loanAuctionId].auctionDepositAmount);
      loanAuctions[loanAuctionId].auctionDepositAmount = 0; // Inidicate loan taken
      success = true;
    } else {
      // Take collateral back to borrower
      IERC721(loanAuctions[loanAuctionId].collateralAddress).transferFrom(address(this), loanAuctions[loanAuctionId].borrower, loanAuctions[loanAuctionId].collateralId);
      success = false;
    }
    // In any case, either as part of the loan or penalty for failure to lend:
    IERC20(loanAuctions[loanAuctionId].loanCurrency).transferFrom(address(this), msg.sender, loanAuctions[loanAuctionId].auctionDepositAmount);
  }

  function repayLoan(uint256 loanAuctionId) external {
    // Not needed: require(loanAuctions[loanAuctionId].borrower == msg.sender, "NOT YOUR LOAN");
    require(block.timestamp <= loanAuctions[loanAuctionId].loanRepaymentDeadline, "PAST REPAYMENT DEADLINE");
    IERC20(loanAuctions[loanAuctionId].loanCurrency).transferFrom(msg.sender, loanAuctions[loanAuctionId].topLender, loanAuctions[loanAuctionId].loanRepaymentAmount);
    IERC721(loanAuctions[loanAuctionId].collateralAddress).transferFrom(address(this), loanAuctions[loanAuctionId].borrower, loanAuctions[loanAuctionId].collateralId);
  }

  function liquidateLoan(uint256 loanAuctionId) external {
    require(loanAuctions[loanAuctionId].topLender == msg.sender, "NOT YOUR LIQUIDATION");
    require(block.timestamp > loanAuctions[loanAuctionId].loanRepaymentDeadline, "REPAYMENT DEADLINE NOT REACHED");
    if (loanAuctions[loanAuctionId].auctionDepositAmount > 0) { // Loan not taken
      // Deposit to borrower - fair
      IERC20(loanAuctions[loanAuctionId].loanCurrency).transferFrom(address(this), loanAuctions[loanAuctionId].borrower, loanAuctions[loanAuctionId].auctionDepositAmount);
    }
    // Take collateral - will fail if loan was repaid and collateral returned
    IERC721(loanAuctions[loanAuctionId].collateralAddress).transferFrom(address(this), loanAuctions[loanAuctionId].topLender, loanAuctions[loanAuctionId].collateralId);
  }
}