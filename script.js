"use strict";
const form = document.querySelector(".shorten-form");
const linkInput = document.querySelector("#shorten-input");
const btnShorten = document.querySelector(".btn-shorten");
const btnCopy = document.querySelector(".btn-copy");
const shortenContainer = document.querySelector(".shorten-container");
const linksContainer = document.querySelector(".links-container");
const errorMsg = document.querySelector(".error-msg");

class ShortenApp {
  constructor() {
    form.addEventListener("submit", this.showInputError);
    linkInput.addEventListener("input", this.hideInputError);
    form.addEventListener("submit", this.renderLinkBlockView.bind(this));
    linksContainer.addEventListener("click", this.copy);
  }

  showInputError(e) {
    e.preventDefault();
    if (!linkInput.value) {
      shortenContainer.classList.add("error");
      errorMsg.textContent = "Please add a link";
    }
  }

  showApiError(error) {
    shortenContainer.classList.add("error");
    errorMsg.textContent = error;
  }

  hideInputError() {
    if (shortenContainer.classList.contains("error")) {
      shortenContainer.classList.remove("error");
    }
  }

  async getResponse(url) {
    try {
      if (!url) return;
      const response = await fetch("https://cleanuri.com/api/v1/shorten", {
        method: "POST",
        body: new URLSearchParams({
          url: url,
        }),
      });
      if (response.status !== 200) {
        throw new Error(`Something went wrong, status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json.result_url);
      return json.result_url;
    } catch (error) {
      throw error;
    }
  }

  renderMarkup(url1, url2) {
    const markup = `
    <div class="link-block">
      <div class="link-orig-cont">
        <p class="link-orig">${url1}</p>
    </div>
    <div class="link-short-btn">
        <p class="link-short">${url2}</p>
        <button class="btn btn-copy">Copy</button>
    </div>
    </div>
  `;
    linksContainer.insertAdjacentHTML("beforeend", markup);
  }

  async renderLinkBlockView(e) {
    try {
      e.preventDefault;
      const longUrl = linkInput.value;
      if (!longUrl) return;
      const shortUrl = await this.getResponse(longUrl);
      this.renderMarkup(longUrl, shortUrl);
    } catch (error) {
      this.showApiError(error);
    } finally {
      linkInput.value = "";
    }
  }

  async copy(e) {
    if (!e.target.classList.contains("btn-copy")) return;
    const shortLinkText = e.target.previousElementSibling.textContent;
    await navigator.clipboard.writeText(shortLinkText);
    linksContainer.querySelectorAll(".btn-copy").forEach((btn) => {
      btn.classList.remove("btn-copied");
      btn.textContent = "Copy";
    });
    e.target.classList.add("btn-copied");
    e.target.textContent = "Copied!";
  }
}

const app = new ShortenApp();
