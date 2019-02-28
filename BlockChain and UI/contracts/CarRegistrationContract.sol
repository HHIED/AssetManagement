pragma solidity ^0.5.0;

// Enable the ABI v2 Coder
pragma experimental ABIEncoderV2;

contract carRegistrationContract {

    constructor() public {
        salesPostingsLength = 0;  
    }

    struct Registration {
        bytes17 id;
        string registrationNumber; //licence plate
        string VIN; // Vehichle Identification Number - stelnummer
        int allowedTotalWeight; //in kg
        int fuel; //eg benzin
        int fuelConsumption; //in km/l
        int amountOfSeats;

    }

    mapping (address => User) public Users;
    mapping (bytes17 => Registration) public Registrations;
    SalesPostingNoOffers[] public SalesPostingIterator;
    mapping (bytes17 => SalesPosting) public SalesPostings;
    uint salesPostingsLength;


    function getOffers(bytes17 key) public view returns(Offer[] memory _offers) {
        uint offerLength = SalesPostings[key].offerLength;
        Offer[] memory o = new Offer[](offerLength);
        for(uint i = 0; i<offerLength; i++) {
            o[i] = SalesPostings[key].offers[i];
        }
        return o;    
    }

    struct User {
        address userId;
        mapping (uint => Registration) registrations;
        uint registrationsLength;
        mapping (uint => SalesPosting) salesPostings;
        uint salesPostingsLength;
        uint money;
    }

    struct SalesPosting {
        bytes17 id;
        string VIN;
        uint sellingPrice;  
        address userId;
        mapping (uint => Offer) offers;
        uint offerLength;    
        uint elementAt;
    }

    struct SalesPostingNoOffers {
        bytes17 id;
        string VIN;
        uint sellingPrice;  
        address userId;
        uint elementAt;   
    }

    struct Offer {
        address buyerId;
        uint offerAmount;
    }

    function getSalesPostingsNoOffers() public view returns(SalesPostingNoOffers[] memory sp) {
        SalesPostingNoOffers[] memory sps = new SalesPostingNoOffers[](salesPostingsLength);
        for(uint i = 0; i<salesPostingsLength; i++) {
            sps[i] = SalesPostingIterator[i];
        }
        return sps;
    }

    function getUserRegistration(address user, uint index) public view returns (Registration memory reg) {
        return Users[user].registrations[index];
    }

    function createRegistration(string memory registrationNumber, bytes17 VIN, int awt, int fuel, int fc, int ass) public {
        Registrations[VIN] = Registration(VIN, registrationNumber, "asda", awt, fuel, fc, ass);
    }

    function assignRegistration(address user, bytes17 _registrationId) public {
        User storage u = Users[user];
        u.registrations[u.registrationsLength] = Registrations[_registrationId];
        u.registrationsLength++;
    }

    function createUser(uint money) public returns (bool success) {
        Users[msg.sender] = User(msg.sender, 0, 0, money);
        return true;
    }

    function createSalesPost(bytes17 _registrationId, string memory _VIN, uint _sellingPrice) public returns (bool success) {
        User storage user = Users[msg.sender];
        for (uint i = 0; i<user.registrationsLength; i++) {
            bytes17 vin = user.registrations[i].id;
            if(vin == _registrationId) {
                user.salesPostings[user.salesPostingsLength] = (SalesPosting(_registrationId, _VIN, _sellingPrice, msg.sender, 0, salesPostingsLength));
                user.salesPostingsLength++;
                SalesPostings[_registrationId] = (SalesPosting(_registrationId, _VIN, _sellingPrice, msg.sender, 0, salesPostingsLength));
                SalesPostingIterator.push(SalesPostingNoOffers(_registrationId, _VIN, _sellingPrice, msg.sender, salesPostingsLength));
                salesPostingsLength++;
                return true;
            }
        }
        return false;
    }

    function makeOffer(bytes17 _salesPosting, uint _offerPrice) public returns (bool sucess) {
        SalesPosting storage posting = SalesPostings[_salesPosting];
        posting.offers[posting.offerLength] = Offer(msg.sender, _offerPrice);
        posting.offerLength++;
        
        return true;
    }

    //only one offer pr. user pr. salesposting right now 
    function acceptOffer(address _buyerId, bytes17 _salesPostingId) public returns (bool success) { 
        User storage seller = Users[msg.sender];
        User storage buyer = Users[_buyerId];
        for (uint i = 0; i<seller.registrationsLength; i++) {
            //check if sender is owner of registration 
            if(seller.registrations[i].id == _salesPostingId) {                
                for(uint j = 0; j<seller.salesPostingsLength; j++) {                   
                    if(seller.salesPostings[j].id == _salesPostingId) { //check is sender has registration up for sale                       
                        for(uint k = 0; k<SalesPostings[seller.salesPostings[j].id].offerLength; k++) {                          
                            if(SalesPostings[seller.salesPostings[j].id].offers[k].buyerId==_buyerId) { //find the correct offer
                                uint finalPrice = SalesPostings[seller.salesPostings[j].id].offers[k].offerAmount;
                                buyer.money -= finalPrice; //remove money from buyer
                                seller.money += finalPrice; //add money to seller
                                Registration storage registration = seller.registrations[i]; 
                                buyer.registrations[buyer.registrationsLength] = registration; //transfer registration to buyer
                                buyer.registrationsLength++;
                                delete seller.registrations[i]; //delete registration for seller
                                delete seller.salesPostings[j]; //delete salesPosting
                                delete SalesPostingIterator[SalesPostings[_salesPostingId].elementAt];
                                //salesPostingsLength--;
                                delete SalesPostings[_salesPostingId];

                                return true;
                            }
                        }
                    }
                }                
            }
        }
        return false;
    }




}