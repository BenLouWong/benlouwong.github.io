"use strict";

const hamburger = document.querySelector(".searchBar__hamburger");
const closeHam = document.querySelector(".sidebar__close");
const sidebar = document.querySelector(".sidebar");
const sidebarOverlay = document.querySelector(".sidebar__overlay");
const preLoadCont = document.querySelector(".loader__container");
const card = document.querySelector(".card");
const cardImg = document.querySelector(".card__img");
const cardContent = document.getElementById("card__content");
const cardActive = document.querySelector(".card__active");
const cardBtn = document.querySelectorAll(".cardBtn");
const defaultPos = [151.2057150002948, -33.87303520459041];

const createCard = function (currentFeature) {
	card.classList.add("card__active");
	let html = `
    <h3 class="heading-3 card__heading card__heading--main">
        ${currentFeature.properties.title}
        </h3>
        <h4 class="heading-4 card__heading card__heading--sub">
        ${currentFeature.properties.address}
        </h4>
        <div class="card__rating flex">
            <ion-icon
                name="star"
                class="card__rating--star"
            ></ion-icon>
            <ion-icon
                name="star"
                class="card__rating--star"
            ></ion-icon>
            <ion-icon
                name="star"
                class="card__rating--star"
            ></ion-icon>
            <ion-icon
                name="star"
                class="card__rating--star"
            ></ion-icon>
        </div>
        <div class="card__buttons flex flex__ai-center">
            <button
                class="
                    cardBtn cardBtn__direction
                    flex flex__ai-center flex__jc-center
                "
                data-btn="1"
            >
                <div class="cardBtn__direction--arrow">⮦</div>
                
            </button>

            <button
                class="
                    cardBtn cardBtn__fav
                    flex flex__ai-center flex__jc-center
                "
                data-btn="2"
            >
                <div class="cardBtn__fav--line"></div>
                <div
                    class="cardBtn__fav--line cardBtn__fav--line-02"
                ></div>
            </button>
            <button
                class="
                    cardBtn cardBtn__more
                    flex flex__ai-center flex__jc-center
                "
                data-btn="3"
            >
                <div class="cardBtn__more--dot"></div>
                <div class="cardBtn__more--dot"></div>
                <div class="cardBtn__more--dot"></div>
            </button>
        </div>`;
	cardContent.innerHTML = html;
};
const closeCard = function () {
	card.classList.remove("card__active");
};

const testBtn = cardBtn.forEach(function (e) {
	const dataId = e.dataset.btn;
	e.addEventListener("click", function () {
		console.log(dataId);
	});
});

/////////////// Stores data within the storeData.js file

stores.features.forEach((store, i) => {
	store.properties.id = i;
});

mapboxgl.accessToken =
	"pk.eyJ1IjoiYmVubHciLCJhIjoiY2t2N2p1YTQ4OWtsbzJwbWFxbGlxeTR5aSJ9.h-C9wZFdtTINvHwcJXKfMg";

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

// ////////////// Loading the map

const successLocation = function (position) {
	// console.log(position);
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
	//   Create Geocoder search bar
	const geocoder = new MapboxGeocoder({
		// Initialize the geocoder
		accessToken: mapboxgl.accessToken, // Set the access token
		setRouting: true,
		mapboxgl: mapboxgl, // Set the mapbox-gl instance
		marker: false, // Do not use the default marker style
		placeholder: "Enter Suburb",
		zoom: 13,
	});
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

	const createPopups = function (currentFeature) {
		const popUps = document.getElementsByClassName("mapboxgl-popup");
		/** Check if there is already a popup on the map and if so, remove it */
		if (popUps[0]) popUps[0].remove();

		const popup = new mapboxgl.Popup({ closeOnClick: false })
			.setLngLat(currentFeature.geometry.coordinates)
			.setHTML(
				`<h3 class='heading-3'>${currentFeature.properties.title}</h3><h4 class='heading-4'>${currentFeature.properties.address}</h4>`
			)
			.addTo(map);

		popup.on("close", () => {
			closeCard();
		});
	};

	const flyTo = function (currentFeature) {
		map.flyTo({
			center: currentFeature.geometry.coordinates,
			zoom: 15,
		});
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
				flyTo(marker);
				createPopups(marker);
				createCard(marker);
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
	};

	map.on("load", mapFunctions);
	// map.on("click", closeCard);
};

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
	enableHighAccuracy: true,
});
