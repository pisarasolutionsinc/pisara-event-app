import { useParams } from "react-router-dom";
import { ItemService } from "../services/itemService";
import { useEffect, useState } from "react";
import { isPathName } from "../utils/usePath";
import { Item } from "../models/itemModels";

export const useItem = () => {
  const { itemId, projectKey } = useParams();
  const itemService = new ItemService();
  const [items, setItems] = useState<Item[]>([]);
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    isPathName([`/${projectKey}/event/${itemId}`], () => {
      fetchItem(itemId!);
    });
  }, [itemId, projectKey]);

  const searchItemsByQuery = async (params: any) => {
    try {
      const result = await searchItems(params);
      setItems(result);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchItem = async (id: string) => {
    try {
      const params = {
        select: ["fields"],
        populate: [{ path: "fields.custom.fieldId" }],
        lean: true,
      };
      const result = await getItem(id, params);

      setItem(result);
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  };

  const fetchItemsByProject = async (projectId: string) => {
    try {
      const result = await getItemByProjectId(projectId);
      setItems(result);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const getCustomFieldValue = (fieldName: string, item?: Item) => {
    const field = item?.fields?.custom?.find(
      (field) => field.fieldId.name === fieldName
    );
    if (field) return field.value;

    return null;
  };

  // MAIN FUNCTION
  const getItem = async (id: string, params?: any) => {
    try {
      const Item = await itemService
        .select(params?.select as string[])
        .populate(params?.populate)
        .sort(params?.sort)
        .lean(params?.lean)
        .get(id);
      return Item;
    } catch (error) {
      console.log(error);
    }
  };

  const getItemByProjectId = async (projectId: string) => {
    try {
      const Item = await itemService.getAllByProject(projectId);
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

  const createItem = async (data: Item) => {
    try {
      const Item = await itemService.create(data);
      return Item;
    } catch (error) {
      console.log(error);
    }
  };

  const updateItem = async (data: Item) => {
    try {
      const item = await itemService.update(data);
      return item;
    } catch (error) {
      console.log(error);
    }
  };

  const searchItems = async (params: any) => {
    try {
      const Items = await itemService.search(params);
      return Items;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    itemId,
    getItem,
    getItemByProjectId,
    getItems,
    searchItems,
    createItem,
    updateItem,
    //other
    items,
    item,
    setItem,
    setItems,
    searchItemsByQuery,
    fetchItem,
    fetchItemsByProject,
    getCustomFieldValue,
  };
};
