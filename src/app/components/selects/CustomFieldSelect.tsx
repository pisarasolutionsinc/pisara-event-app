import { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import CustomSelect from "./CustomSelect";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Input from "../inputs/Input";
import { safeMapFields } from "../../utils/useRender";
import { FiX } from "react-icons/fi";
import LocationSelect from "./LocationSelect";

type CustomFieldSelectProps = {
  customField?: any[];
  handleCustomField?: (value: any[]) => void;
  projectCustomField?: any[];
  handleFieldChange?: (fieldId: string, value: any) => void; // New handler for field changes
};

export const CustomFieldSelect = ({
  customField,
  handleCustomField,
  projectCustomField,
  handleFieldChange, // Passed from parent component
}: CustomFieldSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="max-h-[70vh] overflow-y-auto">
        {customField && customField.length > 0 ? (
          <>
            {safeMapFields(customField, (item) => (
              <div key={item._id}>
                {item.type === "singletext" ? (
                  <Input
                    label={item.name}
                    type="text"
                    placeholder={"Enter " + item.name}
                    isRemovable={true}
                    className="mb-2 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    // Update value dynamically
                    onChange={(e) =>
                      handleFieldChange &&
                      handleFieldChange(item._id, e.target.value)
                    }
                  />
                ) : item.type === "date" ? (
                  <Input
                    label={item.name}
                    type="date"
                    placeholder={item.name}
                    isRemovable={true}
                    className="mb-2 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    onChange={(e) =>
                      handleFieldChange &&
                      handleFieldChange(item._id, e.target.value)
                    }
                  />
                ) : item.type === "number" ? (
                  <Input
                    label={item.name}
                    type="number"
                    placeholder={"0"}
                    isRemovable={true}
                    className="mb-2 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    onChange={(e) =>
                      handleFieldChange &&
                      handleFieldChange(item._id, e.target.value)
                    }
                  />
                ) : item.type === "object" && item.name === "Location" ? (
                  <LocationSelect
                    onChange={(locationData) => {
                      if (handleFieldChange) {
                        handleFieldChange(item._id, locationData);
                      }
                    }}
                  />
                ) : (
                  <div className="text-red-500 bg-gray-100 rounded p-2 mb-2 flex items-center justify-between">
                    <p>
                      The field type{" "}
                      <span className="font-bold">{item.name}</span> is not
                      supported
                    </p>
                    <button>
                      <FiX size={20} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <div className="text-red-500 bg-gray-100 rounded p-2">
            <p>No custom field</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-grow bg-gray-200 h-[2px]"></div>
        <button
          className={`${
            isOpen ? "text-green-500" : ""
          } flex items-center py-2 rounded ml-2 text-gray-500 hover:text-green-500`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="mr-2 text-xs">Add Field</p>
          <PiPlusCircle size={20} />
        </button>
      </div>

      {isOpen && (
        <div className="mt-2 justify-end flex">
          <div className="w-fit bg-white rounded p-2 shadow-sm">
            <CustomSelect
              options={projectCustomField || []}
              isMultiSelect={true}
              selected={customField || []}
              onSelect={(value: any[] | any) =>
                handleCustomField && handleCustomField(value)
              }
              placeholder="Select Custom Field"
              iconArrowUp={<IoIosArrowUp />}
              iconArrowDown={<IoIosArrowDown />}
              className="custom-class"
            />
          </div>
        </div>
      )}
    </div>
  );
};
