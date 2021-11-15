"use strict";

const listFav = JSON.parse(localStorage.getItem("cafe"));
const favDivider = document.querySelector(".favDivider");
const ourListDivider = document.querySelector(".listDivider");
let listHtml;
console.log(stores);
let ourHtml;

const renderFav = function () {
	listFav.forEach((i) => {
		listHtml = `<div class="favCard flex flex__ai-center">
        <div class="favCard__img">
            <img src="https://images.unsplash.com/photo-1534201569625-ed4662d8be97?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=711&q=80" alt="" class="favCard__img" />
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
	});
};
renderFav();

const renderList = function () {
	stores.forEach(function (i) {
		console.log(i.title);
	});
};
renderList();
