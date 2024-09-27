import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import Tesseract from "tesseract.js";
import { Address, Name } from "../model/collectionModel";
import { useGenerator } from "../utils/useGenerator";
import { Person } from "../model/personModel";
// import { Gender } from "../config/modelConfig";

export const useConverter = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const { customIDGenerator } = useGenerator();

  const handleFileUpload = (files: File[]) => {
    console.log("Files uploaded:", files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleDeleteFile = (index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleGetData = async (
    file: File,
    eventData?: any,
    processType: string = "view",
    rowLimit: number | null = 100
  ): Promise<Person[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const fileData = event.target?.result;

          if (!fileData) {
            throw new Error("File data is empty.");
          }

          let model: Person[] | null = null;

          if (file.type === "text/csv") {
            const parsedData = Papa.parse(fileData as string, {
              header: true,
              dynamicTyping: true,
            });

            const convertedData =
              processType === "view"
                ? parsedData.data.slice(0, rowLimit ?? 0)
                : parsedData.data;

            // Assuming processJsonToModel returns Person[]
            model = processJsonToModel(convertedData, "person", eventData);
          } else if (
            file.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.name.endsWith(".xlsx")
          ) {
            const workbook = XLSX.read(fileData, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const convertedData =
              processType === "view"
                ? jsonData.slice(0, rowLimit ?? 0)
                : jsonData;

            model = processJsonToModel(convertedData, "person", eventData);
          } else if (file.type.startsWith("image/")) {
            const text = await Tesseract.recognize(fileData as string, "eng", {
              logger: (m) => console.log(m),
            }).then(({ data: { text } }) => text);

            const jsonData = processTextToJson(text);
            const convertedData =
              processType === "view"
                ? jsonData.slice(0, rowLimit ?? 0)
                : jsonData;

            model = processJsonToModel(convertedData, "person", eventData);
          } else {
            alert("Unsupported file format");
          }

          if (processType === "view" && model) {
            setModalData(model);
            setModalOpen(true);
          }

          if (processType === "get" && model) {
            resolve(model); // Make sure you're returning Person[]
          } else {
            resolve([]); // Return an empty array if no model is found
          }
        } catch (error) {
          console.error("Error processing file:", error);
          reject(error);
        }
      };

      // Read the file based on its type
      if (file.type === "text/csv") {
        reader.readAsText(file);
      } else if (file.type.startsWith("image/")) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };

  const processTextToJson = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const headers = lines[0].split(/\s+/);
    const data = lines.slice(1).map((line) => {
      const values = line.split(/\s+/);
      const record: { [key: string]: any } = {};
      headers.forEach((header, index) => {
        record[header] = values[index];
      });
      return record;
    });
    return data;
  };

  const processJsonToModel = (data: any[], model: string, event?: any) => {
    if (model !== "person") {
      throw new Error("Unsupported model type");
    }

    const municipalityFromEvent = event?.location[0]?.city || "";
    const regionFromEvent = event?.location[0]?.region || "";
    const provinceFromEvent = event?.location[0]?.province || "";
    const barangayFromEvent = event?.location[0]?.barangay || "";
    const addressFromEvent = event?.location[0]?.text || "";

    const convertedData: Person[] = data.map((item) => {
      const ignoredKeys = ["DATE DELETED / DEACTIVATED ", "PRECINCT"];

      for (const key of ignoredKeys) {
        delete item[key];
      }

      const nameHeaderKey = item["FULL NAME"]
        ? "FULL NAME"
        : item["NAME"]
        ? "NAME"
        : null;
      const fullAddressHeaderKey = item["RESIDENTIAL ADDRESS"]
        ? "RESIDENTIAL ADDRESS"
        : item["FULL ADDRESS"]
        ? "FULL ADDRESS"
        : "";
      const regionHeaderKey = item["REGION"]
        ? "REGION"
        : item["Region"]
        ? "Region"
        : item["region"]
        ? "region"
        : "";
      const provinceHeaderKey = item["PROVINCE"]
        ? "PROVINCE"
        : item["Province"]
        ? "Province"
        : item["province"]
        ? "province"
        : "";
      const cityHeaderKey = item["CITY"]
        ? "CITY"
        : item["City"]
        ? "City"
        : item["city"]
        ? "city"
        : "";
      const barangayHeaderKey = item["BARANGAY"]
        ? "BARANGAY"
        : item["Barangay"]
        ? "Barangay"
        : item["barangay"]
        ? "barangay"
        : "";

      const birthdayHeaderKey = item["BIRTHDAY"]
        ? "BIRTHDAY"
        : item["Birthday"]
        ? "Birthday"
        : item["birthday"]
        ? "birthday"
        : item["BIRTHDATE"]
        ? "BIRTHDATE"
        : item["birthdate"]
        ? "birthdate"
        : "";

      const customIdHeaderKey = item["CUSTOM ID"]
        ? "CUSTOM ID"
        : customIDGenerator().toUpperCase();

      const nameParts = nameHeaderKey
        ? item[nameHeaderKey]?.trim().split(", ") || []
        : [];
      const name: Name = {
        lastname: nameParts[0].toLowerCase() || "",
        firstname: nameParts[1].toLowerCase() || "",
      };

      const address: Address[] = [
        {
          use: "home",
          type: "physical",
          text: fullAddressHeaderKey
            ? item[fullAddressHeaderKey]?.trim().toLowerCase()
            : addressFromEvent
            ? addressFromEvent.toLowerCase()
            : "",
          line: [item[fullAddressHeaderKey]?.trim() || ""],
          country: "Philippines",
          region: regionHeaderKey
            ? item[regionHeaderKey]
                ?.trim()
                .toLowerCase()
                .replace(/^\w/, (c: string) =>
                  item[regionHeaderKey]?.trim() === "NCR" ? c : c.toUpperCase()
                )
            : (!provinceHeaderKey || !cityHeaderKey || !barangayHeaderKey) &&
              regionFromEvent
            ? regionFromEvent
            : "",
          province: provinceHeaderKey
            ? item[provinceHeaderKey]
                ?.trim()
                .toLowerCase()
                .replace(/^\w/, (c: any) => c.toUpperCase())
            : provinceFromEvent
            ? provinceFromEvent
            : "",
          city: cityHeaderKey
            ? item[cityHeaderKey]
                ?.trim()
                .toLowerCase()
                .replace(/^\w/, (c: any) => c.toUpperCase())
            : municipalityFromEvent
            ? municipalityFromEvent
            : "",
          district: "",
          barangay: barangayHeaderKey
            ? item[barangayHeaderKey]
                ?.trim()
                .toLowerCase()
                .replace(/^\w/, (c: any) => c.toUpperCase())
            : barangayFromEvent
            ? barangayFromEvent
            : "",
          street: "",
          purok: "",
          sitio: "",
          overpass: [],
          long: undefined,
          lat: undefined,
          zipcode: "",
          postalCode: "",
          period: { start: "", end: "" },
        },
      ];

      return {
        customId: item[customIdHeaderKey]
          ? item[customIdHeaderKey]?.trim().replace("-", "").toUpperCase() +
            customIDGenerator().toUpperCase()
          : customIDGenerator().toUpperCase(),
        photo: "",
        name,
        address,
        contact: "",
        email: "",
        birthday: birthdayHeaderKey ? item[birthdayHeaderKey] : "",
        age: parseInt(item["AGE"]?.split(" ")[0], 10) || 0,
        sex:
          item["SEX"]?.toLowerCase() === "male"
            ? "male"
            : item["SEX"]?.toLowerCase() === "female"
            ? "female"
            : "other",
        status:
          item["POSITION TITLE"]?.toLowerCase() === "voter"
            ? "active"
            : "inactive",
        role: "user",
        type: "member",
        category: "voter",
      };
    });

    return convertedData;
  };

  return {
    uploadedFiles,
    setModalOpen,
    modalOpen,
    modalData,
    handleFileUpload,
    handleDeleteFile,
    handleGetData,
  };
};
