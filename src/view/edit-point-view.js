import { DAY_FORMAT } from '../const';
import { createElement } from '../render';
import humanizeDueDay from '../utils';

function createEventTypeTemplate(points, point) {

  const getType = (type, checked) => (`<div class="event__type-item">
            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${type} ${checked}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
          </div>`);
  const pointsList = points.map(({ type }) => {
    const checked = (type === point.type) ? 'checked' : '';
    getType(type, checked);
  });

  return pointsList.join('');
}

function createDestinationListTemplate(destinations) {
  const destinationsList = destinations.map(({ name }) => (`<option value=${name}></option>`));
  return `<datalist id="destination-list-1">${destinationsList.join('')}</datalist>`;
}

function createOfferTemplate(point, offers, type, offersOfPoint) {
  function getOfferTemplate({ id, title, price } = offers) {
    const checked = point.offers.find((item) => item === id) ? 'checked' : '';

    return (
      `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" ${checked}>
          <label class="event__offer-label" for="event-offer-comfort-1">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>`
    );

  }

  if (offersOfPoint.length <= 0) {
    return '';
  } else {


    for (const offersWithType of offers) {
      if (offersWithType.type === type) {
        const list = offersWithType.offers.map(({ id, title, price }) => getOfferTemplate({ id, title, price }));

        return (`<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
            ${list.join('')}
            </div>
          </section>`);
      }
    }
  }
}

function createPicturesOfDestinations(pictures) {

  function getPictureTemplate({ src, description }) {
    return (`<img class="event__photo" src=${src} alt=${description}>`);
  }

  if (pictures) {
    const list = pictures.map(({ src, description }) => getPictureTemplate({ src, description }));

    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
        ${list.join('')}
        </div>
      </div>`
    );
  } else {
    return '';
  }
}

function createEditPointTemplate(points, offers, destinations, point, offersOfPoint, destinationOfPoint) {
  const { basePrice, dateFrom, dateTo, type } = point;
  const { description, name, pictures } = destinationOfPoint;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventTypeTemplate(points, point)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
              <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${name} list="destination-list-1">

              ${createDestinationListTemplate(destinations)}

          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value=${humanizeDueDay(dateFrom, DAY_FORMAT.getDateWithSlash)}${humanizeDueDay(dateFrom, DAY_FORMAT.getTime)}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${humanizeDueDay(dateTo, DAY_FORMAT.getDateWithSlash) + humanizeDueDay(dateTo, DAY_FORMAT.getTime)}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
         ${createOfferTemplate(point, offers, type, offersOfPoint)}

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>
            ${createPicturesOfDestinations(pictures)}
          </section>
        </section>
      </form>
    </li>`
  );
}

export default class EditPointView {

  constructor({ points }, { offers }, { destinations }, { point }, { offersOfPoint }, { destinationOfPoint }) {
    this.points = points;
    this.offers = offers;
    this.destinations = destinations;
    this.point = point;
    this.offersOfPoint = offersOfPoint;
    this.destinationOfPoint = destinationOfPoint;
  }

  getTemplate() {
    return createEditPointTemplate(this.points, this.offers, this.destinations, this.point, this.offersOfPoint, this.destinationOfPoint);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
