"use strict";
const form = document.querySelector(".shorten-form");
const linkInput = document.querySelector(".shorten-input");
const btnShorten = document.querySelector(".btn-shorten");
const btnCopy = document.querySelector(".btn-copy");

class ShortenApp {
  constructor() {}
}

async function getResponse() {
  try {
    const response = await fetch("https://cleanuri.com/api/v1/shorten", {
      method: "POST",
      origin: "https://cleanuri.com/",
      body: new URLSearchParams({
        url: "https://google.com/",
      }),
    });
    console.log(response);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.log(error);
  }
}

getResponse();
