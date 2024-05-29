---
layout: base
title: passport
permalink: /passport
---
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Travel Passport</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #F0F0F0;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 80%;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            margin-bottom: 10px;
        }
        h2 {
            text-align: center;
        }
        form {
            display: flex;
            flex-direction: column;
        }
        input, textarea, button {
            margin: 10px 0;
            padding: 10px;
            font-size: 1em;
        }
        #map {
            height: 400px;
            margin-bottom: 20px;
        }
        #entriesContainer {
            margin-top: 20px;
            background-color: #000;
            color: #fff;
            padding: 10px;
            max-height: 300px;
            overflow-y: auto;
        }
        .entry {
            border-bottom: 1px solid #ccc;
            padding: 10px 0;
        }
        .entry img {
            max-width: 100%;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Travel Passport</h1>
        <div id="map"></div>
        <form id="entryForm">
            <input type="text" id="location" placeholder="Location">
            <input type="text" id="coordinates" placeholder="Coordinates" readonly>
            <textarea id="journal" placeholder="Journal"></textarea>
            <input type="file" id="imageInput" accept="image/*" onchange="previewImage(event)">
            <img id="previewImage" src="#" alt="Image Preview" style="display:none; max-width: 100%;">
            <input type="text" id="imageUrl" placeholder="Image URL">
            <button type="submit">Add Entry</button>
        </form>
        <div id="entriesContainer"></div>
    </div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
        function loadTravelLog() {
            return JSON.parse(localStorage.getItem('travelLog')) || {};
        }
        function saveTravelLog(log) {
            localStorage.setItem('travelLog', JSON.stringify(log));
        }
        function displayEntries() {
            const container = document.getElementById('entriesContainer');
            container.innerHTML = '';
            const travelLog = loadTravelLog();
            for (const location in travelLog) {
                travelLog[location].forEach(entry => {
                    const entryDiv = document.createElement('div');
                    entryDiv.classList.add('entry');
                    entryDiv.innerHTML = `
                        <p><strong>Location:</strong> ${location}</p>
                        <p><strong>Coordinates:</strong> ${entry.coordinates}</p>
                        <p><strong>Journal:</strong> ${entry.journal}</p>
                        <p><strong>Image URL:</strong> <a href="${entry.image}" target="_blank">${entry.image}</a></p>
                        ${entry.image ? `<img src="${entry.image}" alt="Image for ${location}">` : ''}
                    `;
                    container.appendChild(entryDiv);
                    const [lat, lon] = entry.coordinates.split(', ').map(Number);
                    const marker = L.marker([lat, lon]).addTo(map);
                    marker.bindPopup(`<b>${location}</b><br>${entry.journal}`);
                });
            }
        }
        // Initialize map
        const map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        let selectedLat = null;
        let selectedLng = null;
        map.on('click', function(e) {
            selectedLat = e.latlng.lat;
            selectedLng = e.latlng.lng;
            document.getElementById('coordinates').value = `${selectedLat}, ${selectedLng}`;
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLat}&lon=${selectedLng}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('location').value = data.display_name || `${selectedLat}, ${selectedLng}`;
                })
                .catch(() => {
                    document.getElementById('location').value = `${selectedLat}, ${selectedLng}`;
                });
        });
        document.getElementById('entryForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const location = document.getElementById('location').value;
            const coordinates = document.getElementById('coordinates').value;
            const journal = document.getElementById('journal').value;
            const image = document.getElementById('previewImage').src || document.getElementById('imageUrl').value;
            const travelLog = loadTravelLog();
            if (!travelLog[location]) {
                travelLog[location] = [];
            }
            travelLog[location].push({ coordinates, journal, image });
            saveTravelLog(travelLog);
            document.getElementById('entryForm').reset();
            document.getElementById('previewImage').style.display = 'none';
            document.getElementById('imageUrl').value = '';
            displayEntries();
        });
        function previewImage(event) {
            const preview = document.getElementById('previewImage');
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = function () {
                preview.src = reader.result;
                preview.style.display = 'block';
            }
            if (file) {
                reader.readAsDataURL(file);
            } else {
                preview.src = '';
            }
        }
        displayEntries();
</script>
</body>
</html>