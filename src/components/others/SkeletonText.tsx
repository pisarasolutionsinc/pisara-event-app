export const LoadingSkeleton = () => {
    const skeletonCount = 9;
    const skeletonElements = [];
  
    for (let i = 0; i < skeletonCount; i++) {
      skeletonElements.push(
        <div key={i} className="h-4 bg-gray-300 rounded-md mb-3"></div>
      );
    }
  
    return (
      <div className="animate-pulse p-6 md:p-4 border rounded-md bg-white">
        {skeletonElements}
      </div>
    );
  };