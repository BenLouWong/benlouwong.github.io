"use strict";

const ourListDivider = document.querySelector(".listGrid");
let ourHtml;

const description = document.querySelector(".description");
const descriptionClose = document.querySelector(".description__close");
const descHeadings = document.querySelector(".description__headings");
const descOverview = document.querySelector(".overviewCont");
const descRecomm = document.querySelector(".descrCont");
const descriptionOverlay = document.querySelector(".description__overlay");

const renderList = function () {
	stores.features.forEach((i) => {
		ourHtml = `<div class="listCard flex flex__dir-col flex__jc-sb">
        <div class="listCard__photo">
            <img
                src="images/${i.properties.title}.jpg"
                alt=""
            />
        </div>
        <div class="listCard__content">
            <div class="heading- favCard__textCont--heading">
            ${i.properties.title}
            </div>
            <h3
                class="
                    heading-3
                    description__heading
                    description__heading--02
                "
            >
            ${i.properties.address}, ${i.properties.city}, ${i.properties.state}, ${i.properties.postalCode}
            </h3>
            <button class="listBtn btn btn__01">
                <h4 class="heading-4">Read More</h4>
            </button>
        </div>
    </div>`;
		ourListDivider.insertAdjacentHTML("afterbegin", ourHtml);
		document
			.querySelector(".listBtn")
			.addEventListener("click", function () {
				description.classList.add("description__active");
				let descrHtml = `
            <h2 class="
                heading-1
                description__heading description__heading--01
            ">
            ${i.properties.title}
            </h2>
            <h3
                class="
                    heading-3
                    description__heading description__heading--02
                ">
            ${i.properties.address}, ${i.properties.city}, ${i.properties.state}, ${i.properties.postalCode}
            </h3>`;
				let overviewHTML = `<p>${i.properties.overview}</p>`;
				let recommHTML = `<p>${i.properties.recommendations}</p>`;
				descHeadings.innerHTML = descrHtml;
				descOverview.innerHTML = overviewHTML;
				descRecomm.innerHTML = recommHTML;
				descriptionOverlay.classList.add(
					"description__overlay--active"
				);
			});
	});
	descriptionClose.addEventListener("click", () => {
		description.classList.remove("description__active");
		descriptionOverlay.classList.remove("description__overlay--active");
	});
};

renderList();

import Swiper from "https://unpkg.com/swiper@7/swiper-bundle.esm.browser.min.js";
const swiper = new Swiper(".swiper", {
	pagination: {
		el: ".swiper-pagination",
		dynamicBullets: true,
	},
});
