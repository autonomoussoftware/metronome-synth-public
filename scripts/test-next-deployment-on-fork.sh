#!/bin/bash

network=$1;

if [[ "$network" == "" ]];
then
    echo "Use: $0 <network>"
    exit
fi

if [[ "$network" != "mainnet" && "$network" != "optimism" ]];
then
    echo "'$network' is invalid"
    exit
fi

echo "Make sure the test/E2E.$network.next.test.ts test suite isn't skipped."
echo -n "Press <ENTER> to continue: "
read

# Test current release
#npx hardhat test --network localhost test/E2E.$network.test.ts

# Prepare deployment data
cp -r deployments/$network deployments/localhost

# Deployment (1/2)
npx hardhat deploy --network localhost #> DEPLOYMENT_TEST_OUTPUT.log

# Deployment (2/2): enables cc flash repay
npx hardhat deploy --network localhost #> DEPLOYMENT_TEST_OUTPUT.log

# Test next release
npx hardhat test --network localhost test/E2E.$network.next.test.ts


