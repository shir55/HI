/*$(document).ready(function ()
        {
            govmap.createMap('map',
                {
                    token: '5a4b8472-b95b-4687-8179-0ccb621c7990',
                    layers: [
                      "GASSTATIONS", "PARCEL_HOKS", "KSHTANN_ASSETS", "bus_stops", "PARCEL_ALL",
                      "milestones", "Sex_Age_Religion", "ilezor", "POLICE_Yehida_Region", "f_natural",
                      "yeshuvim", "statistic_areas", "atractions", "cell_active", "atikot_sites_itm",
                      "tayarut", "Civil_Labour_Force", "Ages65_Plus", "Disabilities", "Emergancy_Hospitals",
                      "hotels", "LOCALITY_VAAD0410", "LOCALITY_210410", "SUB_GUSH_ALL", "index_taba_gzr_m",
                      "ganim_leumim", "Housing", "HOF_NAKI_update", "Education", "mitchmim_mshbsh",
                      "PetroleumRights", "Soil_types", "scenery_units", "PARCEL_ALL", "parcel_all",
                      "ilPublicSites_June05", "d170308_teva", "Mean_Temperature_Anual", "ilforest", "winery",
                      "LOCALITY", "Chambers", "PURIFIED_DRAINAGE_PONDS", "retzefMigrashim", "migrashim_msbs",
                      "MOSDOT_griatric", "MUNICIPALY", "Moatzot", "Origin", "Durable_Goods",
                      "Administration_Areas_new", "Mada_districs", "MMI_districts", "POLICE_Mahoz_Region",
                      "moch_districts", "health_districts", "agriculture_districts", "REGION", "NEMA",
                      "Quarries", "MahazevotNetushot", "d180308_meida", "Michrazim_Haluka", "Michrazim",
                      "bus_lines", "trans_lines", "Employee_Jobs", "POLICE_Mahoz_Location", "POLICE_Merhav_Location",
                      "t413", "SHEET100", "SHEET25", "SHEET50", "Mikve", "ilmerhav", "POLICE_Merhav_Region",
                      "moe_pikadon", "Occupations", "Households", "ilkkloff", "sport", "trans_poi",
                      "Marrige_Birth", "elect_regions", "health_counties", "COUNTY", "ilkklfiretr", "btl",
                      "banks", "Soil_survey", "ilstnd", "yeshuvim_b_pnim", "Industries", "atudot_mmi",
                      "RECTIFY_P", "zimmer", "density1967", "GR_LIN_P", "BL_LIN_P", "Purified_drainage_pipes",
                      "contour", "OilGasWells", "esip_0304", "open_area_sens", "fire_admin",
                      "drainage_authorities", "activefaults", "fire_areas", "suburb_rehabilitation", "Neighborhood",
                      "shmurot_teva_ganim", "Gazetteer", "WorkingHours_Transport", "retzefGvulot", "taba_msbs_itm",
                      "ilregion", "GPS_stations", "Stops", "bus_stops", "GASSTATIONS", "Health_care_baby_stations",
                      "FIRE_STATIONS", "MADA_STATIONS", "POLICE_Yehida_Location", "BlueLines_Tamatamam",
                      "d180308_tarbut", "beit_shean_7_5"],
                    showXY: true,
                    identifyOnClick: true,
                    isEmbeddedToggle: false,
                    background: "1",
                    layersMode: 1,
                    zoomButtons:true

                });

    $('form').on('submit', function(event) {
        //govmap.zoomToXY({ x: 176085, y: 657600, level: 10, marker: true });
        showExample(); // Call the function to draw the point on the map
        event.preventDefault();
        fetchFilteredData();
    });

    document.getElementById('cycle-markers-btn').addEventListener('click', function () {
        if (allMarkers.length === 0) return;

        // Close any currently open popup
        allMarkers.forEach(marker => marker.closePopup());

        // Open the popup of the marker at the current index
        allMarkers[currentMarkerIndex].openPopup();
        map.setView(allMarkers[currentMarkerIndex].getLatLng(), map.getMaxZoom());

        // Increment the index for the next click, wrap around if at the end
        currentMarkerIndex = (currentMarkerIndex + 1) % allMarkers.length;
    });

    document.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            this.classList.toggle('selected');
            updateSelectedOptions();
        });
    });



    document.querySelectorAll('.clear-field').forEach(clearButton => {
        clearButton.addEventListener('click', function() {
            this.previousElementSibling.value = '';
        });
    });

    document.getElementById('resetFormButton').addEventListener('click', function() {
        document.getElementById('resetConfirmationModal').style.display = 'block';
    });

    fetchAllData(); // Fetch all data when the page loads
});

function showExample(){
    govmap.draw(govmap.drawType.Point, {
        t    wkt: "LINESTRING(170704.30 579380.05, 232881.51 556890.42, 232881.51 556890.42)",
    notify: true,
    tolerance: 11906.273812547624
    }
}

var allMarkers = [];
var currentMarkerIndex = 0;


$(function() {
  $('input[name="datetimes"]').daterangepicker({
    timePicker: true,
    startDate: moment().startOf('hour'),
    endDate: moment().startOf('hour').add(32, 'hour'),
    locale: {
      format: 'M/DD hh:mm A'
    }
  });
});
document.getElementById('zoom-out-button').addEventListener('click', function () {
  // Zoom out to the specific place
  map.setView([31.5, 34.75], 8);
});

var lightbox = new SimpleLightbox('.gallery a');

function showModal() {
    document.getElementById('noDataModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('noDataModal').style.display = 'none';
}

function processData(data) {
    if (data.length === 1 && data[0].message === 'No details found') {
        showModal();
        return;
    }

    currentMarkerIndex = 0;
    allMarkers = [];
    /*map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    data.forEach(coord => {

        if (!coord.photos) {

            console.warn("Photos are undefined for this coordinate:", coord);
            return;
        }

        const { lat, lng, photos, id, start_range, end_range, submitted_by, classification } = coord;
        //govmap.zoomToXY({ x: 220201, y: 634657, level: 10, marker: true });
        //govmap.zoomToXY({ x: 218288, y: 585454, level: 10, marker: true });
        //const modifiedPhotos = photos.map(photo => '/photos/' + photo)
        //const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(createPopupContent(photos, id, submitted_by, classification, lat, lng));
        allMarkers.push(marker);


        marker.on('click', function () {
            if (map.getZoom() < map.getMaxZoom()) {
                    map.setView(marker.getLatLng(), map.getMaxZoom());
                } else {
                    // If already at maximum zoom, just open the popup
                    marker.openPopup();
                }
            const popup = L.popup({ maxWidth: 400, autoPan: true }).setLatLng(marker.getLatLng());
            const popupContent = createPopupContent(photos, id, submitted_by, classification);
            const popupWithPhotos = `<div class="gallery" style="max-height: 300px; overflow-y: auto;">${popupContent}</div>`;
            popup.setContent(popupWithPhotos);
            popup.openOn(map);
            lightbox.refresh();
        });
        currentMarkerIndex = 0;

    });
}

function fetchFilteredData() {
    console.log("fetchFilteredData called");
    const formData = new FormData(document.querySelector('form'));
    const urlParams = new URLSearchParams();

    const allTimes = document.getElementById('allTimes').checked;
    if (allTimes) {
        urlParams.append('allTimes', 'true');
    }

    formData.forEach((value, key) => {
        if (value) {
            if (key === 'datetimes') {
                const dates = value.split(' - ');
                urlParams.append('startDateTime', dates[0]);
                urlParams.append('endDateTime', dates[1]);
            } else {
                urlParams.append(key, value);
            }
        }
    });

    let selectedClassifications = [];
    document.querySelectorAll('.option-checkbox:checked').forEach(checkbox => {
        const label = document.querySelector(`label[for="${checkbox.id}"]`);
        if (label) {
            selectedClassifications.push(label.textContent);
        }    });

    if (selectedClassifications.length > 0) {
        urlParams.append('classifications', selectedClassifications.join(','));
    }

    const url = '/geolocation_data_with_photos?' + urlParams.toString();

    fetch(url)
        .then(response => response.json())
        .then(data => processData(data))
        .catch(error => console.error('Error:', error));
}

function createPopupContent(photos, eventNumber, submittedBy, classification, lat, lng) {
    let content = '<div class="popup-content-class">'; // Start of the scrollable div
    content += `<p><strong>מספר אירוע: ${eventNumber}</p>`;
    content += `<p><strong>הוגש ע״י: ${submittedBy}</p>`;
    content += `<p><strong>סיווג: ${classification}</p>`;
    content += `<p><strong>נ.צ.: ${lat.toFixed(5)}, ${lng.toFixed(5)}</strong></p>`; // Adding coordinates
    content += `<p><strong>מספר פריטים: ${photos.length}</strong></p>`; // Number of photos


    photos.forEach((photo, index) => {
        content += `<img src="${photo}" width="200" height="250" onclick="openModal('${photo}', ${index}, ${photos.length})" style="cursor:pointer;" /><br>`;
    });
    content += '</div>'; // End of the scrollable div
    return content;
}

function fetchAllData() {
    fetch('/geolocation_data_with_photos')
        .then(response => response.json())
        .then(data => processData(data))
        .catch(error => console.error('Error:', error));
}


function updateSelectedOptions() {
    let selectedValues = [];
    document.querySelectorAll('.option-button.selected').forEach(button => {
        selectedValues.push(button.value);
    });
    console.log("Selected Options: ", selectedValues);
}

function resetForm() {
    document.querySelector('form').reset();
    document.querySelectorAll('.option-button.selected').forEach(button => {
        button.classList.remove('selected');
    });
    closeResetModal();
}

function closeResetModal() {
    document.getElementById('resetConfirmationModal').style.display = 'none';
}

function toggleSidebar() {
    document.getElementById('container').classList.toggle('sidebar-collapsed');
}

function openModal(src, index, total) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('img01');
    img.src = src;

    // Check if arrows exist and update their onclick events
    let leftArrow = document.querySelector('.left-arrow');
    let rightArrow = document.querySelector('.right-arrow');

    if (!leftArrow) {
        leftArrow = document.createElement('div');
        leftArrow.className = 'left-arrow';
        modal.appendChild(leftArrow);
    }
    leftArrow.innerHTML = '&#10094;';
    leftArrow.onclick = function() { changeImage(index - 1, total); };

    if (!rightArrow) {
        rightArrow = document.createElement('div');
        rightArrow.className = 'right-arrow';
        modal.appendChild(rightArrow);
    }
    rightArrow.innerHTML = '&#10095;';
    rightArrow.onclick = function() { changeImage(index + 1, total); };

    modal.style.display = "block";
}


function changeImage(newIndex, total) {
    newIndex = (newIndex + total) % total; // Wrap around if index goes out of bounds
    const currentMarker = allMarkers[currentMarkerIndex];
    const photos = currentMarker.photos; // Assuming you have photos array in your marker data
    const newSrc = photos[newIndex];
    document.getElementById('img01').src = newSrc;
}


// Get the modal
var modal = document.getElementById('imageModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


$(document).ready(function() {
    $('#name').on('input', function() {
        var query = $(this).val();
        if (query.length >= 2) {
            $.ajax({
                url: '/get_user_names',
                data: { 'query': query },
                success: function(data) {
                    displayCustomSuggestions(data);
                }
            });
        } else {
            $('#custom-suggestions').empty().hide();
        }
    });

    $('.clear-field').click(function() {
        $(this).siblings('input').val('');
        $('#custom-suggestions').empty().hide();
    });
});

const eventNumberInput = document.getElementById('eventNumber');

    eventNumberInput.addEventListener('keypress', function(event) {
        if (event.which < 48 || event.which > 57) {
            event.preventDefault();
            // Display the custom message when a non-numeric key is pressed
            eventNumberInput.setCustomValidity('יש להכניס מספרים בלבד');
            // Trigger a fake "invalid" event to show the message
            eventNumberInput.reportValidity();
        } else {
            // Clear the custom validity message
            eventNumberInput.setCustomValidity('');
        }
    });

    // Clear the message when the user starts to correct their input
    eventNumberInput.addEventListener('input', function(event) {
        eventNumberInput.setCustomValidity('');
    });

function displayCustomSuggestions(names) {
    var suggestionBox = $('#custom-suggestions');
    suggestionBox.empty();

    names.forEach(function(name) {
        suggestionBox.append($('<div>').text(name).click(function() {
            $('#name').val(name);
            suggestionBox.empty().hide();
        }));
    });

    if (names.length > 0) {
        suggestionBox.show();
    } else {
        suggestionBox.hide();
    }
}


        document.addEventListener("DOMContentLoaded", function() {
            const optionCheckboxes = document.querySelectorAll('.option-checkbox');
            const chooseAllButton = document.getElementById('choose-all-btn');
            const clearAllButton = document.getElementById('clear-all-btn');

            // Function to handle choosing all options
            chooseAllButton.addEventListener('click', function() {
                optionCheckboxes.forEach(function(checkbox) {
                    checkbox.checked = true;
                });
            });

            // Function to handle clearing all options
            clearAllButton.addEventListener('click', function() {
                optionCheckboxes.forEach(function(checkbox) {
                    checkbox.checked = false;
                });
            });

            // Function to handle individual checkbox change
            optionCheckboxes.forEach(function(checkbox) {
                checkbox.addEventListener('change', function() {
                    // You can add further functionality here if needed
                });
            });
        });
*/
var map = L.map('map').setView([31.5, 34.75], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

/*
// Function to fetch pharmacies and add them as markers
function addPharmacies() {
    // Assuming this URL is called correctly and data is the API response
var overpassApiUrl = "http://overpass-api.de/api/interpreter?data=[out:json];node[amenity=pharmacy](31.0,34.0,31.5,34.5);out;";

    fetch(overpassApiUrl)
        .then(response => response.json())
        .then(data => {
            data.elements.forEach(element => {
                var marker = L.marker([element.lat, element.lon]).addTo(map);
                marker.bindPopup(`Pharmacy: ${element.tags.name || 'Unknown'}`);
            });
        })
        .catch(error => console.error('Error fetching pharmacy data:', error));
}

// Call the function to add pharmacies to the map
addPharmacies();
var marker = L.marker([31.4096260, 34.9749934]).addTo(map);
marker.bindPopup("Pharmacy: Alesra' Pharmacy");
*/

var allMarkers = [];
var currentMarkerIndex = 0;


$(function() {
  $('input[name="datetimes"]').daterangepicker({
    timePicker: true,
    startDate: moment().startOf('hour'),
    endDate: moment().startOf('hour').add(32, 'hour'),
    locale: {
      format: 'M/DD hh:mm A'
    }
  });
});

document.getElementById('zoom-out-button').addEventListener('click', function () {
  // Zoom out to the specific place
  map.setView([31.5, 34.75], 8);
});

var lightbox = new SimpleLightbox('.gallery a');

function showModal() {
    document.getElementById('noDataModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('noDataModal').style.display = 'none';
}

function processData(data) {
    if (data.length === 1 && data[0].message === 'No details found') {
        showModal();
        return;
    }

    currentMarkerIndex = 0;
    allMarkers = [];

    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    data.forEach(coord => {
        if (!coord.photos) {
            console.warn("Photos are undefined for this coordinate:", coord);
            return;
        }

        const { lat, lng, photos, id, start_range, end_range, submitted_by, classification } = coord;
        const modifiedPhotos = photos.map(photo => '/photos/' + photo)
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(createPopupContent(photos, id, submitted_by, classification, lat, lng));
        allMarkers.push(marker);


        marker.on('click', function () {
            if (map.getZoom() < map.getMaxZoom()) {
                    map.setView(marker.getLatLng(), map.getMaxZoom());
                } else {
                    // If already at maximum zoom, just open the popup
                    marker.openPopup();
                }
            const popup = L.popup({ maxWidth: 400, autoPan: true }).setLatLng(marker.getLatLng());
            const popupContent = createPopupContent(photos, id, submitted_by, classification);
            const popupWithPhotos = `<div class="gallery" style="max-height: 300px; overflow-y: auto;">${popupContent}</div>`;
            popup.setContent(popupWithPhotos);
            popup.openOn(map);
            lightbox.refresh();
        });
        currentMarkerIndex = 0;

    });
}

function fetchFilteredData() {
    console.log("fetchFilteredData called");
    const formData = new FormData(document.querySelector('form'));
    const urlParams = new URLSearchParams();

    const allTimes = document.getElementById('allTimes').checked;
    if (allTimes) {
        urlParams.append('allTimes', 'true');
    }

    formData.forEach((value, key) => {
        if (value) {
            if (key === 'datetimes') {
                const dates = value.split(' - ');
                urlParams.append('startDateTime', dates[0]);
                urlParams.append('endDateTime', dates[1]);
            } else {
                urlParams.append(key, value);
            }
        }
    });

    let selectedClassifications = [];
    document.querySelectorAll('.option-checkbox:checked').forEach(checkbox => {
        const label = document.querySelector(`label[for="${checkbox.id}"]`);
        if (label) {
            selectedClassifications.push(label.textContent);
        }    });

    if (selectedClassifications.length > 0) {
        urlParams.append('classifications', selectedClassifications.join(','));
    }

    const url = '/geolocation_data_with_photos?' + urlParams.toString();
    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(data => processData(data))
        .catch(error => console.error('Error:', error));
}

function createPopupContent(photos, eventNumber, submittedBy, classification, lat, lng) {
    let content = '<div class="popup-content-class">'; // Start of the scrollable div
    content += `<p><strong>מספר אירוע: ${eventNumber}</p>`;
    content += `<p><strong>הוגש ע״י: ${submittedBy}</p>`;
    content += `<p><strong>סיווג: ${classification}</p>`;
    content += `<p><strong>נ.צ.: ${lat.toFixed(5)}, ${lng.toFixed(5)}</strong></p>`; // Adding coordinates
    content += `<p><strong>מספר פריטים: ${photos.length}</strong></p>`; // Number of photos


    photos.forEach((photo, index) => {
        content += `<img src="${photo}" width="200" height="250" onclick="openModal('${photo}', ${index}, ${photos.length})" style="cursor:pointer;" /><br>`;
    });
    content += '</div>'; // End of the scrollable div
    return content;
}

function fetchAllData() {
    fetch('/geolocation_data_with_photos')
        .then(response => response.json())
        .then(data => processData(data))
        .catch(error => console.error('Error:', error));
}

$(document).ready(function () {

    $('form').on('submit', function(event) {
        event.preventDefault();
        fetchFilteredData();
    });

    document.getElementById('cycle-markers-btn').addEventListener('click', function () {
        if (allMarkers.length === 0) return;

        // Close any currently open popup
        allMarkers.forEach(marker => marker.closePopup());

        // Open the popup of the marker at the current index
        allMarkers[currentMarkerIndex].openPopup();
        map.setView(allMarkers[currentMarkerIndex].getLatLng(), map.getMaxZoom());

        // Increment the index for the next click, wrap around if at the end
        currentMarkerIndex = (currentMarkerIndex + 1) % allMarkers.length;
    });

    document.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            this.classList.toggle('selected');
            updateSelectedOptions();
        });
    });



    document.querySelectorAll('.clear-field').forEach(clearButton => {
        clearButton.addEventListener('click', function() {
            this.previousElementSibling.value = '';
        });
    });

    document.getElementById('resetFormButton').addEventListener('click', function() {
        document.getElementById('resetConfirmationModal').style.display = 'block';
    });
});

