import Observable from '../framework/observable';
import { UpdateType } from '../const';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #offersApiService = null;
  #destinationsApiService = null;

  #points = [];
  #offers = [];
  #destinations = [];

  constructor({ pointsApiService, offersApiService, destinationsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#offersApiService = offersApiService;
    this.#destinationsApiService = destinationsApiService;

  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }


  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#apdatedPointToClient);

      this.#offers = await this.#offersApiService.offers;

      this.#destinations = await this.#destinationsApiService.destinations;

    } catch (err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
    }
    this._notify(UpdateType.INIT);

  }

  #apdatedPointToClient(point) {
    const apdatedPoint = {
      ...point,
      'basePrice': point['base_price'],
      'dateTo': point['date_to'],
      'dateFrom': point['date_from'],
      'isFavorite': point['is_favorite'],
    };

    delete apdatedPoint.base_price;
    delete apdatedPoint.date_to;
    delete apdatedPoint.date_from;
    delete apdatedPoint.is_favorite;

    return apdatedPoint;
  }


  async updatePoint(updateType, update) {

    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }
    try {
      const updatePoint = await this.#pointsApiService.updatePoints(update);
      const apdatedPoint = this.#apdatedPointToClient(updatePoint);

      this.#points = [
        ...this.#points.slice(0, index),
        apdatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, update);

    } catch (err) {
      throw new Error(err);
    }
  }


  async addPoint(updateType, update) {

    try {
      const newPoint = await this.#pointsApiService.postedPoint(update);
      const adobtedPoint = this.#apdatedPointToClient(newPoint);

      this.#points = [
        adobtedPoint,
        ...this.#points,
      ];

      this._notify(updateType, update);

    } catch (err) {
      throw new Error(err);
    }

  }


  async deletePoint(updateType, update) {

    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    try {
      await this.#pointsApiService.deletePoint(update);

      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
    } catch (err) {
      throw new Error(err);

    }

    this._notify(updateType);

  }
}


