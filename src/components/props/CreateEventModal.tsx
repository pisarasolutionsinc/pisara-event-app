import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { CgAdd } from "react-icons/cg";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [eventName, setEventName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [assignedLeaders, setAssignedLeaders] = useState("");

  const handleSubmit = () => {
    // Handle event creation logic here
    console.log("Event Created:", {
      eventName,
      address,
      date,
      startTime,
      endTime,
      assignedLeaders,
    });
    // Reset fields after submission
    setEventName("");
    setAddress("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setAssignedLeaders("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>
      <div className="fixed inset-0 flex items-center justify-center p-4 ">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-500"
            onClick={onClose}
          >
            <CgAdd className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold mb-4">Create Event</h2>
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="time"
            placeholder="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="time"
            placeholder="End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="text"
            placeholder="Assigned Leaders"
            value={assignedLeaders}
            onChange={(e) => setAssignedLeaders(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Create Event
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateEventModal;
