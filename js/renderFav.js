"use strict";

const listFav = JSON.parse(localStorage.getItem("cafe"));
const favDivider = document.querySelector(".favDivider");
let listHtml;
const description = document.querySelector(".description");
const descriptionClose = document.querySelector(".description__close");
const descHeadings = document.querySelector(".description__headings");
const descOverview = document.querySelector(".overviewCont");
const descRecomm = document.querySelector(".descrCont");

console.log(listFav);

const renderFav = function () {
	listFav.forEach((i) => {
		listHtml = `<div class="favCard flex flex__ai-center">
        <div class="favCard__img">
            <img src="images/${i.title}.jpg"
            alt="card image" class="favCard__img" />
        </div>

        <div
            class="
                favCard__textCont
                flex flex__ai-center flex__jc-center flex__dir-col
            "
        >
            <div class="h3 heading-3 favCard__textCont--heading">
                ${i.title}
            </div>
            <button class="favCard__btn">
                <h4 class="heading-4">Read More</h4>
            </button>
        </div>
    </div>`;
		favDivider.insertAdjacentHTML("afterend", listHtml);
		document
			.querySelector(".favCard__btn")
			.addEventListener("click", function () {
				description.classList.add("description__active");
				console.log(i);
				let descrHtml = `
            <h2 class="
                heading-1
                description__heading description__heading--01
            ">
            ${i.title}
            </h2>
            <h3
                class="
                    heading-3
                    description__heading description__heading--02
                ">
            ${i.address}, ${i.city}, ${i.state}, ${i.postalCode}
            </h3>`;
				let overviewHTML = `<p>${i.overview}</p>`;
				let recommHTML = `<p>${i.recommendations}</p>`;
				descHeadings.innerHTML = descrHtml;
				descOverview.innerHTML = overviewHTML;
				descRecomm.innerHTML = recommHTML;
			});
	});

	descriptionClose.addEventListener("click", () => {
		description.classList.remove("description__active");
	});
	// Description - image swiper
};
renderFav();
import Swiper from "https://unpkg.com/swiper@7/swiper-bundle.esm.browser.min.js";
const swiper = new Swiper(".swiper", {
	pagination: {
		el: ".swiper-pagination",
		dynamicBullets: true,
	},
});
