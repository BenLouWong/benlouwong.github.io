"use strict";

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
const cardBtn = document.querySelectorAll(".cardBtn");
const defaultPos = [151.2057150002948, -33.87303520459041];
const btnDirect = document.querySelector(".cardBtn__direction");
const btnFav = document.querySelector(".cardBtn__fav");
const btnMore = document.querySelector(".cardBtn__more");
const directionsCont = document.querySelector(".directions__cont");
const directionsBack = document.querySelector(".backArrow__directions");

let favourites = [];
// let favSet = [];
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
	cardContent.innerHTML = html;
};
const closeCard = function () {
	card.classList.remove("card__active");
};

/////////////// Store data within the storeData.js file
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

// ////////////// Geocoder
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

	// Cafe functionality including popup, marker and card
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

	const flyTo = function (currentFeature) {
		map.flyTo({
			center: currentFeature.geometry.coordinates,
			zoom: 15,
		});
	};

	const originFunction = function () {
		directions.setOrigin(center);
	};

	const cardFunctions = function (marker) {
		btnDirect.addEventListener("click", function () {
			originFunction();
			directions.setDestination(marker.geometry.coordinates);
			directionsCont.classList.add("directions__cont--active");
		});

		// To be completed
		btnFav.addEventListener("click", function () {
			// console.log("click");
			const storeFavourite = function () {
				favourites.push(marker.properties);
				let favArrUnique = [
					...new Set(
						favourites.map((currentFeature) => currentFeature.id)
					), //Set will only allow unique values in it, so i'm going to pass it the ids of each object. If the loop tries to add the same value again, it'll get ignored for free.
				].map((id) => {
					return favourites.find(
						(currentFeature) => currentFeature.id === id
					); //With the array of ids I got on step 1, I run a map function on it and return the actual address from the original address array
				});
				localStorage.setItem("cafe", JSON.stringify(favArrUnique));
				console.log(favArrUnique);
			};

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
				setTimeout(removeAddPopup, 2000);
			};

			const addFavError = function () {
				const errorAddPopup = function () {
					addedError02.classList.add(
						"overlay__added--error-cont--active"
					);
					addedError.classList.add("overlay__added--error--active");
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

			const validateFav = function () {
				let favArray = [];

				data.forEach(function (i) {
					favArray.push(i.id);
				});
				favArray.forEach(function () {
					favArray.includes(marker.properties.id)
						? addFavError()
						: addFavSuccess();
				});
			};

			const data = JSON.parse(localStorage.getItem("cafe"));
			if (!data) return;

			storeFavourite();
			validateFav();
		});

		flyTo(marker);
		createPin(marker);
		createCard(marker);
	};

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

			el.addEventListener("click", function () {
				cardFunctions(marker);
			});
		}
	};

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

// ////////////// Card Functions
directionsBack.addEventListener("click", () => {
	directionsCont.classList.remove("directions__cont--active");
});

btnMore.addEventListener("click", () => {
	console.log("more");
});
