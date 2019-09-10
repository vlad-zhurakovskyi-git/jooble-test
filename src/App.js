import React, { Component } from 'react';
import MedicineList from './MedicineList';
import firebase from "./firebase";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      addCode: '',
      addName: '',
      addPrice: '',
      changeCode: '',
      changeName: '',
      changePrice: '',
      data: null,
      formAdd: false,
      formEdit: false,
      session: false,
      itemId: null
    };

    this.formEdit = this.formEdit.bind(this);
    this.editItem = this.editItem.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      user && this.setState({
        session: true
      });
    });
  }

  signin() {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then().catch(function(error) {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  }

  signout() {
    firebase.auth().signOut().then(function() {
      window.location.reload();
      console.log('signout')

    }).catch(function(error) {
      console.log(error)
    })
  }

  formAdd() {
    this.setState({
      formAdd: !this.state.formAdd
    });
  }

  handleChangeLogin(type, event) {
    type === 'email' && this.setState({email: event.target.value});
    type === 'password' && this.setState({password: event.target.value});
  }

  handleChangeCreate(type, event) {
    type === 'code' && this.setState({addCode: event.target.value});
    type === 'name' && this.setState({addName: event.target.value});
    type === 'price' && this.setState({addPrice: event.target.value});
  }

  addItem() {
    const {addCode, addName, addPrice} = this.state;

    firebase.firestore().collection('medicines_vladislav').add({
      code: addCode,
      name: addName,
      price: `${addPrice}$`
    })
  }

  formEdit(id) {
    this.setState({
      formEdit: !this.state.formEdit,
      itemId: id
    });
  }

  editItem() {
    const {changeCode, changeName, changePrice, itemId} = this.state;
      console.log(itemId);

      firebase.firestore().collection("medicines_vladislav").doc(itemId).update({
      code: changeCode,
      name: changeName,
      price: `${changePrice}$`
    });
  }

  handleChangeEdit(type, event) {
    type === 'code' && this.setState({changeCode: event.target.value});
    type === 'name' && this.setState({changeName: event.target.value});
    type === 'price' && this.setState({changePrice: event.target.value});
  }

  render() {
    const { formAdd,
            formEdit,
            email,
            password,
            addCode,
            addName,
            addPrice,
            changeCode,
            changeName,
            changePrice,
            session } = this.state;

    return (
        <div className="app">
          {!session && <div className="form form_login">
            <div className="form__container">
              <input type="email" value={email} onChange={this.handleChangeLogin.bind(this, 'email')}/>
              <input type="password" value={password} onChange={this.handleChangeLogin.bind(this, 'password')}/>
              <button onClick={this.signin.bind(this)}>Signin</button>
            </div>
          </div>}

          {session && <button className="btm btn_signout" type="button" onClick={this.signout.bind(this)}>Signout</button>}

          {session && <MedicineList formEdit={this.formEdit} changeCode={changeCode} changeName={changeName} changePrice={changePrice} />}

          {session && <button onClick={this.formAdd.bind(this)} className="add" type="button">+</button>}

          {formAdd && <div className="form form_add">
            <input onChange={this.handleChangeCreate.bind(this, 'code')} value={addCode} placeholder="Code" type="number"/>
            <input onChange={this.handleChangeCreate.bind(this, 'name')} value={addName} placeholder="Name" type="text"/>
            <input onChange={this.handleChangeCreate.bind(this, 'price')} value={addPrice} placeholder="Price" type="text"/>

            <button onClick={this.addItem.bind(this)}>Add new item</button>
          </div>}

          {formEdit && <div className="form form_edit">
            <input onChange={this.handleChangeEdit.bind(this, 'code')} value={changeCode} placeholder="Code" type="number"/>
            <input onChange={this.handleChangeEdit.bind(this, 'name')} value={changeName} placeholder="Name" type="text"/>
            <input onChange={this.handleChangeEdit.bind(this, 'price')} value={changePrice} placeholder="Price" type="text"/>

            <button onClick={this.editItem}>Edit item</button>
          </div>}
        </div>
    );
  }
}

export default App;
