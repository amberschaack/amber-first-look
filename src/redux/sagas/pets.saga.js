import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchPets(action) {
  try {
    const response = yield axios.get('/api/pets');
    yield put({ type: 'SET_PETS', payload: response.data });
  } catch (error) {
    console.error(`Error getting pets`);
  }
}

function* addPet(action) {
   try {
      yield axios.post('/api/pets', action.payload);
      yield put({type: 'FETCH_PETS'})
   }  catch (error) {
      console.error(`Error adding new pet`);
    }
}

function* petsSaga() {
  yield takeLatest('FETCH_PETS', fetchPets);
  yield takeLatest('ADD_PET', addPet);
}

export default petsSaga;