function updateSelectedOptions() {
    let selectedValues = [];
    document.querySelectorAll('.option-button.selected').forEach(button => {
        selectedValues.push(button.value);
    });
    console.log("Selected Options: ", selectedValues);
}

function resetForm() {
    document.querySelector('form').reset();
    document.querySelectorAll('.option-button.selected').forEach(button => {
        button.classList.remove('selected');
    });
    closeResetModal();
}

function closeResetModal() {
    document.getElementById('resetConfirmationModal').style.display = 'none';
}

function toggleSidebar() {
    document.getElementById('container').classList.toggle('sidebar-collapsed');
}

function openModal(src, index, total) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('img01');
    img.src = src;

    // Check if arrows exist and update their onclick events
    let leftArrow = document.querySelector('.left-arrow');
    let rightArrow = document.querySelector('.right-arrow');

    if (!leftArrow) {
        leftArrow = document.createElement('div');
        leftArrow.className = 'left-arrow';
        modal.appendChild(leftArrow);
    }
    leftArrow.innerHTML = '&#10094;';
    leftArrow.onclick = function() { changeImage(index - 1, total); };

    if (!rightArrow) {
        rightArrow = document.createElement('div');
        rightArrow.className = 'right-arrow';
        modal.appendChild(rightArrow);
    }
    rightArrow.innerHTML = '&#10095;';
    rightArrow.onclick = function() { changeImage(index + 1, total); };

    modal.style.display = "block";
}


