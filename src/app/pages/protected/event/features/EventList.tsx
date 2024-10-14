import { useEffect, useState } from "react";
import { useItem } from "../../../../hooks/useItem";
import { EventCard } from "../../../../components/cards/EventCards";
import { BsCalendarEvent } from "react-icons/bs";
import { AddEventCard } from "./AddEventCard";
import { useNavigate } from "react-router-dom";
import { formatDateV1 } from "../../../../utils/useDate";

type EventListProps = {
  projectId: string;
  projectKey: string;
};

export const EventList = ({ projectId, projectKey }: EventListProps) => {
  const { searchItem } = useItem();
  const [items, setItems] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItem();
  }, [projectId]);

  const fetchItem = async () => {
    try {
      const query = {
        projectId: projectId,
      };

      const result = await searchItem(
        query,
        ["number", "fields", "board"],
        ["fields.common.fieldId", "fields.custom.fieldId", "attachments"],
        10,
        0,
        "",
        true
      );
      setItems(result);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fieldNamesToSearch = ["Start Datetime", "End Datetime"];
  const findFieldByNames = (fields: any[], fieldNames: string[]) => {
    return fields.find((field: any) => fieldNames.includes(field.fieldId.name));
  };

  return (
    <div>
      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <AddEventCard projectKey={projectKey} />
          {items.map((item, index) => (
            <div key={index}>
              <EventCard
                card={{
                  title:
                    item.fields.common.find(
                      (field: any) => field.fieldId.name === "Title"
                    )?.value || "",
                  item: item,
                }}
                onClick={() => navigate(`/${projectKey}/event/${item._id}`)}
                className="cursor-pointer shadow-md border hover:shadow-2xl h- transition-shadow duration-200  "
              >
                <div className="flex justify-between items-center">
                  <EventCard.Text
                    text={
                      item.fields.common.find(
                        (field: any) => field.fieldId.name === "Status"
                      )?.value || ""
                    }
                    className={`${
                      (item.fields.common.find(
                        (field: any) => field.fieldId.name === "Status"
                      )?.value || "") === "Done"
                        ? "text-green-500"
                        : "text-gray-500"
                    } dark:text-gray-300 px-2 `}
                  />
                  <EventCard.KebabMenu className="  shadow-none">
                    <EventCard.KebabMenu.Item onClick={() => alert("Clone")}>
                      Clone
                    </EventCard.KebabMenu.Item>
                    <EventCard.KebabMenu.Item onClick={() => alert("Delete")}>
                      Delete
                    </EventCard.KebabMenu.Item>
                  </EventCard.KebabMenu>
                </div>
                <EventCard.Image className="bg-blue-300" />
                <EventCard.Title className="text-gray-700 font-semibold px-2 " />

                {item.fields.custom &&
                findFieldByNames(item.fields.custom, fieldNamesToSearch) ? (
                  <div className="space-y-2 my-2 border-t border-gray-100 mx-2 py-2 ">
                    {/* Render Start Date */}
                    {item.fields.custom.map((field: any, index: number) => {
                      if (field.fieldId.name === "Start Datetime") {
                        return (
                          <div key={index}>
                            <EventCard.Date
                              label="Start:"
                              labelClassName="text-green-500 font-semibold"
                              date={`${formatDateV1(field.value)}`}
                              icon={<BsCalendarEvent />}
                              className="text-gray-500 font-semibold px-2 gap-1"
                            />
                          </div>
                        );
                      }
                      return null;
                    })}
                    {item.fields.custom.map((field: any, index: number) => {
                      if (field.fieldId.name === "End Datetime") {
                        return (
                          <div key={index}>
                            <EventCard.Date
                              label="End:"
                              labelClassName="text-red-500 font-semibold"
                              date={`${formatDateV1(field.value)}`}
                              icon={<BsCalendarEvent />}
                              className="text-gray-500 font-semibold px-2 gap-1"
                            />
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ) : (
                  <div className=" mb-5 space-y-1">
                    <EventCard.Date
                      key={index}
                      date={` No start date and time provided`}
                      className="text-gray-500 font-semibold px-2  gap-1 "
                      icon={<BsCalendarEvent />}
                    />
                    <EventCard.Date
                      key={index}
                      date={` No end date and time provided`}
                      className="text-gray-500 font-semibold px-2 gap-1"
                      icon={<BsCalendarEvent />}
                    />
                  </div>
                )}
              </EventCard>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <AddEventCard projectKey={projectKey} className="h-52" />
        </div>
      )}
    </div>
  );
};
