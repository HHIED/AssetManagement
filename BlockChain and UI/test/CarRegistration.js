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


    it("Assigns Registration", async function() {
        contract.assignRegistration("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208", "bbbbbbbbbbbbbbbbb");
        var registration = await contract.getUserRegistrations("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208");
        assert.equal(registration[0], "bbbbbbbbbbbbbbbbb");
    })

    it("Assigns Registration2", async function() {
        contract.assignRegistration("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208", "ccccccccccccccccc");
        var registration = await contract.getUserRegistrations("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208");
        assert.equal(registration[1], "ccccccccccccccccc");
    })

    it("Assigns Registration3", async function() {
        contract.assignRegistration("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208", "ddddddddddddddddd");
        var registration = await contract.getUserRegistrations("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208");
        assert.equal(registration[2], "ddddddddddddddddd");
    })

    it("Creates sales Posting", async function() {
        contract.createSalesPost("bbbbbbbbbbbbbbbbb", {from: "0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208"});
        assert.equal(true, true);
    })

    it("Creates sales Posting2", async function() {
        await contract.createSalesPost(("ccccccccccccccccc"), {from: "0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208"});
        assert.equal(true, true);
    })

    it("Creates sales Posting3", async function() {
        await contract.createSalesPost(("ddddddddddddddddd"), {from: "0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208"});
        assert.equal(true, true);
        
    })

    it("Creates an offer", async function() {
        contract.makeOffer(("bbbbbbbbbbbbbbbbb"), 10000, {from: "0x3A942bB94A3727124913E0127709f6826edeF202"});
        var offers = await contract.getOffers(("bbbbbbbbbbbbbbbbb"));
        var offer = await offers[0];
        assert.equal(offer[0], "0x3A942bB94A3727124913E0127709f6826edeF202");
        assert.equal(offer[1], 10000);
  
    })

    it("accepts an offer", async function() {
        var seller = await contract.Users("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208")
        var buyer = await contract.Users("0x3A942bB94A3727124913E0127709f6826edeF202")
        var sellerReg = await contract.getUserRegistrations("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208")
        var buyerReg = await contract.getUserRegistrations("0x3A942bB94A3727124913E0127709f6826edeF202")
        //var salesPosting = await contract.SalesPostings(("bbbbbbbbbbbbbbbbb"));
        var sellerFunds = seller.money.toNumber();
        var buyerFunds = buyer.money.toNumber();
        assert.equal(sellerReg[0], ("bbbbbbbbbbbbbbbbb"));
        assert.equal(buyerReg[0], undefined);
        assert.equal(sellerFunds, 15000);
        assert.equal(buyerFunds, 15000);
        //assert.equal(salesPosting[0], ("bbbbbbbbbbbbbbbbb"))
        contract.acceptOffer('0x3A942bB94A3727124913E0127709f6826edeF202', ("bbbbbbbbbbbbbbbbb"), {from: "0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208"});
        seller = await contract.Users("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208")
        buyer = await contract.Users("0x3A942bB94A3727124913E0127709f6826edeF202")
        sellerReg = await contract.getUserRegistrations("0x55d4C5dDDD94aC720D397c42B35CCc4B7dd90208")
        buyerReg = await contract.getUserRegistrations("0x3A942bB94A3727124913E0127709f6826edeF202")
        //salesPosting = await contract.SalesPostings(("bbbbbbbbbbbbbbbbb"));
        sellerFunds = seller.money.toNumber();
        buyerFunds = buyer.money.toNumber();
        assert.equal(sellerReg[0], '');
        assert.equal(buyerReg[0], ("bbbbbbbbbbbbbbbbb"));
        assert.equal(sellerFunds, 25000);
        assert.equal(buyerFunds, 5000);
        //assert.equal(salesPosting[0], '0x0000000000000000000000000000000000')
        //var salesp = await contract.getSalesPostingsNoOffers();
        //console.log(salesp);
    })


});