var CarRegistrations = artifacts.require("./CarRegistrationContract.sol");




contract("carRegistrationContract", function() {

    let contract
   
    it("Creates a contract", async function() {
        contract = await CarRegistrations.new();
    })

    it('creates a user', async function() {       
        contract.createUser(15000, {from: "0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208"})
    }); 

    it('creates another user', async function() {       
        contract.createUser(15000, {from: "0x3A942bB94A3727124913E0127709f6826edeF202"})
    }); 
    
    it("User exists", async function() {        
        var user = await contract.Users('0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208');
        assert.equal(user[0], "0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208");       
    });

    it("Creates registration", async function() {
        console.log(web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"))
        contract.createRegistration('regNum1', web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"), 1, 1, 1, 1);
    });

    it("Creates registration2", async function() {
        console.log(web3.utils.fromAscii("ccccccccccccccccc"))
        contract.createRegistration('regNum1', web3.utils.fromAscii("ccccccccccccccccc"), 1, 1, 1, 1);
    });

    it("Creates registration3", async function() {
        console.log(web3.utils.fromAscii("ddddddddddddddddd"))
        contract.createRegistration('regNum1', web3.utils.fromAscii("ddddddddddddddddd"), 1, 1, 1, 1);
    });

    it("Registration exists", async function() {
        var registration = await contract.Registrations(web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"));
        assert.equal(registration[0], web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"));
    })

    it("Assigns Registration", async function() {
        contract.assignRegistration("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208", web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"));
        var registration = await contract.getUserRegistration("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208", 0);
        assert.equal(registration[0], web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"));
    })

    it("Assigns Registration2", async function() {
        contract.assignRegistration("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208", web3.utils.fromAscii("ccccccccccccccccc"));
        var registration = await contract.getUserRegistration("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208", 1);
        assert.equal(registration[0], web3.utils.fromAscii("ccccccccccccccccc"));
    })

    it("Assigns Registration3", async function() {
        contract.assignRegistration("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208", web3.utils.fromAscii("ddddddddddddddddd"));
        var registration = await contract.getUserRegistration("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208", 2);
        assert.equal(registration[0], web3.utils.fromAscii("ddddddddddddddddd"));
    })

    it("Creates sales Posting", async function() {
        contract.createSalesPost(web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"), "bbbbbbbbbbbbbbbbb", 12345);
        var registration = await contract.SalesPostings(web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"));
        assert.equal(registration[0], web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"));
    })

    it("Creates sales Posting2", async function() {
        await contract.createSalesPost(web3.utils.fromAscii("ccccccccccccccccc"), "ccccccccccccccccc", 12345);
        var registration = await contract.SalesPostings(web3.utils.fromAscii("ccccccccccccccccc"));
        assert.equal(registration[0], web3.utils.fromAscii("ccccccccccccccccc"));
    })

    it("Creates sales Posting3", async function() {
        await contract.createSalesPost(web3.utils.fromAscii("ddddddddddddddddd"), "ddddddddddddddddd", 12345);
        var registration = await contract.SalesPostings(web3.utils.fromAscii("ddddddddddddddddd"));
        assert.equal(registration[0], web3.utils.fromAscii("ddddddddddddddddd"));
        var salesp = await contract.getSalesPostingsNoOffers();
        console.log(salesp);
        
    })

    it("Creates an offer", async function() {
        contract.makeOffer(web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"), 10000, {from: "0x3A942bB94A3727124913E0127709f6826edeF202"});
        var offers = await contract.getOffers(web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"));
        var offer = await offers[0];
        assert.equal(offer[0], "0x3A942bB94A3727124913E0127709f6826edeF202");
        assert.equal(offer[1], 10000);
  
    })

    it("accepts an offer", async function() {
        var seller = await contract.Users("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208")
        var buyer = await contract.Users("0x3A942bB94A3727124913E0127709f6826edeF202")
        var sellerReg = await contract.getUserRegistration("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208", 0)
        var buyerReg = await contract.getUserRegistration("0x3A942bB94A3727124913E0127709f6826edeF202", 0)
        var salesPosting = await contract.SalesPostings(web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"));
        var sellerFunds = seller.money.toNumber();
        var buyerFunds = buyer.money.toNumber();
        assert.equal(sellerReg[0], web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"));
        assert.equal(buyerReg[0], '0x0000000000000000000000000000000000');
        assert.equal(sellerFunds, 15000);
        assert.equal(buyerFunds, 15000);
        assert.equal(salesPosting[0], web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"))
        contract.acceptOffer('0x3A942bB94A3727124913E0127709f6826edeF202', web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"), {from: "0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208"});
        seller = await contract.Users("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208")
        buyer = await contract.Users("0x3A942bB94A3727124913E0127709f6826edeF202")
        sellerReg = await contract.getUserRegistration("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208", 0)
        buyerReg = await contract.getUserRegistration("0x3A942bB94A3727124913E0127709f6826edeF202", 0)
        salesPosting = await contract.SalesPostings(web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"));
        sellerFunds = seller.money.toNumber();
        buyerFunds = buyer.money.toNumber();
        assert.equal(sellerReg[0], '0x0000000000000000000000000000000000');
        assert.equal(buyerReg[0], web3.utils.fromAscii("bbbbbbbbbbbbbbbbb"));
        assert.equal(sellerFunds, 25000);
        assert.equal(buyerFunds, 5000);
        assert.equal(salesPosting[0], '0x0000000000000000000000000000000000')
        var salesp = await contract.getSalesPostingsNoOffers();
        console.log(salesp);
    })


});