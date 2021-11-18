"use strict";

const ourListDivider = document.querySelector(".listGrid");
let ourHtml;

console.log(stores);

const renderList = function () {
	stores.features.forEach((i) => {
		console.log(i.properties.title);
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
            <button class="btn btn__01">
                <h4 class="heading-4">Read More</h4>
            </button>
        </div>
    </div>`;
		ourListDivider.insertAdjacentHTML("afterbegin", ourHtml);
	});
};

renderList();
