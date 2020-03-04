import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AddBookmark from './AddBookmark/AddBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import EditBookmark from './EditBookmark/EditBookmark';
import Context from './context';
import Nav from './Nav/Nav';
import config from './config';
import './App.css';

class App extends Component {
  state = {
    bookmarks: [],
    error: null,
  };

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
      page: 'list',
    })
  }

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [ ...this.state.bookmarks, bookmark ],
    })
  }

  deleteBookmark = bookmarkId => {
    let newBookmarks = this.state.bookmarks.filter(b => b.id == !bookmarkId)
    this.setState({
      bookmarks: newBookmarks
    })
  }

  editBookmark = bookmark => {
    this.setState({
      bookmarks: this.state.bookmarks.map(b =>
        (b.id !== bookmark.id) ? b : bookmark)
    })
  }

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }))
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark,
      editBookmark: this.editBookmark
    }

    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <Context.Provider value = {contextValue}>
          <Nav />
          <div className='content' aria-live='polite'>
            <Route exact path='/' component={BookmarkList} />
            <Route path='/add-bookmark' component={AddBookmark} />
            <Route path='/edit/:bookmarkId' component={EditBookmark} />
          </div>
        </Context.Provider>
      </main>
    );
  }
}

export default App;
