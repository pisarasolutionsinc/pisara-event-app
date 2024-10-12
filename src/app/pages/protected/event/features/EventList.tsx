import { useEffect, useState } from "react";
import { useItem } from "../../../../hooks/useItem";
import { EventCard } from "../../../../components/cards/EventCards";
import { BsCalendarEvent, BsClock } from "react-icons/bs";
import { AddEventCard } from "./AddEventCard";

type EventListProps = {
  projectId: string;
  projectKey: string;
};

export const EventList = ({ projectId, projectKey }: EventListProps) => {
  const { searchItem } = useItem();
  const [items, setItems] = useState<any[]>([]);

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
        1,
        0,
        "",
        true
      );
      setItems(result);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  return (
    <div>
      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <AddEventCard projectKey={projectKey} />
          {items.map((item, index) => (
            <div key={index}>
              <EventCard
                card={{ title: item.fields.common[0].value, item: item }}
                className="cursor-pointer shadow-md border hover:shadow-2xl transition-shadow duration-200"
              >
                <div className="flex justify-between items-center">
                  <EventCard.Text
                    text={item.fields.common[2].value}
                    className={`${
                      item.fields.common[2].value === "Done"
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
                <div>
                  {item.fields.custom.map((field: any, index: number) => (
                    <>
                      {field.fieldId.name === "Start Date" && (
                        <div>
                          <EventCard.Date
                            key={index}
                            date={field.value}
                            icon={<BsCalendarEvent />}
                            className="text-gray-500 font-semibold px-2 gap-1"
                          />
                        </div>
                      )}
                    </>
                  ))}
                  <div className="flex items-center mb-4">
                    {item.fields.custom.map((field: any, index: number) => (
                      <>
                        {field.fieldId.name === "Start Time" && (
                          <div className="">
                            <EventCard.Time
                              key={index}
                              time={field.value}
                              icon={<BsClock />}
                              className="text-gray-500 font-semibold px-2 gap-1"
                            />
                          </div>
                        )}
                      </>
                    ))}
                    -
                    {item.fields.custom.map((field: any, index: number) => (
                      <>
                        {field.fieldId.name === "End Time" && (
                          <div className="">
                            <EventCard.Time
                              key={index}
                              time={field.value}
                              icon={<BsClock />}
                              className="text-gray-500 font-semibold px-2 gap-1"
                            />
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                </div>
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
