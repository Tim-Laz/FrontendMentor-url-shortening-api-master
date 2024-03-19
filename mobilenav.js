"use strict";

//Mobile nav
const btnMobile = document.querySelector(".btn-mobile-nav");

const navigation = document.querySelector(".navigation");

btnMobile.addEventListener("click", function (e) {
  e.preventDefault();
  navigation.classList.toggle("nav-open");
});

document.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("btn-mobile-nav") ||
    e.target.classList.contains("mobile-icon")
  )
    return;
  if (navigation.classList.contains("nav-open")) {
    navigation.classList.remove("nav-open");
  }
});
