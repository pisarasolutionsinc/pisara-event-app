export interface User {
  _id?: string;
  id?: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  status: "active" | "inactive" | "suspended";
  type: "admin" | "user" | "viewer";
  metadata: {
    access: {
      default: {
        name: string;
        category: string;
        link?: string;
        type: "page" | "features" | "module" | "link" | "all";
        level?: string;
        status: "open" | "closed" | "restricted" | "pending";
      }[];
      costum?: {
        name: string;
        category: "all access" | "limited access";
        link?: string;
        type: "page" | "features" | "module" | "link" | "all";
        level?: "0" | "1" | "2" | "3" | "4" | "5";
        status: "open" | "closed" | "restricted" | "pending";
      }[];
    };
  };
}
