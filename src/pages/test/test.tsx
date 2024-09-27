import React, { useState } from "react";

const TestApiComponent: React.FC = () => {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const url = "https://opo-api-dev-b2e1021665b2.herokuapp.com/api/person/find"; // Replace with your API endpoint

  const testApiRequest = async () => {
    const payload = {
      query: {
        _id: "6b5915dffd4e82b391bfd30", // Example ID
      },
      select:
        "_id name email customId precinct photo address contact birthday age sex status role type category",
    };

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}. Error: ${errorText}`
        );
      }
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div>
      <h1>Test API Request</h1>
      <button onClick={testApiRequest}>Send Test Request</button>
      {response && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div>
          <h2>Error:</h2>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
};

export default TestApiComponent;
