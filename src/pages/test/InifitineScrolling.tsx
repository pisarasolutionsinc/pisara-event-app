import React, { useState, useEffect, useCallback, useRef } from "react";
import { Person } from "../../model/personModel";

const InfiniteScroll: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const limit = 2; // Number of items per page
  const maxPages = 5; // Adjust this based on your API's maximum number of pages

  const fetchPersons = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://opo-api-dev-b2e1021665b2.herokuapp.com/api/person/get/all?select=name&select=email&select=customId&select=precinct&select=photo&select=address&select=contact&select=birthday&select=age&select=sex&select=status&select=role&select=type&select=category&page=${page}&limit=${limit}`
      );
      const text = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      try {
        const newPersons: Person[] = JSON.parse(text);
        setPersons((prevPersons) => [...prevPersons, ...newPersons]);
        setHasMore(newPersons.length > 0);
      } catch (jsonError) {
        throw new Error("Error parsing JSON");
      }
    } catch (error) {
      console.error("Error fetching persons:", error);
    } finally {
      setLoading(false);
    }
  };

  const lastPersonElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => {
            const nextPage = (prevPage % maxPages) + 1; // Loop back to page 1 after reaching the last page
            fetchPersons(nextPage);
            return nextPage;
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchPersons(page);
  }, [page]);

  return (
    <div className="bg-gray-100  h-[100px] overflow-y-auto">
      <div className="container mx-auto px-4 py-4 h-[100px]">
        {" "}
        {/* Adjusted container height */}
        <div className="space-y-2 h-full">
          {" "}
          {/* Adjusted inner content height */}
          {persons.map((person, index) => {
            return index === persons.length - 1 ? (
              <div
                ref={lastPersonElementRef}
                key={person._id && person._id + index}
                className="bg-white shadow-md rounded-lg p-2 flex justify-between items-center"
              >
                <span className="text-sm font-semibold">
                  {person.name.firstname}
                </span>
                <span className="text-xs text-gray-600">{person.email}</span>
              </div>
            ) : (
              <div
                key={person._id && person._id + index}
                className="bg-white shadow-md rounded-lg p-2 flex justify-between items-center"
              >
                <span className="text-sm font-semibold">
                  {person.name.firstname}
                </span>
                <span className="text-xs text-gray-600">{person.email}</span>
              </div>
            );
          })}
        </div>
        {loading && (
          <div className="text-center mt-2">
            {" "}
            {/* Adjusted margin-top */}
            <p className="text-gray-500">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfiniteScroll;
