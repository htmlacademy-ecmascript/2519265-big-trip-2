import AbstractView from '../framework/view/abstract-view';
import { sorts, SortType } from '../const';

function getSortList(sortCheking = SortType.DAY) {
  return sorts.map((sort) => {

    const checkingForSorting = (Object.values(SortType).includes(sort.name)) ? `data-sort-type=${sort.name}` : 'disabled';

    return (
      `<div class="trip-sort__item  trip-sort__item--${sort.name}">
      <input id="sort-${sort.name}" class="trip-sort__input  visually-hidden" type="radio" ${checkingForSorting} name="trip-sort" value="sort-${sort.name}" ${(sortCheking === sort.name) && 'checked'}>
      <label class="trip-sort__btn" for="sort-${sort.name}">${(sort.name).charAt(0).toUpperCase() + (sort.name).slice(1)}</label>
    </div>`);
  });
}

function createSortTemplate(type) {

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${getSortList(type).join('')}
      </form>`
  );
}

export default class SortView extends AbstractView {

  #handleSortTypeChange = null;
  #currentSortType;

  constructor({ onSortTypeChange }) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this.#currentSortType = evt.target.dataset.sortType;


    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
