export default class User {
    constructor(
      public firstName: string,
      public lastName: string,
      public email: string,
      public phone: string,
      public profilePictureUrl:  string,
      public isGoogleUser: boolean = false,
      public agencyRequest: boolean = false,
      public haveAgency: boolean = false,
      public joinAgency: boolean = false,
      public agencyId: string = '',
    ) {}
  }
  