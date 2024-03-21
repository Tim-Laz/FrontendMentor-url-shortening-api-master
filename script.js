"use strict";
const form = document.querySelector(".shorten-form");
const linkInput = document.querySelector("#shorten-input");
const btnShorten = document.querySelector(".btn-shorten");
const btnCopy = document.querySelector(".btn-copy");
const shortenContainer = document.querySelector(".shorten-container");
const linksContainer = document.querySelector(".links-container");
const errorMsg = document.querySelector(".error-msg");

class ShortenApp {
  #shortLinks = [];

  constructor() {
    form.addEventListener("submit", this.showInputError);
    linkInput.addEventListener("input", this.hideInputError);
    form.addEventListener("submit", this.renderLinkBlockView.bind(this));
    linksContainer.addEventListener("click", this.copy);
    window.addEventListener("load", this.loadFromLocalStorage.bind(this));
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

  //Method for cleanuri API

  // async getResponse(url) {
  //   try {
  //     if (!url) return;
  //     const response = await fetch("https://cleanuri.com/api/v1/shorten", {
  //       method: "POST",
  //       body: new URLSearchParams({
  //         url: url,
  //       }),
  //     });
  //     if (response.status !== 200) {
  //       throw new Error(`Something went wrong, status: ${response.status}`);
  //     }
  //     const json = await response.json();
  //     return json.result_url;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  //Method for tinyurl API

  async getResponse(url) {
    try {
      if (!url) return;
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${url}`
      );
      if (response.status !== 200) {
        throw new Error(`Something went wrong, status: ${response.status}`);
      }
      const text = await response.text();
      return text;
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
      this.#shortLinks.push({ long: longUrl, short: shortUrl });
      this.updateLocalStorage();
    } catch (error) {
      this.showApiError(error);
    } finally {
      linkInput.value = "";
    }
  }

  async copy(e) {
    if (!e.target.classList.contains("btn-copy")) return;
    const shortLinkText = e.target.previousElementSibling.textContent;
    let curBtn = e.target;
    await navigator.clipboard.writeText(shortLinkText);
    linksContainer.querySelectorAll(".btn-copy").forEach((btn) => {
      btn.classList.remove("btn-copied");
      btn.textContent = "Copy";
    });
    curBtn.classList.add("btn-copied");
    curBtn.textContent = "Copied!";
    setTimeout(() => {
      curBtn.classList.remove("btn-copied");
      curBtn.textContent = "Copy";
    }, 2000);
  }

  updateLocalStorage() {
    localStorage.setItem("shortLinks", JSON.stringify(this.#shortLinks));
  }

  loadFromLocalStorage() {
    const localLinks = JSON.parse(localStorage?.getItem("shortLinks"));
    this.#shortLinks = localLinks || [];
    this.#shortLinks.forEach((link) => {
      this.renderMarkup(link.long, link.short);
    });
  }
}

const app = new ShortenApp();
