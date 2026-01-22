import { offers } from '../mocks/offers';
import { destinations } from '../mocks/destinations';
import { points } from '../mocks/points';
import Observable from '../framework/observable';

export default class PointsModel extends Observable {

  #points = points;
  #offers = offers.slice();
  #destinations = destinations.slice();


  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  updatePoint(updateType, update) {

    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }


  addPoint(updateType, update) {

    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }


  deletePoint(updateType, update) {

    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);

  }
}


