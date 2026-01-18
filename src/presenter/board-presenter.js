import { remove, render, RenderPosition } from '../framework/render.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import SortView from '../view/sort-view';
import PointPresenter from './point-presenter.js';
import { sortDayOfPointUp, sortPriceDown } from '../utils/utils.js';
import { SortType, UpdateType, UserAction } from '../const.js';
import NoPointsView from '../view/no-point-view.js';

export default class BoardPresenter {
  #pointsModel = null;
  #boardContainer = null;

  #sortComponent = null;
  #tripPointsList = new TripPointsListView();

  #noPointsComponent = null;
  #boardOffers = null;
  #boardDestinations = [];

  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor({ boardContainer }, pointsModel) {
    this.#pointsModel = pointsModel;
    this.#boardContainer = boardContainer;
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortDayOfPointUp);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortPriceDown);
    }
    return this.#pointsModel.points;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  init() {
    this.#boardDestinations = [...this.#pointsModel.destinations];
    this.#boardOffers = [...this.#pointsModel.offers];
    this.#renderBoard();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    remove(this.#sortComponent);
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }


  #renderBoard() {

    if (this.points.length === 0) {
      this.#renderNoPoint();
      return;
    }

    if (this.points.length > 0) {
      render(this.#tripPointsList, this.#boardContainer);

      this.#renderSort();

      this.#renderPoints();
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripPointsList.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point, this.#boardOffers, this.#boardDestinations, this.points);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderNoPoint() {
    this.#noPointsComponent = new NoPointsView();
    render(this.#noPointsComponent, this.#boardContainer.element);
  }

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #handleViewAction = (actionType, updateType, update) => {


    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }

  };


  #handleModelEvent = (updateType, data) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());

  };

  #clearBoard({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noPointsComponent);

    if(resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }
}
