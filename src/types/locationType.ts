type Barangay = string;

type Municipality = {
    Barangays: Barangay[];
};

type Province = {
    Municipalities: { [key: string]: Municipality };
};

type Region = {
    Provinces: { [key: string]: Province };
};

export type LocationMap = {
    [key: string]: Region;
};