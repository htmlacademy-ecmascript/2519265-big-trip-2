import { render } from '../render';

import BoardView from '../view/board-view';
import TripPointsListView from '../view/trip-points-list-view.js';
import SortView from '../view/sort-view';
import FormNewTripView from '../view/form-new-trip-view.js';
import EditPointView from '../view/edit-point-view.js';
import TripPointView from '../view/trip-point-view.js';


export default class BoardPresenter {
  boardComponent = new BoardView();
  tripPointsList = new TripPointsListView();

  constructor({ boardContainer }) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(this.boardComponent, this.boardContainer);
    render(new SortView, this.boardComponent.getElement());
    render(new FormNewTripView, this.boardComponent.getElement());
    render(new EditPointView, this.boardComponent.getElement());
    render(new TripPointsListView, this.boardComponent.getElement());

    for(let i = 0; i < 3; i++) {
      render(new TripPointView, this.boardComponent.getElement());
    }
  }
}
