import { useParams } from "react-router-dom";
import { ItemService } from "../services/itemService";
import { useState } from "react";

export const useItem = () => {
  const { itemId } = useParams();
  const itemService = new ItemService();
  const [items, setItems] = useState<any[]>([]);

  const fetchItem = async (query: any = {}) => {
    try {
      const result = await searchItem(
        query,
        ["number", "fields", "board"],
        ["fields.common.fieldId", "fields.custom.fieldId"],
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

  const getItem = async (id: string) => {
    try {
      const Item = await itemService.get(id);
      return Item;
    } catch (error) {
      console.log(error);
    }
  };

  const getItems = async () => {
    try {
      const Items = await itemService.getAll();
      return Items;
    } catch (error) {
      console.log(error);
    }
  };

  const createItem = async (data: any) => {
    try {
      const Item = await itemService.create(data);
      return Item;
    } catch (error) {
      console.log(error);
    }
  };

  const updateItem = async (id: string, data: any) => {
    try {
      const Item = await itemService.update(id, data);
      return Item;
    } catch (error) {
      console.log(error);
    }
  };

  const searchItem = async (
    query: any = {},
    select: string[] = [],
    populate: string[] = [],
    limit: number = 10,
    page: number = 1,
    sort: string = "-createdAt",
    lean: boolean = false
  ) => {
    try {
      const Items = await itemService.search(
        query,
        select,
        populate,
        limit,
        page,
        sort,
        lean
      );
      return Items;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    itemId,
    getItem,
    getItems,
    searchItem,
    createItem,
    updateItem,
    //other
    items,
    fetchItem,
  };
};
