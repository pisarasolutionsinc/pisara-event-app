// function processCounts(arr: []) {
//   if (arr.length === 0) {
//       return {
//           highest: null,
//           lowest: null,
//           median: null
//       };
//   }

//   // Extract count values
//   let counts = arr.map(item => item.count);

//   // Sort the counts in descending order
//   counts.sort((a, b) => b - a);

//   // Find highest (1st highest) and median (2nd highest)
//   let highest = counts[0];
//   let median = counts.length > 1 ? counts[1] : highest;

//   // Calculate average of the 3rd, 4th, and 5th highest numbers
//   let average;
//   if (counts.length >= 5) {
//       average = (counts[2] + counts[3] + counts[4]) / 3;
//   } else if (counts.length >= 3) {
//       average = counts.slice(2).reduce((sum, count) => sum + count, 0) / (counts.length - 2);
//   } else {
//       average = highest;
//   }

//   // Round the values down to the nearest integer
//   highest = Math.floor(highest);
//   median = Math.floor(median);
//   average = Math.floor(average);

//   return {
//       highest: highest,
//       lowest: average,
//       median: median
//   };
// }

// const Legend = ({ getShade, topLocations }) => {
//   const counts = processCounts(topLocations);
//   return (
//     <div className="legend absolute bottom-10 left-10 bg-[#E1EBEE] p-4 rounded-lg z-10">
//       <h3 className="text-md font-semibold mb-2">Legend</h3>
//       <div className="flex flex-col items-center">
//         <div
//           className="w-64 h-6 rounded-sm mb-2"
//           style={{
//             background: `linear-gradient(to right, 
//               ${getShade(10)}, ${getShade(8)}, ${getShade(7)}, ${getShade(6)},
//               ${getShade(5)}, ${getShade(4)}, ${getShade(2)}, ${getShade(1)})`,
//           }}
//         ></div>
//         <div className="flex justify-between w-full text-xs">
//           <span className="text-gray-700">No Mentions</span>
//           <span className="text-gray-700">{counts.lowest}</span>
//           <span className="text-gray-700">{counts.median}</span>
//           <span className="text-gray-700">{counts.highest}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Legend;
