export const capitalizeWords = (words: String) => {
    if(!words){
        return;
    }
    return words
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const trimString = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return str.substring(0, maxLength);
  }
  return str;
}

export const formatDate = (dateTimeString: string) => {
  if(!dateTimeString){
    return;
  }
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  };
  return new Date(dateTimeString).toLocaleString('en-US', options);
};

export const abbreviateNumber = (value: number) => {
    if(!value){
      return;
    }
    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(value % 1_000_000_000 >= 100_000_000 ? 1 : 0) + 'B';
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(value % 1_000_000 >= 100_000 ? 1 : 0) + 'M';
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(value % 1_000 >= 100 ? 1 : 0) + 'k';
    }
    return value.toString();
}

export const removeUrls = (text: String) => {
  if(!text){
    return;
  }
  const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/g;
  return text.replace(urlPattern, '');
}

import { darken, lighten } from "polished";
export const getShade = (index: number) => {
  const gradientColors = [
    "text-blue",
    "text-red",
    "text-yellow"
  ];

  const getColor = (rank: number) => {
    switch (rank) {
      case 1:
        return darken(0.3, gradientColors[1]);
      case 2:
        return darken(0.1, gradientColors[1]); 
      case 3:
        return gradientColors[0]; 
      case 4:
        return gradientColors[1]; 
      case 5:
        return gradientColors[2]; 
      case 6:
        return lighten(0.1, gradientColors[2]); 
      case 7:
        return lighten(0.3, gradientColors[2]); 
      case 8:
        return lighten(0.5, gradientColors[2]); 
      case 9:
        return lighten(0.7, gradientColors[2]); 
      case 10:
        return lighten(0.9, gradientColors[2]); 
      default:
        return "transparent";
    }
  };

  if (index > 10) {
    return "text-yellow";
  }

  return getColor(index);
};
