import { getRandomPoint } from '../mocks/points';
import { offers } from '../mocks/offers';
import { destinations } from '../mocks/destinations';


const POINT_COUNT = 5;

export default class PointsModel {

  points = Array.from({length:POINT_COUNT}, getRandomPoint);
  offers = offers.slice();
  destinations = destinations.slice();


  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffersByType(type) {
    return this.offers.find((item) => type === item.type);
  }

  getDestinationById(id) {
    return this.destinations.find((item) => id === item.id);
  }
}
