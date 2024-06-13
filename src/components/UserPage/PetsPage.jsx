import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
function PetsPage() {
   const pets = useSelector((store) => store.pets);
   const [newPet, setNewPet] = useState('');
   const dispatch = useDispatch();

   const handleSubmit = (e) => {
      e.preventDefault();
      dispatch({ type: 'ADD_PET', payload: { name: newPet } });
      setNewPet('');
   }

   useEffect(() => {
      dispatch({type: 'FETCH_PETS'})
   }, []);

   return (
      <div className="container">
         <h2>My Pets</h2>
         <form onSubmit={handleSubmit}>
            <input onChange={e => setNewPet(e.target.value)} value={newPet} />
            <button>Add Pet</button>
         </form>
         <ul>
            {pets.map((pet, i) => <li key={i}>{pet.name}</li>)}
         </ul>
      </div>
   );
}

export default PetsPage;
