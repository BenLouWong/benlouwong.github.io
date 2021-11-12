"use strict";

/////////////// Store data within the storeData.js file
const hamburger = document.querySelector(".searchBar__hamburger");
const closeHam = document.querySelector(".sidebar__close");
const sidebar = document.querySelector(".sidebar");
const sidebarOverlay = document.querySelector(".sidebar__overlay");
const addedSuccessful = document.querySelector(".overlay__added--successful");
const addedSuccessful02 = document.querySelector(
	".overlay__added--successful-cont"
);
const addedError = document.querySelector(".overlay__added--error");
const addedError02 = document.querySelector(".overlay__added--error-cont");
const preLoadCont = document.querySelector(".loader__container");
const searchBar = document.querySelector(".searchBar");
const card = document.querySelector(".card");
const cardContent = document.getElementById("card__content");
const cardRating = document.querySelector(".card__rating");
const cardBtn = document.querySelectorAll(".cardBtn");
const defaultPos = [151.2057150002948, -33.87303520459041];
const description = document.querySelector(".description");
const descriptionClose = document.querySelector(".description__close");
const descHeadings = document.querySelector(".description__headings");
const descOverview = document.querySelector(".overviewCont");
const descRecomm = document.querySelector(".descrCont");
const descRating = document.querySelector(".descrRating");
const btnDirect = document.querySelector(".cardBtn__direction");
const btnFav = document.querySelector(".cardBtn__fav");
const btnMore = document.querySelector(".cardBtn__more");
const directionsCont = document.querySelector(".directions__cont");
const directionsBack = document.querySelector(".backArrow__directions");

let favourites = [];
let html;

mapboxgl.accessToken =
	"pk.eyJ1IjoiYmVubHciLCJhIjoiY2t2N2p1YTQ4OWtsbzJwbWFxbGlxeTR5aSJ9.h-C9wZFdtTINvHwcJXKfMg";

// ////////////// Information Card
const createCard = function (currentFeature) {
	card.classList.add("card__active");
	html = `
	    <h3 class="heading-3 card__heading card__heading--main">
	        ${currentFeature.properties.title}
	    </h3>
	    <h4 class="heading-4 card__heading card__heading--sub">
	        ${currentFeature.properties.address}
	    </h4>
	    
	    `;
	// 	let htmlRating = `<ion-icon
	//     name="star"
	//     class="card__rating--star"
	// ></ion-icon>`;

	cardContent.innerHTML = html;
	// cardRating.insertAdjacentHTML("afterend", currentFeature.properties.rating);
};
const closeCard = function () {
	card.classList.remove("card__active");
};

// ////////////// Give each store unique id
stores.features.forEach((store, i) => {
	store.properties.id = i;
});

// ////////////// Side navigation functionality
const openMenu = function () {
	sidebar.classList.add("sidebar__active");
	sidebarOverlay.classList.add("sidebar__overlay--active");
};

const closeMenu = function () {
	sidebar.classList.remove("sidebar__active");
	sidebarOverlay.classList.remove("sidebar__overlay--active");
};

hamburger.addEventListener("click", openMenu);
closeHam.addEventListener("click", closeMenu);

// ////////////// Preloader
const preLoadClose = function () {
	preLoadCont.classList.add("loader__container--hidden");
};

// ////////////// Geocoder & Searchbar
const geocoder = new MapboxGeocoder({
	// Initialize the geocoder
	accessToken: mapboxgl.accessToken, // Set the access token
	setRouting: true,
	mapboxgl: mapboxgl, // Set the mapbox-gl instance
	marker: false, // Do not use the default marker style
	placeholder: "Enter Suburb",
	zoom: 13,
});
const loadSearchBar = function () {
	searchBar.classList.add("searchBar__active");
};

// ////////////// Directions
const directions = new MapboxDirections({
	accessToken:
		"pk.eyJ1IjoiYmVubHciLCJhIjoiY2t2N2p1YTQ4OWtsbzJwbWFxbGlxeTR5aSJ9.h-C9wZFdtTINvHwcJXKfMg",
	unit: "metric",
	profile: "mapbox/walking",
	interactive: 0,
	placeholderOrigin: "Your location",
	placeholderDestination: "Your destination",
	zoom: 10,
	alternatives: "true",
});

// ////////////// Loading the map
const successLocation = function (position) {
	setupMap([position.coords.longitude, position.coords.latitude]);
};

const errorLocation = function () {
	alert("Please enable location services for a better user experience!");
	setupMap(defaultPos);
};

