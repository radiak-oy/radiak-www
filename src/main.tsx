import React from "react";
import ReactDOM from "react-dom/client";
import RequestOfferForm from "./RequestOfferForm.tsx";
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("request-offer-form") as HTMLElement
).render(
  <React.StrictMode>
    <RequestOfferForm />
  </React.StrictMode>
);

const navbarMenu = document.getElementById("navbar-menu") as HTMLDivElement;
const navbarMenuToggleBtn = document.getElementById(
  "navbar-menu-toggle"
) as HTMLButtonElement;

const navbarBorder = document.getElementById("navbar-border") as HTMLDivElement;

let isNavbarBorderShown = false;
function setIsNavbarBorderShown(isShown: boolean) {
  if (isShown) {
    navbarBorder.classList.add("opacity-100");
    navbarBorder.classList.remove("opacity-0");
  } else {
    navbarBorder.classList.add("opacity-0");
    navbarBorder.classList.remove("opacity-100");
  }

  isNavbarBorderShown = isShown;
}

function toggleMenu() {
  const isMenuOpen = !navbarMenu.classList.contains("h-0");
  if (isMenuOpen) {
    navbarMenu.classList.add("h-0");
    navbarMenu.classList.remove("h-10", "mt-2");

    navbarMenuToggleBtn.classList.remove("rotate-180");
    setIsNavbarBorderShown(window.scrollY > 0);
  } else {
    navbarMenu.classList.add("h-10", "mt-2");
    navbarMenu.classList.remove("h-0");

    navbarMenuToggleBtn.classList.add("rotate-180");

    setIsNavbarBorderShown(true);
  }
}

navbarMenuToggleBtn.onclick = toggleMenu;
document.getElementById("navbar-menu-palvelut")!.onclick = function () {
  toggleMenu();
  document.getElementById("palvelut")!.scrollIntoView();
};

document.getElementById("navbar-menu-contact")!.onclick = function () {
  toggleMenu();
  document.getElementById("tarjouspyynto")!.scrollIntoView();
};

const navbarLogo = document.getElementById("navbar-logo") as HTMLDivElement;
function updateNavbar() {
  if (window.scrollY > 0) {
    if (isNavbarBorderShown === false) setIsNavbarBorderShown(true);

    if (navbarLogo.style.animationPlayState !== "running")
      navbarLogo.style.animationPlayState = "running";
  } else if (isNavbarBorderShown === true) setIsNavbarBorderShown(false);
}

window.onscroll = updateNavbar;

updateNavbar();
