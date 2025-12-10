// scripts/dashboard_logic.js

// --- 1. CONSOLIDATED DATA MODEL ---

// Combination of your 10 destinations, popularity data (from chart),
// map coordinates, and new feature ratings.

const DASHBOARD_DATA = [
    { 
        id: 1, name: "Baguio", visitors: 60, theme: "Mountain/Culture", affordability: 3, 
        lat: 16.4024, lng: 120.5960, 
        features: { Scenery: 4, Nightlife: 2, Culture: 5, Affordability: 3, Adventure: 3 } 
    },
    { 
        id: 2, name: "Bohol", visitors: 64, theme: "Beach/History", affordability: 2, 
        lat: 9.8787, lng: 124.2389, 
        features: { Scenery: 5, Nightlife: 3, Culture: 4, Affordability: 4, Adventure: 3 } 
    },
    { 
        id: 3, name: "Boracay", visitors: 88, theme: "Beach/Party", affordability: 4, 
        lat: 11.9678, lng: 121.9219, 
        features: { Scenery: 5, Nightlife: 5, Culture: 2, Affordability: 2, Adventure: 4 } 
    },
    { 
        id: 4, name: "Siargao", visitors: 70, theme: "Surf/Adventure", affordability: 3, 
        lat: 9.8887, lng: 126.0469, 
        features: { Scenery: 4, Nightlife: 3, Culture: 2, Affordability: 3, Adventure: 5 } 
    },
    { 
        id: 5, name: "El Nido", visitors: 55, theme: "Island/Nature", affordability: 5, 
        lat: 11.2000, lng: 119.4167, 
        features: { Scenery: 5, Nightlife: 2, Culture: 3, Affordability: 2, Adventure: 4 } 
    },
    { 
        id: 6, name: "Cebu", visitors: 95, theme: "City/Hub", affordability: 3, 
        lat: 10.3157, lng: 123.8854, 
        features: { Scenery: 3, Nightlife: 4, Culture: 4, Affordability: 4, Adventure: 2 } 
    },
    { 
        id: 7, name: "Coron", visitors: 50, theme: "Wreck Dive/Nature", affordability: 5, 
        lat: 11.9961, lng: 120.2045, 
        features: { Scenery: 5, Nightlife: 1, Culture: 3, Affordability: 2, Adventure: 5 } 
    },
    { 
        id: 8, name: "Vigan", visitors: 30, theme: "History/Culture", affordability: 2, 
        lat: 17.5746, lng: 120.3897, 
        features: { Scenery: 3, Nightlife: 1, Culture: 5, Affordability: 5, Adventure: 1 } 
    },
    { 
        id: 9, name: "Davao", visitors: 45, theme: "Eco-tourism/City", affordability: 3, 
        lat: 7.1907, lng: 125.4549, 
        features: { Scenery: 4, Nightlife: 3, Culture: 4, Affordability: 4, Adventure: 3 } 
    },
    { 
        id: 10, name: "Batanes", visitors: 25, theme: "Scenery/Rural", affordability: 5, 
        lat: 20.4468, lng: 121.9723, 
        features: { Scenery: 5, Nightlife: 1, Culture: 4, Affordability: 1, Adventure: 3 } 
    }
];

// --- 2. CHART INSTANCES & SETUP ---

let popularityChartInstance;
let featureChartInstance;

const chartColors = [
    '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#d35400', '#2980b9', '#8e44ad', '#34495e'
];

// --- 3. CHART RENDERING FUNCTIONS ---

// Renders the Bar Chart for Visitor Popularity
const renderPopularityChart = () => {
    const ctx = document.getElementById('popularityChart').getContext('2d');
    
    // Sort data for better visualization
    const sortedData = [...DASHBOARD_DATA].sort((a, b) => b.visitors - a.visitors);

    popularityChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedData.map(d => d.name),
            datasets: [{
                label: 'Visitors (Units)',
                data: sortedData.map(d => d.visitors),
                backgroundColor: sortedData.map((d, i) => chartColors[DASHBOARD_DATA.findIndex(item => item.name === d.name)]),
                borderColor: '#333',
                borderWidth: 1,
                borderRadius: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: 'Visitor Popularity Ranking' },
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Visitors' } }
            }
        }
    });
};

