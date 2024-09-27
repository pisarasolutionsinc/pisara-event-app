import { AppConfig } from "../model/appConfigModels";

export const ui: AppConfig = {
  class: {
    use: "custom_1",
    table: {
      main: {
        custom_1: "",
      },
      header: {
        custom_1: "text-gray-400 text-xs font-semibold tracking-wider",
      },
      trh: {
        custom_1: "border-t",
      },
      th: {
        custom_1: "p-2 ",
      },
      body: {
        custom_1: "text-gray-900",
      },
      trb: {
        custom_1: " text-gray-600",
      },
      td: {
        custom_1: "text-xs px-2 ",
      },
      item_hover: {
        custom_1: "bg-gray-200",
      },
    },

    text: {
      label: {
        custom_1: "block text-sm font-medium text-gray-700",
      },
      placeholder: {
        custom_1:
          "block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm",
      },
      p: {
        custom_1: "text-gray-900",
      },
    },
  },
};
