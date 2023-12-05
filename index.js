// Get references to the containers
let ipcontainer = document.querySelector(".ip-container");
let loccontainer = document.querySelector(".loc-container");
let zonecontainer = document.querySelector(".zone-container");
let ispcontainer = document.querySelector(".isp-container");
let errorEL = document.querySelector(".error-el");

// Function to fetch data based on IP address
async function fetchData(ipAddress) {
  try {
    let ip = ipAddress ? ipAddress : await fetchUserIP();
    let response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_XCNUGbhyqQOnd4xxXS9WwYFu19S3L&ipAddress=${ip}`
    );
    if (response.ok) {
      let data = await response.json();
      ipcontainer.textContent = data.ip;
      loccontainer.textContent = `${data.location.city}, ${data.location.country} ${data.location.postalCode}`;
      zonecontainer.textContent = `UTC ${data.location.timezone}`;
      ispcontainer.textContent = data.isp;
      errorEL.style.display = "none";
      errorEL.textContent = "";

      return data;
    } else {
      errorEL.style.display = "block";
      errorEL.textContent = "INVALID IP-ADDRESS";
      ipcontainer.textContent = "";
      loccontainer.textContent = "";
      zonecontainer.textContent = "";
      ispcontainer.textContent = "";

      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Function to fetch the user's IP address
async function fetchUserIP() {
  try {
    let response = await fetch("https://api.ipify.org?format=json");
    if (response.ok) {
      let data = await response.json();
      return data.ip;
    } else {
      throw new Error("Failed to fetch IP.");
    }
  } catch (error) {
    console.error("Error fetching IP:", error);
    return null;
  }
}

let mapcontainer = L.map("container-map", {
  zoomControl: true,
  preferCanvas: true,
});

// Add the tile layer
L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(mapcontainer);

function markerFunction() {}

async function handleFormSubmission(event) {
  event.preventDefault();

  const ipAddress = document.querySelector(".input-text").value;
  const data = await fetchData(ipAddress);

  if (data && data.location && data.location.lat && data.location.lng) {
    mapcontainer.setView([data.location.lat, data.location.lng], 13);

    const blackIcon = L.icon({
      iconUrl: "images/icon-location.svg",
      iconSize: [20, 20],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
    });

    L.marker([data.location.lat, data.location.lng], { icon: blackIcon })
      .addTo(mapcontainer)
      .bindPopup(data.ip);
  }
}

document
  .getElementById("form-action")
  .addEventListener("submit", handleFormSubmission);

window.onload = async () => {
  let data = await fetchData("");
  if (data && data.location && data.location.lat && data.location.lng) {
    mapcontainer.setView([data.location.lat, data.location.lng], 13);
    const blackIcon = L.icon({
      iconUrl: "images/icon-location.svg",
      iconSize: [20, 20],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
    });

    L.marker([data.location.lat, data.location.lng], { icon: blackIcon })
      .addTo(mapcontainer)
      .bindPopup(data.ip);
  }
};
