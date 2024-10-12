import { useEffect, useState } from "react";
import { CoverPhotoCard } from "../../../../components/cards/CoverPhotoCard";
import Input from "../../../../components/inputs/Input";

import { useProject } from "../../../../hooks/useProject";
import { ProjectStatusType } from "../../../../type/ProjectStatusOptionType";
import ProjectStatusSelect from "../../../../components/selects/ProjectStatusSelect";
import { AssigneeSelect } from "../../../../components/selects/AssigneeSelect";
import { CustomFieldSelect } from "../../../../components/selects/CustomFieldSelect";
import { safeMapFields } from "../../../../utils/useRender";
import { SaveFAB } from "../../../../components/buttons/SaveFAB";

interface FormData {
  projectId: string;
  coverPhoto: string;
  fields: {
    common: any[];
    custom: any[];
  };
  assignees: any[];
}

export const CreateEventForm = () => {
  const [selected, setSelected] = useState<
    ProjectStatusType[] | ProjectStatusType | null
  >(null);

  const {
    currentProject,
    getCurrentProjectCommonFields,
    getCurrentProjectCustomFields,
    getCurrentProjectStatuses,
  } = useProject();

  const commonFields =
    getCurrentProjectCommonFields(currentProject, {
      exclusions: [],
    }) || []; // Ensure commonFields is always an array
  const projectCustomFields =
    getCurrentProjectCustomFields(currentProject, {
      itemType: "Event",
      exclusions: [],
    }) || []; // Ensure projectCustomFields is always an array

  const statuses = getCurrentProjectStatuses(currentProject) || [];

  const [selectedCustomField, setSelectedCustomField] = useState<any[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<any[]>([]);
  const [eventFormData, setEventFormData] = useState<FormData>({
    projectId: "",
    coverPhoto: "",
    fields: {
      common: [],
      custom: [],
    },
    assignees: [],
  });

  console.log(selectedAssignees);

  useEffect(() => {
    if (commonFields.length > 0 && eventFormData.projectId === "") {
      handleDefault();
    }
  }, [commonFields]);

  const handleDefault = () => {
    setEventFormData((prev) => ({
      ...prev,
      projectId: currentProject?._id ? currentProject._id : "",
      fields: {
        ...prev.fields,
        common: commonFields
          .filter((field: any) =>
            ["Title", "Description", "Status", "Assignees"].includes(field.name)
          )
          .map((field: any) => ({
            fieldId: field._id,
            value: "",
          })),
      },
    }));
  };

  const handleSave = () => {
    console.log("Saved!", eventFormData);
  };

  const handleCancel = () => {
    console.log("Cancelled!");
  };

  const handleSelect = (
    selectedOption: ProjectStatusType[] | ProjectStatusType | null
  ) => {
    setSelected(selectedOption);
    setEventFormData((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        common: prev.fields.common.map((field) =>
          commonFields.find((f: any) => f._id === field.fieldId)?.name ===
          "Status"
            ? {
                ...field,
                value: (selectedOption as ProjectStatusType)?.title || "",
              }
            : field
        ),
      },
    }));
  };

  const handleSelectAssignees = (selectedOption: any[]) => {
    setSelectedAssignees(selectedOption);
    setEventFormData((prev) => ({
      ...prev,
      assignees: selectedOption.map((user) => user._id),
    }));
  };

  const handleInputChange = (
    fieldId: string,
    value: string,
    type: "common" | "custom"
  ) => {
    setEventFormData((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [type]: prev.fields[type].map((field) =>
          field.fieldId === fieldId ? { ...field, value } : field
        ),
      },
    }));
  };

  return (
    <div className="h-[90vh]">
      <div className="grid grid-cols-1 md:grid-cols-12 h-full">
        <div className="col-span-4 border-r border-gray-300 px-4 py-4">
          <CoverPhotoCard
            title="Cover Photo"
            description="Drag and drop a cover photo here or click to upload."
            className="bg-white"
          />
          <div className="mt-4 space-y-2">
            {safeMapFields(commonFields, (field, index) => (
              <div key={`${field._id}-${index}`}>
                {field.name === "Title" && (
                  <Input
                    type="text"
                    value={
                      eventFormData.fields.common.find(
                        (f) => f.fieldId === field._id
                      )?.value || ""
                    }
                    onChange={(e) =>
                      handleInputChange(field._id, e.target.value, "common")
                    }
                    placeholder="Title"
                    className="bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  />
                )}
              </div>
            ))}

            {safeMapFields(commonFields, (field, index) => (
              <div key={`${field._id}-${index}`}>
                {field.name === "Description" && (
                  <Input
                    type="textarea"
                    value={
                      eventFormData.fields.common.find(
                        (f) => f.fieldId === field._id
                      )?.value || ""
                    }
                    onChange={(e) =>
                      handleInputChange(field._id, e.target.value, "common")
                    }
                    placeholder="Description"
                    className="bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  />
                )}
              </div>
            ))}

            {safeMapFields(commonFields, (field, index) => (
              <div key={`${field._id}-${index}`}>
                {field.name === "Status" && (
                  <ProjectStatusSelect
                    options={statuses}
                    isMultiSelect={false}
                    placeholder="Select Status"
                    selected={selected}
                    onSelect={handleSelect}
                    className="bg-white"
                  />
                )}
              </div>
            ))}
            {safeMapFields(commonFields, (field, index) => (
              <div key={`${field._id}-${index}`}>
                {field.name === "Assignees" && (
                  <AssigneeSelect
                    selectedUsers={selectedAssignees}
                    handleSelectedUsers={handleSelectAssignees}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-6 border-r border-gray-300 px-4 py-4">
          <CustomFieldSelect
            projectCustomField={projectCustomFields}
            handleCustomField={(value) => {
              setSelectedCustomField(value);
              setEventFormData((prev) => ({
                ...prev,
                fields: {
                  ...prev.fields,
                  custom: value.map((field) => ({
                    fieldId: field._id,
                    value: "", // Initialize with empty string
                  })),
                },
              }));
            }}
            customField={selectedCustomField}
            handleFieldChange={(fieldId, fieldValue) => {
              setEventFormData((prev) => ({
                ...prev,
                fields: {
                  ...prev.fields,
                  custom: prev.fields.custom.map((field) =>
                    field.fieldId === fieldId
                      ? { ...field, value: fieldValue }
                      : field
                  ),
                },
              }));
            }}
          />
        </div>
        <div className="col-span-2 px-4 py-4">
          <div>
            <h1>Coming Soon</h1>
          </div>
        </div>
      </div>

      <SaveFAB onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
};
