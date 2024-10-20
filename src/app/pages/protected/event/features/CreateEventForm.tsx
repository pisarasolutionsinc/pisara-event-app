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
import { useItem } from "../../../../hooks/useItem";
import { useToast } from "../../../../../context/ToastProvider";

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
  const { createItem } = useItem();
  const { showToast } = useToast();
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

  const handleSave = async () => {
    // Validate eventFormData
    const { fields, projectId } = eventFormData;

    // Check if projectId is set and if there are values in common and custom fields
    const isCommonFieldsComplete = fields.common.some((field) => {
      const value = field.value;
      return typeof value === "string" && value.trim() !== "";
    });

    const isCustomFieldsComplete = fields.custom.some((field) => {
      const value = field.value;
      return typeof value === "string" && value.trim() !== "";
    });

    if (!projectId || (!isCommonFieldsComplete && !isCustomFieldsComplete)) {
      showToast(
        "Please complete the form before saving.",
        "error",
        "bottom-10 right-10"
      );
      return;
    }

    try {
      const ForData = {
        ...eventFormData,
        fields: {
          ...eventFormData.fields,
          custom: [
            ...eventFormData.fields.custom,
            ...projectCustomFields
              .filter((field: any) =>
                ["Templates", "Attendees", "Fields", "Groups"].includes(
                  field.name
                )
              )
              .map((field: any) => ({
                fieldId: field._id,
                value: "",
              })),
          ],
        },
        assignees: selectedAssignees,
      };
      const response = await createItem(ForData);
      if (response) {
        console.log(response);
        showToast(
          "Event created successfully",
          "success",
          "bottom-10 right-10"
        );
      }
    } catch (error) {
      console.log(error);
    }
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
            formData={eventFormData}
            handleCustomField={(values) => {
              setSelectedCustomField(values);
              setEventFormData((prev) => {
                const existingFieldIds = new Set(
                  prev.fields.custom?.map((field) => field.fieldId)
                );

                // If the number of new values is greater than existing fields, add new custom fields
                if (values.length > existingFieldIds.size) {
                  const newCustomFields = values
                    .filter((value) => !existingFieldIds.has(value._id))
                    .map((value) => ({
                      fieldId: value._id,
                      value: "",
                    }));

                  return {
                    ...prev,
                    fields: {
                      ...prev.fields,
                      custom: [...prev.fields.custom, ...newCustomFields],
                    },
                  };
                }
                // If the number of new values is less than existing fields, remove fields not in values
                else if (values.length < existingFieldIds.size) {
                  return {
                    ...prev,
                    fields: {
                      ...prev.fields,
                      custom: prev.fields.custom.filter((field) =>
                        values.some((value) => value._id === field.fieldId)
                      ),
                    },
                  };
                }

                return prev;
              });
            }}
            customField={selectedCustomField}
            handleFieldChange={(fieldId, fieldValue) => {
              setEventFormData((prev) => {
                const updatedCustomFields = prev.fields.custom.map((field) =>
                  field.fieldId === fieldId
                    ? { ...field, value: fieldValue }
                    : field
                );

                return {
                  ...prev,
                  fields: {
                    ...prev.fields,
                    custom: updatedCustomFields,
                  },
                };
              });
            }}
          />
        </div>
        <div className="col-span-2 px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-500">Event Templates</h1>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-gray-400 text-xs">No templates available</p>
          </div>
        </div>
      </div>

      <SaveFAB onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
};
