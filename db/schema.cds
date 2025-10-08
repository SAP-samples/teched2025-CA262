using {
    cuid,
    managed,
    sap.common.CodeList
} from '@sap/cds/common';

namespace sap.ca262.incidents;

/**
* Incidents created by Customers.
*/
entity Incidents : cuid, managed {
    customer     : Association to Customers;
    title        : String @title: 'Title';
    urgency      : Association to Urgency default 'M';
    status       : Association to Status default 'N';
    conversation : Composition of many {
                       key ID        : UUID;
                           timestamp : type of managed : createdAt;
                           author    : type of managed : createdBy;
                           message   : String;
                   };
    processors : Composition of many {key processor : Association to Processors;};
}


/**
* Customers entitled to create support Incidents.
*/
entity Customers : managed {
    key ID           : String;
        firstName    : String;
        lastName     : String;
        name         : String = firstName || ' ' || lastName;
        email        : EMailAddress;
        phone        : PhoneNumber;
        incidents    : Association to many Incidents
                           on incidents.customer = $self;
        creditCardNo : String(16) @assert.format: '^[1-9]\d{15}$';
        addresses    : Composition of many Addresses
                           on addresses.customer = $self;
}

entity Addresses : cuid, managed {
    customer      : Association to Customers;
    city          : String;
    postCode      : String;
    streetAddress : String;
}

entity Status : CodeList {
    key code        : String enum {
            new = 'N';
            assigned = 'A';
            in_process = 'I';
            on_hold = 'H';
            resolved = 'R';
            closed = 'C';
        };
        criticality : Integer;
}

entity Urgency : CodeList {
    key code : String enum {
            high = 'H';
            medium = 'M';
            low = 'L';
        };
}

entity Processors : managed {
    key ID        : String;
        firstName : String;
        lastName  : String;
    incidents : Association to many Incidents.processors on incidents.processor = $self;
}

type EMailAddress : String;
type PhoneNumber  : String;
