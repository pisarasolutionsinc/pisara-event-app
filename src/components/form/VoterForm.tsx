// VoterForm.tsx
import React from "react";
import VoterInput from "../input/VoterInput";
import LocationPicker from "../filter/LocationPicker";

interface VoterFormProps {
  record: {
    voter: {
      name: {
        lastname: string;
        firstname: string;
        middlename: string;
      };
      email: string;
      contact: string;
      address: {
        region: string;
        province: string;
        city: string;
        barangay: string;
      }[];
    };
  };
  handleLocationChange: (location: any) => void; // Adjust the type as necessary
  onInputChange: (field: string, value: string) => void; // Callback for input changes
}

const VoterForm: React.FC<VoterFormProps> = ({
  record,
  handleLocationChange,
  onInputChange,
}) => {
  return (
    <form action="" className="xl:border-r pr-4">
      <div className="grid grid-cols-3 gap-4 border-b py-2">
        <VoterInput
          label="Last name"
          value={record.voter.name.lastname}
          onChange={(e) => onInputChange("lastname", e.target.value)}
        />
        <VoterInput
          label="First name"
          value={record.voter.name.firstname}
          onChange={(e) => onInputChange("firstname", e.target.value)}
        />
        <VoterInput
          label="Middle name"
          value={record.voter.name.middlename}
          onChange={(e) => onInputChange("middlename", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 border-b py-2">
        <VoterInput
          label="Email"
          value={record.voter.email}
          onChange={(e) => onInputChange("email", e.target.value)}
        />
        <VoterInput
          label="Contact"
          value={record.voter.contact}
          onChange={(e) => onInputChange("contact", e.target.value)}
        />
      </div>
      <div className="mt-4">
        <div className="mt-1">
          <label className="block text-xs font-medium text-gray-300">
            Address
          </label>
          <LocationPicker
            onLocationChange={handleLocationChange}
            variant="grid2"
            defaultLocation={{
              region: record.voter.address[0].region,
              province: record.voter.address[0].province,
              city: record.voter.address[0].city,
              barangay: record.voter.address[0].barangay,
            }}
          />
        </div>
      </div>
    </form>
  );
};

export default VoterForm;
