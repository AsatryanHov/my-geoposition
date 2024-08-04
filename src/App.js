import React, { useState, useEffect } from "react";

export default function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error obtaining geolocation:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const reverseGeocode = async (lat, lng) => {
    const apiKey = "c82b253f5818497793c61091b22d3f83";
    const url = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${lat}+${lng}&pretty=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      if (data.results.length > 0) {
        const { city, country } = data.results[0].components;
        setLocationInfo(`${city}, ${country}`);
      } else {
        setLocationInfo("Location information not found");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      reverseGeocode(latitude, longitude);
    }
  }, [latitude, longitude]);

  const copyAndShare = () => {
    const coordinates = `${latitude}, ${longitude}`;

    navigator.clipboard
      .writeText(coordinates)
      .then(() => {
        console.log("Coordinates copied to clipboard:", coordinates);

        if (navigator.share) {
          navigator
            .share({
              title: "My Location",
              text: `Check out my location: ${coordinates}`,
            })
            .then(() => console.log("Successfully shared"))
            .catch((error) => console.error("Error sharing:", error));
        } else {
          console.log("Web Share API not supported");
          // Provide alternative sharing options or UI here
        }
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };

  return (
    <div className="App">
      {latitude !== null && longitude !== null ? (
        <>
          <p>Latitude: {latitude}</p>
          <p>Longitude: {longitude}</p>
          <p>Location: {locationInfo || "Loading location..."}</p>
          <button onClick={copyAndShare}>Copy & Share</button>
        </>
      ) : (
        <p>Loading location...</p>
      )}
      <button onClick={getLocation}>Update Location</button>
    </div>
  );
}
