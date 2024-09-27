import { Address } from "../model/collectionModel";

export function formatAddressesToText(addresses: Address[]): string {
  return addresses
    .map(
      (address) =>
        [address.text, address.city, address.province]
          .filter(Boolean) // Remove falsy values
          .join(", ") // Join address parts with a comma
    )
    .join("; "); // Join multiple addresses with a semicolon
}
