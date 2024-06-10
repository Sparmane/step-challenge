// Simulate step data (in a real scenario, you would fetch this from a server or file)
const stepData = {
  currentSteps: 85000, // Example current steps
  targets: [
    { name: 'Sitges, Spain', stepsRequired: 0, url: 'page_sitges.html' },
    { name: 'Barcelona, Spain', stepsRequired: 71400, url: 'page_barcelona.html' }, // 23.8 miles
    { name: 'Mataró, Spain', stepsRequired: 133800, url: 'page_mataro.html' }, // 71,400 + 62,400 (total steps from start)
    { name: 'Blanes, Spain', stepsRequired: 185700, url: 'page_blanes.html' }, // 133,800 + 51,900
    { name: 'Cadaqués, Spain', stepsRequired: 321300, url: 'page_cadaques.html' }, // 185,700 + 135,600
    { name: 'Perpignan, France', stepsRequired: 406500, url: 'page_perpignan.html' }, // 321,300 + 85,200
    { name: 'Narbonne, France', stepsRequired: 525900, url: 'page_narbonne.html' }, // 406,500 + 119,400
    { name: 'Béziers, France', stepsRequired: 574200, url: 'page_beziers.html' }, // 525,900 + 48,300
    { name: 'Sète, France', stepsRequired: 617100, url: 'page_sete.html' }, // 574,200 + 42,900
    { name: 'Montpellier, France', stepsRequired: 672900, url: 'page_montpellier.html' }, // 617,100 + 55,800
    { name: 'Arles, France', stepsRequired: 814500, url: 'page_arles.html' }, // 672,900 + 141,600
    { name: 'Marseille, France', stepsRequired: 977700, url: 'page_marseille.html' } // 814,500 + 163,200
  ]
};

// Initialize the map and set its view to Sitges, Spain
const map = L.map('map').setView([41.2351, 1.8089], 6);

// Add a tile layer to add to our map, in this case, it's an OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Array of locations with latitude, longitude, name, and URL
const locations = stepData.targets.map(target => ({
  lat: getLat(target.name),
  lng: getLng(target.name),
  name: target.name,
  url: target.url,
  stepsRequired: target.stepsRequired
}));

function getLat(name) {
  switch (name) {
    case 'Sitges, Spain': return 41.2351;
    case 'Barcelona, Spain': return 41.3809;
    case 'Mataró, Spain': return 41.5381;
    case 'Blanes, Spain': return 41.6731;
    case 'Cadaqués, Spain': return 42.2881;
    case 'Perpignan, France': return 42.6986;
    case 'Narbonne, France': return 43.1843;
    case 'Béziers, France': return 43.3431;
    case 'Sète, France': return 43.4076;
    case 'Montpellier, France': return 43.6117;
    case 'Arles, France': return 43.6766;
    case 'Marseille, France': return 43.2965;
    default: return 0;
  }
}

function getLng(name) {
  switch (name) {
    case 'Sitges, Spain': return 1.8089;
    case 'Barcelona, Spain': return 2.1228;
    case 'Mataró, Spain': return 2.4445;
    case 'Blanes, Spain': return 2.7923;
    case 'Cadaqués, Spain': return 3.2874;
    case 'Perpignan, France': return 2.8954;
    case 'Narbonne, France': return 2.9947;
    case 'Béziers, France': return 3.2154;
    case 'Sète, France': return 3.6926;
    case 'Montpellier, France': return 3.8777;
    case 'Arles, France': return 4.6277;
    case 'Marseille, France': return 5.3698;
    default: return 0;
  }
}

// Function to check if a location is unlocked based on current steps
function isUnlocked(locationName) {
  const target = stepData.targets.find(target => target.name === locationName);
  return target && stepData.currentSteps >= target.stepsRequired;
}

// Update overlay with current steps and next target
function updateOverlay() {
  const overlay = document.getElementById('steps-info');
  const nextTarget = stepData.targets.find(target => stepData.currentSteps < target.stepsRequired);
  if (nextTarget) {
    const stepsRemaining = nextTarget.stepsRequired - stepData.currentSteps;
    overlay.innerHTML = `Current Steps: ${stepData.currentSteps}<br>Next Target: ${nextTarget.name}<br>Steps to Next Target: ${stepsRemaining}`;
  } else {
    overlay.innerHTML = `Current Steps: ${stepData.currentSteps}<br>All targets reached!`;
  }
}

// Function to handle marker click
function handleMarkerClick(url) {
  document.body.classList.add('fade-out');
  const music = document.getElementById('background-music');
  music.volume = 1.0;
  const fadeAudio = setInterval(() => {
    if (music.volume > 0.05) {
      music.volume -= 0.05;
    } else {
      clearInterval(fadeAudio);
      music.pause();
      window.location.href = url;
    }
  }, 60); // fade out over 3 seconds (60ms * 50 = 3000ms)
}

// Loop through locations and add markers to the map
locations.forEach(loc => {
  const unlocked = isUnlocked(loc.name);
  const marker = L.marker([loc.lat, loc.lng], {
    className: unlocked ? '' : 'locked-marker'
  }).addTo(map);

  marker.bindTooltip(loc.name, {
    permanent: false,
    direction: 'top'
  });

  if (unlocked) {
    marker.on('click', function() {
      handleMarkerClick(loc.url);
    });
  } else {
    const stepsRequired = loc.stepsRequired;
    const stepsRemaining = stepsRequired - stepData.currentSteps;
    marker.bindPopup(`<b>${loc.name}</b><br>Location locked. You need ${stepsRemaining} more steps to unlock.`);
  }
});

// Function to update the map when steps are updated (in a real scenario, this would be called when step data is updated)
function updateSteps(newStepCount) {
  stepData.currentSteps = newStepCount;
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      const popupContent = layer.getPopup().getContent();
      const locationNameMatch = popupContent.match(/<b>(.*?)<\/b>/);
      if (locationNameMatch) {
        const locationName = locationNameMatch[1];
        const unlocked = isUnlocked(locationName);
        if (unlocked) {
          layer.setPopupContent(`<b>${locationName}</b><br><a href="${locations.find(loc => loc.name === locationName).url}" target="_self">More info</a>`);
          layer.getElement().classList.remove('locked-marker');
          layer.off('click');
          layer.on('click', function() {
            handleMarkerClick(locations.find(loc => loc.name === locationName).url);
          });
        } else {
          const stepsRequired = stepData.targets.find(target => target.name === locationName).stepsRequired;
          const stepsRemaining = stepsRequired - stepData.currentSteps;
          layer.setPopupContent(`<b>${locationName}</b><br>Location locked. You need ${stepsRemaining} more steps to unlock.`);
        }
      }
    }
  });
  updateOverlay(); // Update overlay when steps are updated
}

// Initial overlay update
updateOverlay();
