import { render } from '../framework/render.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import SortView from '../view/sort-view';
import TripPresenter from './trip-presenter.js';
import { updateItem } from '../utils/utils.js';

export default class BoardPresenter {
  #pointsModel = null;
  #boardContainer = null;

  #tripPointsList = new TripPointsListView();

  #boardPoints = [];
  #noPointsComponent = null;
  #boardOffers = null;
  #boardDestinations = [];

  #tripPresenter = new Map();

  constructor({ boardContainer }, pointsModel) {
    this.#pointsModel = pointsModel;
    this.#boardContainer = boardContainer;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#boardDestinations = [...this.#pointsModel.destinations];
    this.#boardOffers = [...this.#pointsModel.offers];

    this.#renderBoard();
  }


  #renderBoard() {
    if (this.#boardPoints.length > 0) {
      render(new SortView(), this.#boardContainer);
      render(this.#tripPointsList, this.#boardContainer);

      this.#renderPoints();
    }
  }

  #renderPoint(point) {
    const tripPresenter = new TripPresenter({
      pointListContainer: this.#tripPointsList.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    tripPresenter.init(point, this.#boardOffers,this.#boardDestinations, this.#boardPoints);

    this.#tripPresenter.set(point.id, tripPresenter);
  }

  renderNoPoint() {
    render(this.#noPointsComponent, this.#boardContainer.element);
  }

  #renderPoints() {
    this.#boardPoints.forEach((point) => this.#renderPoint(point));
  }

  #clearTripPresenters() {
    this.#tripPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPresenter.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#tripPresenter.get(updatedPoint.id).init(updatedPoint, this.#boardOffers,this.#boardDestinations, this.#boardPoints);
  };

  #handleModeChange = () => {
    this.#tripPresenter.forEach((presenter) => presenter.resetView());

  };
}
