import React, {useState, useEffect} from 'react';
import firebase from "./firebase";
import './App.css'

function useItems() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        firebase
            .firestore()
            .collection('medicines_vladislav')
            .onSnapshot((snapshot) => {
                const newItems = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setItems(newItems)
            })
    }, []);

    return items
}

function deleteItem(id) {
    firebase.firestore().collection("medicines_vladislav").doc(id).delete();
}

const MedicineList = (props) => {
    const {formEdit} = props;

    const items = useItems();

    return (
        <div className="list">
            <div className="list-preview">
                <div className="list-preview__title">
                    Code
                </div>
                <div className="list-preview__title">
                    Name
                </div>
                <div className="list-preview__title">
                    Price
                </div>
            </div>
            {!items.length && <div>Empty</div>}
            {items.map((item) =>
                <div key={item.id} className="item">
                    <div className="item__info">
                        <div className="item__col">
                            {item.code}
                        </div>
                        <div className="item__col">
                            {item.name}
                        </div>
                        <div className="item__col">
                            {item.price}
                        </div>
                    </div>
                    <div className="item__interaction">
                        <button onClick={formEdit.bind(this, item.id)}
                                className="btn btn__edit">Edit</button>
                        <button onClick={deleteItem.bind(this, item.id)} className="btn btn__delete">Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicineList;
