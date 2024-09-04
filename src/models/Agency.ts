export interface Agency {
    address: string;
    bankCardDetails: {
      cvc: string;
      expiry: string;
      number: string;
    };
    email: string;
    employees: [],
    isActive: boolean;
    name: string;
    paypalEmail: string;
    phoneNumber: string;
    profilePictureUrl: string;
    website: string;
  }