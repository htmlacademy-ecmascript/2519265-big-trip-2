import { remove, render, RenderPosition } from '../framework/render.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import SortView from '../view/sort-view';
import TripPresenter from './trip-presenter.js';
import { sortDayOfPointUp, sortPriceDown, updateItem } from '../utils/utils.js';
import { SortType } from '../const.js';
import NoPointsView from '../view/no-point-view.js';

export default class BoardPresenter {
  #pointsModel = null;
  #boardContainer = null;

  #sortComponent = null;
  #tripPointsList = new TripPointsListView();

  #boardPoints = [];
  #noPointsComponent = null;
  #boardOffers = null;
  #boardDestinations = [];

  #tripPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sourcedBoardPoints = [];

  constructor({ boardContainer }, pointsModel) {
    this.#pointsModel = pointsModel;
    this.#boardContainer = boardContainer;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#boardDestinations = [...this.#pointsModel.destinations];
    this.#boardOffers = [...this.#pointsModel.offers];
    this.#sourcedBoardPoints = [...this.#pointsModel.points];

    this.#renderBoard();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearTripPresenters();
    this.#renderPoints();
  };

  #renderSort() {
    remove(this.#sortComponent);
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }


  #renderBoard() {

    if (this.#boardPoints.length > 0) {
      render(this.#tripPointsList, this.#boardContainer);

      if (this.#boardPoints.length === 0) {
        this.#renderNoPoint();
        return;
      }

      this.#renderSort();

      this.#renderPoints();
    }
  }

  #renderPoint(point) {
    const tripPresenter = new TripPresenter({
      pointListContainer: this.#tripPointsList.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    tripPresenter.init(point, this.#boardOffers, this.#boardDestinations, this.#boardPoints);

    this.#tripPresenter.set(point.id, tripPresenter);
  }

  #renderNoPoint() {
    this.#noPointsComponent = new NoPointsView();
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
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#tripPresenter.get(updatedPoint.id).init(updatedPoint, this.#boardOffers, this.#boardDestinations, this.#boardPoints);
  };

  #handleModeChange = () => {
    this.#tripPresenter.forEach((presenter) => presenter.resetView());

  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#boardPoints.sort(sortDayOfPointUp);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortPriceDown);
        break;
      default:
        this.#boardPoints = [...this.#sourcedBoardPoints];
    }
    this.#currentSortType = sortType;
  }

}