// Renders the Radar Chart for Destination Features
const renderFeatureChart = (destinationName) => {
    const data = DASHBOARD_DATA.find(d => d.name === destinationName);
    if (!data) return;

    if (featureChartInstance) {
        featureChartInstance.destroy();
    }
    
    const ctx = document.getElementById('featureChart').getContext('2d');
    const features = data.features;
    const labels = Object.keys(features);
    const scores = Object.values(features);

    featureChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: destinationName + ' Rating (1-5)',
                data: scores,
                backgroundColor: 'rgba(52, 152, 219, 0.4)',
                borderColor: '#3498db',
                pointBackgroundColor: '#3498db',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { display: false },
                    suggestedMin: 0,
                    suggestedMax: 5,
                    ticks: { beginAtZero: true, stepSize: 1 }
                }
            },
            plugins: {
                title: { display: true, text: `Feature Scores for ${destinationName}` },
                legend: { display: true }
            }
        }
    });
};

// --- 4. TABLE RENDERING ---

const renderDataTable = () => {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';
    
    DASHBOARD_DATA.forEach((d, index) => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = d.id;
        row.insertCell().textContent = d.name;
        row.insertCell().textContent = d.visitors;
        row.insertCell().textContent = '$'.repeat(d.affordability);
        row.insertCell().textContent = d.theme;
    });
};

// --- 5. GEOGRAPHIC SCATTER PLOT ---

const renderGeoScatterPlot = () => {
    const canvas = document.getElementById('geoScatterPlot');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = 400; 

    const padding = 40;
    
    // Determine the min/max coordinates for scaling
    const minLat = Math.min(...DASHBOARD_DATA.map(d => d.lat));
    const maxLat = Math.max(...DASHBOARD_DATA.map(d => d.lat));
    const minLng = Math.min(...DASHBOARD_DATA.map(d => d.lng));
    const maxLng = Math.max(...DASHBOARD_DATA.map(d => d.lng));

    const widthRange = maxLng - minLng;
    const heightRange = maxLat - minLat;

    const drawPoint = (dataPoint) => {
        // Project Lat/Lng to X/Y canvas coordinates
        // Note: Longitude (X) maps directly. Latitude (Y) is inverted for typical map orientation.
        const x = padding + (dataPoint.lng - minLng) / widthRange * (canvas.width - 2 * padding);
        const y = padding + (maxLat - dataPoint.lat) / heightRange * (canvas.height - 2 * padding); 
        
        const size = 6 + dataPoint.visitors / 20; // Scale size based on popularity
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fillStyle = chartColors[dataPoint.id - 1];
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.stroke();

        // Label the point
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(dataPoint.name, x + size + 2, y + 4);
    };
    
    // Draw the bounds/axes (simple)
    ctx.strokeStyle = '#999';
    ctx.strokeRect(padding, padding, canvas.width - 2 * padding, canvas.height - 2 * padding);

    // Draw all data points
    DASHBOARD_DATA.forEach(drawPoint);
};


// --- 6. INITIALIZATION ---

const setupEventListeners = () => {
    const destSelect = document.getElementById('destSelect');
    
    // Populate the dropdown selector
    DASHBOARD_DATA.forEach(d => {
        const option = document.createElement('option');
        option.value = d.name;
        option.textContent = d.name;
        destSelect.appendChild(option);
    });

    // Event listener for dropdown change
    destSelect.addEventListener('change', (e) => {
        renderFeatureChart(e.target.value);
    });
    
    // Re-render scatter plot on window resize
    window.addEventListener('resize', renderGeoScatterPlot);
};

// Main function to run on load
const initializeDashboard = () => {
    setupEventListeners();
    
    // Render all components
    renderPopularityChart();
    renderDataTable();
    renderGeoScatterPlot();
    
    // Render the initial feature chart (default to the first destination)
    renderFeatureChart(DASHBOARD_DATA[0].name);
};

document.addEventListener('DOMContentLoaded', initializeDashboard);