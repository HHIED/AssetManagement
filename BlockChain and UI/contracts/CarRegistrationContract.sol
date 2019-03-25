pragma solidity ^0.5.0;

// Enable the ABI v2 Coder
pragma experimental ABIEncoderV2;

contract carRegistrationContract {

    mapping (address => User) public Users;
    mapping (string => User) private Owners;
    mapping (string => SalesPosting) private SalesPostings;


    function getOffers(string memory key) public view returns(Offer[] memory _offers) {
        uint offerLength = SalesPostings[key].offerKeys.length;
        Offer[] memory o = new Offer[](offerLength);
        for(uint i = 0; i<offerLength; i++) {
            o[i] = SalesPostings[key].offers[i];
        }
        return o;
    }

    function getOwner(string memory userId) public view returns(address _userId) {
        return Owners[userId].userId;
    }

    struct User {
        address userId;
        string[] registrations;
        mapping(string => SalesPosting) salesPostings;
        string[] salesPostingKeys;
        uint money;
    }

    struct SalesPosting {
        string id;
        address userId;
        mapping(uint => Offer) offers;
        uint[] offerKeys;
    }

    struct Offer {
        address buyerId;
        uint offerAmount;
    }


    function getUserRegistrations(address userId) public view returns (string[] memory reg) {
        User memory user = Users[userId];
        string[] memory registrations = new string[](user.registrations.length);
        for(uint i = 0; i<user.registrations.length; i++) {
            registrations[i] = user.registrations[i];
        }
        return registrations;
    }

    function assignRegistration(address userId, string memory registrationId) public {
        Owners[registrationId] = Users[userId]; //check for already exist here
        User storage u = Users[userId];
        u.registrations.push(registrationId);
    }

    function createUser(uint money) public returns (bool success) {
        Users[msg.sender].userId = msg.sender;
        Users[msg.sender].money = money;
        return true;
    }

    function createSalesPost(string memory _registrationId) public returns (bool success) {
        User storage user = Users[msg.sender];
        if(Owners[_registrationId].userId==msg.sender)  { //check if sender is owner
            user.salesPostings[_registrationId].id = _registrationId;
            user.salesPostings[_registrationId].userId = msg.sender;
            user.salesPostingKeys.push(_registrationId);  
            SalesPostings[_registrationId].id = _registrationId;
            SalesPostings[_registrationId].userId = msg.sender;

            return true;
        }
        
        return false;
    }

    function makeOffer(string memory _salesPosting, uint _offerPrice) public returns (bool sucess) {
        SalesPosting storage posting = SalesPostings[_salesPosting];
        posting.offers[posting.offerKeys.length] = Offer(msg.sender, _offerPrice);
        posting.offerKeys.push(posting.offerKeys.length);
        
        return true;
    }

    //only one offer pr. user pr. salesposting right now 
    function acceptOffer(address _buyerId, string memory _salesPostingId) public returns (bool success) { 
        User storage seller = Users[msg.sender];
        User storage buyer = Users[_buyerId];

            //check if sender is owner of registration 
        if(Owners[_salesPostingId].userId == msg.sender) {
                   
            for(uint j = 0; j<seller.salesPostingKeys.length; j++) {
                SalesPosting storage sellerSalesPosting = SalesPostings[seller.salesPostingKeys[j]];                   
                if(keccak256(abi.encodePacked(sellerSalesPosting.id)) == keccak256(abi.encodePacked(_salesPostingId))) { //check is sender has registration up for sale
                    for(uint k = 0; k<sellerSalesPosting.offerKeys.length; k++) {
                        Offer storage offer = sellerSalesPosting.offers[sellerSalesPosting.offerKeys[k]];                          
                        if(offer.buyerId==_buyerId) { //find the correct offer                           
                            uint finalPrice = offer.offerAmount;
                            buyer.money -= finalPrice; //remove money from buyer
                            seller.money += finalPrice; //add money to seller
                            Owners[_salesPostingId] = buyer;
                            buyer.registrations.push(_salesPostingId); //transfer registration to buyer
                            for(uint i = 0; i<seller.registrations.length; i++) {
                                if(keccak256(abi.encodePacked(seller.registrations[i])) == keccak256(abi.encodePacked(_salesPostingId))) {
                                    delete seller.registrations[i]; //delete registration for seller
                                }
                            }
                            delete seller.salesPostings[sellerSalesPosting.id]; //delete salesPosting
                            delete seller.salesPostingKeys[j];
                            //salesPostingsLength--;
                            delete SalesPostings[_salesPostingId];

                            return true;
                            
                        }
                    }
                }                
            }
        }
        return false;
    }




}