const setupMap = function (center) {
	const map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/streets-v11",
		center: center,
		zoom: 13,
	});

	document.getElementById("directionsBox").appendChild(directions.onAdd(map));
	document.getElementById("geocoder").appendChild(geocoder.onAdd(map));

	// ////////////// Render cafe location on map
	const addCafe = function () {
		//     Add feature cafes
		map.addLayer({
			id: "locations",
			type: "circle",
			/* Add a GeoJSON source containing place coordinates and information. */
			source: {
				type: "geojson",
				data: stores,
			},
		});
	};

	// ////////////// Enable pin when click on cafe
	const createPin = function (currentFeature) {
		const popUps = document.getElementsByClassName("mapboxgl-popup");
		/** Check if there is already a popup on the map and if so, remove it */
		if (popUps[0]) popUps[0].remove();

		const popup = new mapboxgl.Popup({ closeOnClick: false })
			.setLngLat(currentFeature.geometry.coordinates)
			.setHTML(`<div class='pin'></div>`)
			.addTo(map);

		// popup.on("close", () => {
		// 	closeCard();
		// });
	};

	// ////////////// Enable fly to pin when clicked
	const flyTo = function (currentFeature) {
		map.flyTo({
			center: currentFeature.geometry.coordinates,
			zoom: 15,
		});
	};

	// ////////////// Enables starting location as current location when clicked on directions button
	const originFunction = function () {
		directions.setOrigin(center);
	};

	const cardFunctions = function (marker) {
		// ////////////// Directions Button functionality
		btnDirect.addEventListener("click", function () {
			originFunction();
			directions.setDestination(marker.geometry.coordinates);
			directionsCont.classList.add("directions__cont--active");
		});

		// ////////////// Favourites Button functionality
		btnFav.addEventListener("click", function () {
			let data = JSON.parse(localStorage.getItem("cafe"));
			if (!data) data = [];

			// // ////////////// Validate whether or not currentfeature is already within favourites
			const validateFav = function () {
				const addFavSuccess = function () {
					const successAddPopup = function () {
						addedSuccessful02.classList.add(
							"overlay__added--successful-cont--active"
						);
						addedSuccessful.classList.add(
							"overlay__added--successful--active"
						);
					};
					const removeAddPopup = function () {
						addedSuccessful02.classList.remove(
							"overlay__added--successful-cont--active"
						);
						addedSuccessful.classList.remove(
							"overlay__added--successful--active"
						);
					};
					successAddPopup();
					setTimeout(removeAddPopup, 3000);
				};

				const addFavError = function () {
					const errorAddPopup = function () {
						addedError02.classList.add(
							"overlay__added--error-cont--active"
						);
						addedError.classList.add(
							"overlay__added--error--active"
						);
					};
					const removeErrorPopup = function () {
						addedError02.classList.remove(
							"overlay__added--error-cont--active"
						);
						addedError.classList.remove(
							"overlay__added--error--active"
						);
					};
					errorAddPopup();
					setTimeout(removeErrorPopup, 2000);
				};
				let dataId = [];

				data.forEach(function (e) {
					dataId.push(e.id);
				});

				console.log(dataId);

				// console.log(favIdArray, marker.properties.id);
				// console.log(favIdArray.includes(marker.properties.id));

				dataId.includes(marker.properties.id)
					? addFavError()
					: addFavSuccess();
			};

			validateFav();

			data.push(marker.properties);

			let favArrUnique = [
				...new Set(data.map((currentFeature) => currentFeature.id)), //Set will only allow unique values in it, so i'm going to pass it the ids of each object. If the loop tries to add the same value again, it'll get ignored for free.
			].map((id) => {
				return data.find((currentFeature) => currentFeature.id === id); //With the array of ids I got on step 1, I run a map function on it and return the actual address from the original address array
			});

			const storeFavourite = function () {
				localStorage.setItem("cafe", JSON.stringify(favArrUnique));
				// localStorage.setItem("cafe", JSON.stringify(data));
			};

			storeFavourite();
			// localStorage.removeItem("cafe");
		});

		// ////////////// More Button functionality
		btnMore.addEventListener("click", () => {
			description.classList.add("description__active");
			let descrHtml = `
            <h2 class="
                heading-1
                description__heading description__heading--01
            ">
            ${marker.properties.title}
            </h2>
            <h3
                class="
                    heading-3
                    description__heading description__heading--02
                ">
            ${marker.properties.address}, ${marker.properties.city}, ${marker.properties.postalCode}
            </h3>`;
			let overviewHTML = `<p>${marker.properties.overview}</p>`;
			let descrHTML = `<p>${marker.properties.recommendations}</p>`;
			descHeadings.innerHTML = descrHtml;
			descOverview.innerHTML = overviewHTML;
			descRecomm.innerHTML = descrHTML;
		});

		flyTo(marker);
		createPin(marker);
		createCard(marker);
	};

	// ////////////// Add custom markers to cafe locations
	const addMarkers = function () {
		for (const marker of stores.features) {
			/* Create a div element for the marker. */
			const el = document.createElement("div");
			/* Assign a unique `id` to the marker. */
			el.id = `markerCafe-${marker.properties.id}`;
			console.log(`${marker.properties.id}`);
			/* Assign the `marker` class to each marker for styling. */
			el.className = "markerCafe";

			new mapboxgl.Marker(el)
				.setLngLat(marker.geometry.coordinates)
				.addTo(map);

			/* Call cardfunctions when each marker is clicked. */
			el.addEventListener("click", function () {
				cardFunctions(marker);
			});
		}
	};

	// ////////////// Add pin at start
	const addStart = function () {
		const start = center;
		// Add starting point to the map
		map.addLayer({
			id: "locations",
			type: "circle",
			/* Add a GeoJSON source containing place coordinates and information. */
			source: {
				type: "geojson",
				data: start,
			},
		});
		const element = document.createElement("div");
		/* Assign the `marker` class to each marker for styling. */
		element.className = "markerUser";

		new mapboxgl.Marker(element).setLngLat(start).addTo(map);
	};

	const mapFunctions = function () {
		addCafe();
		addStart();
		addMarkers();
		setTimeout(preLoadClose);
		loadSearchBar();
	};

	map.on("load", mapFunctions);
};

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
	enableHighAccuracy: true,
});

directionsBack.addEventListener("click", () => {
	directionsCont.classList.remove("directions__cont--active");
});

descriptionClose.addEventListener("click", () => {
	description.classList.remove("description__active");
});
