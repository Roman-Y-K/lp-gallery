'use strict';

import { fetchImages } from './api-service.js';
import { refs } from './refs.js';

const paginationLimit = 9;
const pageCount = Math.ceil(100 / paginationLimit);
let currentPage = 1;
let images = [];

images = await fetchImages(currentPage);
createGallary(images);
refs.paginationRef.style.display = 'flex';

refs.galleryRef.addEventListener('click', onOpenModal);
refs.btnCloseRef.addEventListener('click', onCloseModal);
refs.overlayRef.addEventListener('click', onOverlayClick);
refs.nextBtnRef.addEventListener('click', onPageClick);
refs.prevBtnRef.addEventListener('click', onPageClick);

function createGallary(array) {
  const gallaryList = array.reduce(
    (string, { download_url, author, id }) =>
      string +
      `<li class="gallery--item"><a
    class="gallery__link"
    href="${`https://picsum.photos/id/${id}/500/333`}"
  > <img
      class="gallery__image"
      src="${`https://picsum.photos/id/${id}/500/333`}"
      data-source="${download_url}"
      alt="${author}"
    /> </a>
</li>`,
    ''
  );
  refs.galleryRef.insertAdjacentHTML('afterbegin', gallaryList);
  refs.pageCounterRef.insertAdjacentText('afterbegin', `Page: ${currentPage}`);
  disableButton();
}

function onOpenModal(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }

  const bigImg = event.target.dataset.source;

  window.addEventListener('keydown', onEscapePress);

  refs.lightBoxRef.classList.add('is-open');

  refs.backdropImageRef.src = bigImg;
}

function onCloseModal() {
  window.removeEventListener('keydown', onEscapePress);
  refs.lightBoxRef.classList.remove('is-open');
  refs.backdropImageRef.src = '';
}

function onOverlayClick(event) {
  if (event.target === event.currentTarget) {
    onCloseModal();
  }
}

function onEscapePress(event) {
  if (event.code === 'Escape') {
    onCloseModal();
  }
}

function clearGallery() {
  refs.galleryRef.innerHTML = '';
  refs.pageCounterRef.innerHTML = '';
}

function disableButton() {
  currentPage === 1
    ? refs.prevBtnRef.classList.add('disabled')
    : refs.prevBtnRef.classList.remove('disabled');

  currentPage === pageCount
    ? refs.nextBtnRef.classList.add('disabled')
    : refs.nextBtnRef.classList.remove('disabled');
}

async function onPageClick(e) {
  const { id } = e.target;
  currentPage = id === 'next-page' ? (currentPage += 1) : (currentPage -= 1);
  images = await fetchImages(currentPage);
  clearGallery();
  createGallary(images);
}
