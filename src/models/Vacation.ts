export interface Vacation {
    agencyId: string;
    arrivalCountry: string;
    arrivalLocation: string;
    breakfast: boolean;
    departureLocation: string;
    description: string;
    dinner: boolean;
    documents: string;
    elderly: boolean;
    endDate: string;
    extreme: boolean;
    family: boolean;
    food: boolean;
    hotel: string;
    images: { name: string; url: string }[];
    lunch: boolean;
    maxPerson: number;
    mountains: boolean;
    price: number;
    seaside: boolean;
    sightseeing: boolean;
    stars: number;
    startDate: string;
    transportMode: { airplane: boolean; bus: boolean; transportation: boolean };
    young: boolean;
  }