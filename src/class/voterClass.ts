// import { Gender, Position } from "../config/common";
// import { Address, Name } from "../model/collectionModel";
// import { Voters } from "../model/votersModel";

// export class Voter implements Voters {
//   id: string;
//   customId: string;
//   name: Name;
//   sex: Gender;
//   birthday: Date;
//   age: number;
//   position: Position;
//   precinct: string;
//   address: Address;
//   pollingPlace: string;
//   contact: string;
//   email: string;
//   qrcodeValue: string;

//   constructor(voter: Omit<Voters, "age">) {
//     this.id = voter.id;
//     this.customId = voter.customId;
//     this.name = voter.name;
//     this.sex = voter.sex;
//     this.birthday = new Date(voter.birthday);
//     this.position = voter.position;
//     this.precinct = voter.precinct;
//     this.address = voter.address;
//     this.pollingPlace = voter.pollingPlace;
//     this.contact = voter.contact;
//     this.email = voter.email;
//     this.qrcodeValue = voter.qrcodeValue;
//     this.age = this.computeAge();
//   }

//   private computeAge(): number {
//     const today = new Date();
//     let age = today.getFullYear() - this.birthday.getFullYear();
//     const monthDifference = today.getMonth() - this.birthday.getMonth();

//     if (
//       monthDifference < 0 ||
//       (monthDifference === 0 && today.getDate() < this.birthday.getDate())
//     ) {
//       age--;
//     }

//     return age;
//   }
// }
