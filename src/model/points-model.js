import { offers } from '../mocks/offers';
import { destinations } from '../mocks/destinations';
import {points} from '../mocks/points';

export default class PointsModel {

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
}
