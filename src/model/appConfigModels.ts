export interface AppConfig {
  class: {
    use: string;
    table: {
      main: {
        [key: string]: string;
      };
      header: {
        [key: string]: string;
      };
      trh: {
        [key: string]: string;
      };
      th: {
        [key: string]: string;
      };
      body: {
        [key: string]: string;
      };
      trb: {
        [key: string]: string;
      };
      td: {
        [key: string]: string;
      };
      item_hover: {
        [key: string]: string;
      };
    };

    text?: {
      label?: {
        [key: string]: string;
      };
      placeholder?: {
        [key: string]: string;
      };
      h1?: {
        [key: string]: string;
      };
      h2?: {
        [key: string]: string;
      };
      h3?: {
        [key: string]: string;
      };
      p?: {
        [key: string]: string;
      };
    };
  };
}