function changeImage(newIndex, total) {
    newIndex = (newIndex + total) % total; // Wrap around if index goes out of bounds
    const currentMarker = allMarkers[currentMarkerIndex];
    const photos = currentMarker.photos; // Assuming you have photos array in your marker data
    const newSrc = photos[newIndex];
    document.getElementById('img01').src = newSrc;
}


// Get the modal
var modal = document.getElementById('imageModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


$(document).ready(function() {
    $('#name').on('input', function() {
        var query = $(this).val();
        if (query.length >= 2) {
            $.ajax({
                url: '/get_user_names',
                data: { 'query': query },
                success: function(data) {
                    displayCustomSuggestions(data, '#custom-suggestions');
                }
            });
        } else {
            $('#custom-suggestions').empty().hide();
        }
    });

    $('#street').on('input', function() {
        var query = $(this).val();
        if (query.length >= 2) {
            $.ajax({
                url: '/get_street',
                data: { 'query': query },
                success: function(data) {
                console.log(data)
                displayCustomSuggestions(data, '#autocomplete-suggestions-street');

                }
            });
        } else {
            $('#autocomplete-suggestions-street').empty().hide();
        }
    });

    $('#city').on('input', function() {
        var query = $(this).val();
        if (query.length >= 2) {
            $.ajax({
                url: '/get_city',
                data: { 'query': query },
                success: function(data) {
                    let uniqueArray = [...new Set(data)];
                    displayCustomSuggestions(uniqueArray, '#autocomplete-suggestions-city');
                }
            });
        } else {
            $('#autocomplete-suggestions-city').empty().hide();
        }
    });

    $('.clear-field').click(function() {
        $(this).siblings('input').val('');
        $('#custom-suggestions').empty().hide();
    });
});

const eventNumberInput = document.getElementById('eventNumber');

    eventNumberInput.addEventListener('keypress', function(event) {
        if (event.which < 48 || event.which > 57) {
            event.preventDefault();
            // Display the custom message when a non-numeric key is pressed
            eventNumberInput.setCustomValidity('יש להכניס מספרים בלבד');
            // Trigger a fake "invalid" event to show the message
            eventNumberInput.reportValidity();
        } else {
            // Clear the custom validity message
            eventNumberInput.setCustomValidity('');
        }
    });

    // Clear the message when the user starts to correct their input
    eventNumberInput.addEventListener('input', function(event) {
        eventNumberInput.setCustomValidity('');
    });
function displayCustomSuggestions(names, suggestionBoxId) {
    var suggestionBox = $(suggestionBoxId); // Corrected this line
    suggestionBox.empty();

    names.forEach(function(name) {
        var div = $('<div>').text(name).click(function() {
            $(suggestionBoxId).siblings('input').val(name);
            suggestionBox.empty().hide();
        });
        suggestionBox.append(div);
    });

    if (names.length > 0) {
        suggestionBox.show();
    } else {
        suggestionBox.hide();
    }
}


        document.addEventListener("DOMContentLoaded", function() {
            const optionCheckboxes = document.querySelectorAll('.option-checkbox');
            const chooseAllButton = document.getElementById('choose-all-btn');
            const clearAllButton = document.getElementById('clear-all-btn');

            // Function to handle choosing all options
            chooseAllButton.addEventListener('click', function() {
                optionCheckboxes.forEach(function(checkbox) {
                    checkbox.checked = true;
                });
            });

            // Function to handle clearing all options
            clearAllButton.addEventListener('click', function() {
                optionCheckboxes.forEach(function(checkbox) {
                    checkbox.checked = false;
                });
            });

            // Function to handle individual checkbox change
            optionCheckboxes.forEach(function(checkbox) {
                checkbox.addEventListener('change', function() {
                    // You can add further functionality here if needed
                });
            });
        });
