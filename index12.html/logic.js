// scripts/trip_builder_logic.js

/**
 * Trip Planner Core Logic
 * Handles destination selection, date validation, and itinerary generation.
 */

// --- 1. CORE DATA ---
const ALL_DESTINATIONS = [
    { key: "Baguio", name: "Baguio City", days: 2 },
    { key: "Bohol", name: "Bohol Island", days: 3 },
    { key: "Boracay", name: "Boracay Island", days: 3 },
    { key: "Siargao", name: "Siargao Island", days: 4 },
    { key: "Elnido", name: "El Nido, Palawan", days: 3 },
    { key: "Cebu", name: "Cebu (City & South)", days: 4 },
    { key: "Coron", name: "Coron, Palawan", days: 3 },
    { key: "Vigan", name: "Vigan City, Ilocos", days: 2 },
    { key: "Davao", name: "Davao City", days: 3 },
    { key: "Batanes", name: "Batanes Islands", days: 4 }
];

// --- 2. UTILITY FUNCTIONS ---

/** Converts date string (YYYY-MM-DD) to Date object */
const parseDate = (dateString) => new Date(dateString + 'T00:00:00');

/** Calculates the difference in days between two dates */
const getDaysDifference = (date1, date2) => {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end days
};

/** Formats a Date object into a readable string */
const formatDateReadable = (date) => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/** Adds days to a Date object */
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

// --- 3. DOM ELEMENT REFERENCES ---
const destinationOptionsEl = document.getElementById('destinationOptions');
const startDateEl = document.getElementById('startDate');
const endDateEl = document.getElementById('endDate');
const generateTripBtn = document.getElementById('generateTripBtn');
const tripSummaryEl = document.getElementById('tripSummary');
const itineraryDetailEl = document.getElementById('itineraryDetail');
const errorEl = document.getElementById('error-message');
const printBtn = document.getElementById('printBtn');
const saveBtn = document.getElementById('saveBtn');

let selectedDestinations = [];

// --- 4. UI GENERATION ---

/** Generates the destination tags for the picker */
const renderDestinationOptions = () => {
    ALL_DESTINATIONS.forEach(dest => {
        const tag = document.createElement('span');
        tag.classList.add('dest-tag');
        tag.textContent = dest.name;
        tag.dataset.key = dest.key;
        tag.dataset.days = dest.days;
        tag.addEventListener('click', () => toggleDestination(dest));
        destinationOptionsEl.appendChild(tag);
    });
};

/** Toggles destination selection */
const toggleDestination = (dest) => {
    const index = selectedDestinations.findIndex(d => d.key === dest.key);
    const tagEl = destinationOptionsEl.querySelector(`[data-key="${dest.key}"]`);

    if (index === -1) {
        // Add destination
        selectedDestinations.push(dest);
        tagEl.classList.add('selected');
    } else {
        // Remove destination
        selectedDestinations.splice(index, 1);
        tagEl.classList.remove('selected');
    }
};

// --- 5. TRIP GENERATION LOGIC ---

/** Validates dates and selections */
const validateInputs = (start, end) => {
    if (!start || !end) {
        return "Please select both a start and end date for your trip.";
    }
    const startDate = parseDate(start);
    const endDate = parseDate(end);

    if (startDate >= endDate) {
        return "The start date must be before the end date.";
    }

    if (selectedDestinations.length === 0) {
        return "Please select at least one destination.";
    }

    const totalRequiredDays = selectedDestinations.reduce((sum, dest) => sum + dest.days, 0);
    const totalAvailableDays = getDaysDifference(startDate, endDate);

    if (totalRequiredDays > totalAvailableDays) {
        return `Your selected destinations require ${totalRequiredDays} days, but your trip only lasts ${totalAvailableDays} days. Please adjust your dates or destinations.`;
    }

    errorEl.textContent = "";
    return null;
};

/** Main function to generate and display the itinerary */
const generateItinerary = () => {
    const startDateString = startDateEl.value;
    const endDateString = endDateEl.value;

    const validationError = validateInputs(startDateString, endDateString);
    if (validationError) {
        errorEl.textContent = validationError;
        itineraryDetailEl.innerHTML = '';
        tripSummaryEl.innerHTML = `<p>Error: ${validationError}</p>`;
        printBtn.disabled = true;
        saveBtn.disabled = true;
        return;
    }

    const startDate = parseDate(startDateString);
    const totalDays = getDaysDifference(startDate, parseDate(endDateString));
    const totalDestinations = selectedDestinations.length;
    const totalRequiredDays = selectedDestinations.reduce((sum, dest) => sum + dest.days, 0);

    // Sort destinations alphabetically or by a preference metric (optional)
    selectedDestinations.sort((a, b) => a.name.localeCompare(b.name)); 

    // Generate Summary
    tripSummaryEl.innerHTML = `
        <p><strong>Total Trip Duration:</strong> ${totalDays} days (${formatDateReadable(startDate)} to ${formatDateReadable(parseDate(endDateString))})</p>
        <p><strong>Destinations:</strong> ${totalDestinations} selected.</p>
        <p><strong>Minimum Required Days:</strong> ${totalRequiredDays} days.</p>
        <p>Your itinerary is calculated based on ${totalRequiredDays} continuous travel days.</p>
    `;

    // Generate Detailed Itinerary
    let currentDate = startDate;
    let itineraryHTML = '<h3>Detailed Schedule</h3>';
    let detailedItineraryData = [];

    selectedDestinations.forEach((dest, index) => {
        const departureDate = new Date(currentDate);
        const arrivalDate = addDays(new Date(departureDate), dest.days - 1); // -1 because it includes the arrival day

        // Generate the card HTML
        itineraryHTML += `
            <div class="itinerary-card">
                <h4><i class="fas fa-map-marker-alt"></i> Day ${index + 1}: ${dest.name}</h4>
                <p><strong>Stay:</strong> ${dest.days} days</p>
                <p><strong>Dates:</strong> ${formatDateReadable(departureDate)} &mdash; ${formatDateReadable(arrivalDate)}</p>
                <p>Expected activities: Sightseeing, Local Tours, Relaxation.</p>
            </div>
        `;
        
        // Add to data structure for saving
        detailedItineraryData.push({
            destination: dest.name,
            days: dest.days,
            startDate: formatDateReadable(departureDate),
            endDate: formatDateReadable(arrivalDate)
        });

        // Update current date for the next leg of the trip (add the days spent + 1 day for travel/transition)
        currentDate = addDays(arrivalDate, 1); 
    });

    itineraryDetailEl.innerHTML = itineraryHTML;
    printBtn.disabled = false;
    saveBtn.disabled = false;
    
    // Store data for export
    saveBtn.dataset.tripData = JSON.stringify(detailedItineraryData);
};

// --- 6. EVENT LISTENERS & INITIALIZATION ---

generateTripBtn.addEventListener('click', generateItinerary);

printBtn.addEventListener('click', () => {
    window.print();
});

saveBtn.addEventListener('click', () => {
    const data = saveBtn.dataset.tripData;
    if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Philippine_Itinerary_' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    renderDestinationOptions();
});