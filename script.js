const map = L.map('map').setView([54.2, -1.7], 10); // Centered on North Yorkshire

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const locations = [
  { lat: 54.2, lng: -1.7, name: 'Location 1', url: 'page1.html' },
  { lat: 54.3, lng: -1.6, name: 'Location 2', url: 'page2.html' },
  // Add more locations as needed
];

locations.forEach(loc => {
  const marker = L.marker([loc.lat, loc.lng]).addTo(map)
    .bindPopup(`<b>${loc.name}</b><br><a href="${loc.url}" target="_blank">More info</a>`);
});
