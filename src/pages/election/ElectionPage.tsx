import { useState } from "react";

const ElectionDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const sampleVotes = [
    {
      id: "1",
      name: "Election 1",
      startDate: "2022-01-01",
      endDate: "2022-01-02",
      category: "category 1",
      status: "completed",
      votes: [
        {
          id: "1",
          personId: "1",
          date: "2022-01-01",
          status: "pending",
        },
        {
          id: "2",
          personId: "2",
          date: "2022-01-01",
          status: "pending",
        },
      ],
    },
  ];

  const filteredElections = sampleVotes.filter((election) => {
    const isCategoryMatch =
      selectedCategory === "all" || election.category === selectedCategory;
    const isFromDateMatch =
      !fromDate || new Date(election.startDate) >= new Date(fromDate);
    const isToDateMatch =
      !toDate || new Date(election.endDate) <= new Date(toDate);
    return isCategoryMatch && isFromDateMatch && isToDateMatch;
  });

  const totalVoters = filteredElections.length;
  const notYetVoted = filteredElections.reduce(
    (acc, election) =>
      acc + election.votes.filter((vote) => vote.status === "pending").length,
    0
  );
  const doneVoted = filteredElections.reduce(
    (acc, election) =>
      acc + election.votes.filter((vote) => vote.status === "cast").length,
    0
  );

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold mb-4">TOTAL VOTERS</h3>
          <p className="text-2xl">{totalVoters}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold mb-4">NOT YET VOTED</h3>
          <p className="text-2xl">{notYetVoted}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold mb-4">DONE VOTED</h3>
          <p className="text-2xl">{doneVoted}</p>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <div className="">
          <label className="block mb-2">Election Category</label>
          <select
            className="border rounded p-2 w-full"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as string)}
          >
            <option value="all">All</option>
            <option value="presidential">Presidential</option>
            <option value="local">Local</option>
          </select>
        </div>
        <div className="">
          <label className="block mb-2">From Date</label>
          <input
            type="date"
            className="border rounded p-2 w-full"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="">
          <label className="block mb-2">To Date</label>
          <input
            type="date"
            className="border rounded p-2 w-full"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredElections.map((election) => (
          <div key={election.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">{election.name}</h3>
            <p className="text-sm mb-2">Category: {election.category}</p>
            <p className="text-sm mb-2">
              Start Date: {new Date(election.startDate).toLocaleDateString()}
            </p>
            <p className="text-sm mb-2">
              End Date: {new Date(election.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm mb-2">Status: {election.status}</p>
            <p className="text-sm mb-2">Total Votes: {election.votes.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectionDashboard;
