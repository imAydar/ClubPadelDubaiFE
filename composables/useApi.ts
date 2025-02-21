import { ref } from "vue";

const url = 'https://0e29-94-204-215-144.ngrok-free.app';
const API_BASE_URL = `${url}/api/Events`;

export const useApi = () => {
  const events = ref([]);

  const createEvent = async (eventData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create event: ${response.statusText}`);
      }

      const data = await response.json();
      return data; // Return the created event
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };

  const fetchEvents = async () => {
    try {
      alert("Fetching events from:" + API_BASE_URL);
      console.log("Fetching events from:", API_BASE_URL); // Debugging
      const response = await fetch(API_BASE_URL);
      alert("Response status:" + response.status);
      console.log("Response status:", response.status); // Debugging
      alert(await response.text());
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }
  
      const data = await response.json();
      alert("Fetched data:" + data);
      console.log("Fetched data:", ); // Debugging
      
      if (!Array.isArray(data)) {
        alert("Invalid API response (expected an array)");
        throw new Error("Invalid API response (expected an array)");
      }
  
      events.value = data;
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("err1 " + error.message + JSON.stringify(error));
      events.value = [];
    }
  };

  const getEventById = async (eventId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${eventId}`);
      if (!response.ok) throw new Error(`Failed to fetch event: ${response.statusText}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching event:", error);
      return null;
    }
  };

  const registerForEvent = async (eventId, participantName) => {
    try {
      const participant = {
        UserName: participantName, // Match the backend's `Participant` class
        Name: participantName,     // Add additional fields if needed
        Confirmed: false,          // Default value
      };
  
      const response = await fetch(`${API_BASE_URL}/${eventId}/participants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(participant), // Send the full `Participant` object
      });
  
      if (!response.ok) {
        throw new Error(`Failed to register: ${response.statusText}`);
      }
  
      // Check if the response has content
      const contentLength = response.headers.get("Content-Length");
      if (contentLength && parseInt(contentLength) > 0) {
        const data = await response.json(); // Parse JSON only if there's content
        return data;
      } else {
        return null; // No content to parse
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      throw error; // Re-throw the error for handling in the component
    }
  };

  const confirmParticipation = async (eventId, participantId, confirmed) => {
      try {
        const participant = {
          Id: participantId, // Match the backend's `Participant` class
          Confirmed: confirmed,          // Default value
          UserName: participantId, // Match the backend's `Participant` class
          Name: participantId,     // Add additional fields if needed
        };
    
        const response = await fetch(`${API_BASE_URL}/${eventId}/participants/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(participant), // Send the full `Participant` object
        });
    
        if (!response.ok) {
          throw new Error(`Failed to register: ${response.statusText}`);
        }
    
        // Check if the response has content
        const contentLength = response.headers.get("Content-Length");
        if (contentLength && parseInt(contentLength) > 0) {
          const data = await response.json(); // Parse JSON only if there's content
          return data;
        } else {
          return null; // No content to parse
        }
      } catch (error) {
        console.error("Error registering for event:", error);
        throw error; // Re-throw the error for handling in the component
      }
    };

    const removeParticipant = async (eventId, participantId) => {
      try {
        const participant = {
          Id: participantId, // Match the backend's `Participant` class
          Confirmed: false,          // Default value
          UserName: participantId, // Match the backend's `Participant` class
          Name: participantId,     // Add additional fields if needed
        };
    
        const response = await fetch(`${API_BASE_URL}/${eventId}/participants`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(participantId), // Send the full `Participant` object
        });
    
        if (!response.ok) {
          throw new Error(`Failed to register: ${response.statusText}`);
        }
    
        // Check if the response has content
        const contentLength = response.headers.get("Content-Length");
        if (contentLength && parseInt(contentLength) > 0) {
          const data = await response.json(); // Parse JSON only if there's content
          return data;
        } else {
          return null; // No content to parse
        }
      } catch (error) {
        console.error("Error registering for event:", error);
        throw error; // Re-throw the error for handling in the component
      }
    };

    const auth = async(initData) => {
        if (!initData || !initData.user) {
          console.error("No Telegram user data found!");
        } else {
          console.log("Telegram User Data:", initData);
      
          fetch("/api/auth/telegram", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  user: initData.user,
                  auth_date: initData.auth_date,
                  hash: initData.hash
              })
          })
          .then(response => response.json())
          .then(data => {
              if (data.token) {
                  localStorage.setItem("token", data.token);  // ✅ Store JWT securely
                  console.log("Authentication successful! Token received.");
              } else {
                  console.error("Authentication failed!");
              }
          })
          .catch(error => console.error("Error during authentication:", error));
      }
    }
  return { events, fetchEvents, getEventById, registerForEvent, createEvent, confirmParticipation, removeParticipant, auth };
};