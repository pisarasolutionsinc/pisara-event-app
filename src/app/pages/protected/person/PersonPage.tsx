import { PersonList } from "./feature/PersonList";

export const PersonPage = () => {
  return (
    <div className="w-full h-full ">
      <div className="grid grid-cols-12 w-full h-[90vh]">
        <div className="col-span-9 border-r border-gray-200">
          <PersonList />
        </div>
        <div className="col-span-3 p-5 bg-gray-100/50 text-gray-300">
          Coming soon..
        </div>
      </div>
    </div>
  );
};
