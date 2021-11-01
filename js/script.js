"use strict";

const hamburger = document.querySelector(".searchBar__hamburger");
const closeHam = document.querySelector(".sidebar__close");
const sidebar = document.querySelector(".sidebar");
const sidebarOverlay = document.querySelector(".sidebar__overlay");

mapboxgl.accessToken =
	"pk.eyJ1IjoiYmVubHciLCJhIjoiY2t2N2p1YTQ4OWtsbzJwbWFxbGlxeTR5aSJ9.h-C9wZFdtTINvHwcJXKfMg";

const defaultPos = [151.2057150002948, -33.87303520459041];

// Side navigation functionality
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

// ////////////// Loading the map

const successLocation = function (position) {
	console.log(position);
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
		zoom: 15,
	});
	document.getElementById("geocoder").appendChild(geocoder.onAdd(map));
};

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
	enableHighAccuracy: true,
});
