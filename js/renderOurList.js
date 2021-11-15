"use strict";

const ourListDivider = document.querySelector(".listDivider");
let ourHtml;

console.log(stores);

const renderList = function () {
	stores.features.forEach((i) => {
		console.log(i.properties.title);
		ourHtml = `<div class="favCard flex flex__ai-center">
    <div class="favCard__img">
        <img src="https://images.unsplash.com/photo-1619213553840-32ef26990e38?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80" alt="" class="favCard__img" />
    </div>

    <div
        class="
            favCard__textCont
            flex flex__ai-center flex__jc-center flex__dir-col
        "
    >
        <div class="h3 heading-3 favCard__textCont--heading">
            ${i.properties.title}
        </div>
        <button class="favCard__btn">
            <h4 class="heading-4">Read More</h4>
        </button>
    </div>
</div>`;
		ourListDivider.insertAdjacentHTML("afterend", ourHtml);
	});
};

renderList();
