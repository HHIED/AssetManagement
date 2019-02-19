pragma solidity ^0.5.0;

contract carRegistrationContract {

    struct Registration {
        int controlNumber;
        string registrationNumber; //licence plate
        uint dateOfFirstRegistration;
        uint dateOfRegistration;
        string make; //mærke - eg. Suzuki
        string model; //model - eg. Alto
        bytes17 VIN; // Vehichle Identification Number - stelnummer
        string typeName; //
        string typeReportNumber;
        string typeApprovalNumber;
        string form; //eg. Personbil
        string use; //eg. privat personkørsel
        int drivableWeight; // in kg
        int techincallyAllowedWeight; //in kg
        int allowedTotalWeight; //in kg
        int egineVolume; //in cm3
        int largestPower; //in kW
        int numberOfShafts;
        int fuel; //eg benzin
        int fuelConsumption; //in km/l
        int amountOfSeats;

    }

    mapping (address => User) public Users;
    mapping (bytes17 => Registration) public registrations;

    struct User {
        address userId;
        mapping (uint => Registration) registrations;
    }


}