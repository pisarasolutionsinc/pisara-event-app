import { useCallback, useState } from "react";
import { Person } from "../model/personModel";
import { PersonService } from "../services/personService";
// import { useSocket } from "./useSocket";

export const usePerson = () => {
  // const { emitEvent } = useSocket();
  const [person, setPerson] = useState<Person[] | Person | undefined>([]);
  const [search, setSearch] = useState<Person[]>([]);
  const personService = new PersonService("person");

  const getPersons = async (page: number, limit: number = 10) => {
    try {
      const response =
        (await personService
          .GETALL()
          .select([
            "_id",
            "name",
            "email",
            "customId",
            "precinct",
            "photo",
            "address",
            "contact",
            "birthday",
            "age",
            "sex",
            "status",
            "role",
            "type",
            "category",
          ])
          .page(page)
          .limit(limit)
          .execute()) || [];

      if (Array.isArray(response)) {
        setPerson(response);
      } else {
        setPerson([]);
        console.error(
          "Unexpected response format: Expected an array but received:",
          response
        );
      }
    } catch (error) {
      console.error("Failed to fetch persons", error);
    }
  };

  const getPerson = async (id: string) => {
    try {
      const response =
        (await personService
          .GET(id)
          .select([
            "_id",
            "name",
            "email",
            "customId",
            "precinct",
            "photo",
            "address",
            "contact",
            "birthday",
            "age",
            "sex",
            "status",
            "role",
            "type",
            "category",
          ])
          .execute()) || null;
      return response;
    } catch (error) {
      console.error(`Failed to fetch person with id ${id}`, error);
      return undefined;
    }
  };

  const searchPerson = useCallback(
    async (field: string, query: any): Promise<Person[]> => {
      try {
        const response = await personService
          .SEARCH()
          .select([
            "_id",
            "name",
            "email",
            "customId",
            "precinct",
            "photo",
            "address",
            "contact",
            "birthday",
            "age",
            "sex",
            "status",
            "role",
            "type",
            "category",
          ])
          .queryBy(field, query) // Ensure you're using the correct variable names
          .execute();

        if (Array.isArray(response)) {
          return response; // Return the response array directly
        } else {
          console.error(
            "Unexpected response format: Expected an array but received:",
            response
          );
          return []; // Return an empty array instead of undefined
        }
      } catch (error) {
        console.error("Search failed", error);
        return []; // Return an empty array on error
      }
    },
    []
  );

  const getPersonByManyQuery = async (
    queries: Array<{ field: string; value: any }> = []
  ) => {
    try {
      const searchService = personService.SEARCH();

      // Loop through the queries to apply each query field and value
      queries.forEach(({ field, value }) => {
        searchService.queryBy(field, value);
      });

      const response = await searchService
        .select([
          "_id",
          "name",
          "email",
          "customId",
          "precinct",
          "photo",
          "address",
          "contact",
          "birthday",
          "age",
          "sex",
          "status",
          "role",
          "type",
          "category",
        ])
        .execute();

      if (Array.isArray(response)) {
        setSearch(response);
      } else {
        setSearch([]);
        console.error(
          "Unexpected response format: Expected an array but received:",
          response
        );
      }
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const getFind = async (
    variable: string,
    value: string
  ): Promise<Person[]> => {
    try {
      const response =
        (await personService
          .SEARCH()
          .select([
            "_id",
            "name",
            "email",
            "customId",
            "precinct",
            "photo",
            "address",
            "contact",
            "birthday",
            "age",
            "sex",
            "status",
            "role",
            "type",
            "category",
          ])
          .queryBy(variable, value)
          .execute()) || [];

      if (Array.isArray(response)) {
        return response;
      } else {
        console.error(
          "Unexpected response format: Expected an array but received:",
          response
        );
        return [];
      }
    } catch (error) {
      console.error("Find operation failed", error);
      return [];
    }
  };

  const createPerson = async (person: any) => {
    try {
      const response = await personService.POST(person).execute();
      // emitEvent("personCreated", response);
      return response;
    } catch (error) {
      console.error("Failed to create person", error);
    }
  };

  const createPersons = async (persons: any[]) => {
    try {
      const response = await personService.POST(persons).execute();
      // emitEvent("personCreated", response);
      return response;
    } catch (error) {
      console.error("Failed to create person", error);
    }
  };

  const updatePerson = async (person: any) => {
    try {
      const response = await personService.PUT(person).execute();
      // emitEvent("personUpdated", response);
      return response;
    } catch (error) {
      console.error("Failed to update person", error);
    }
  };

  const countPerson = useCallback(
    async (field: string, query: any): Promise<number> => {
      try {
        const response = await personService
          .COUNT()
          .queryBy(field, query)
          .execute();

        const countResponse = response as any;

        if (countResponse && typeof countResponse.count === "number") {
          return countResponse.count;
        } else {
          console.error(
            "Unexpected response format: Expected a count but received:",
            response
          );
          return 0;
        }
      } catch (error) {
        console.error("Search failed", error);
        return 0;
      }
    },
    []
  );

  return {
    person,
    getPersons,
    getPerson,
    searchPerson,
    search,
    getFind,
    createPerson,
    createPersons,
    getPersonByManyQuery,
    updatePerson,
    countPerson,
  };
};
