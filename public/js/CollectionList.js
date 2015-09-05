//CollectionList 
var React = require('react'),
  ajax = require('jquery').ajax,
  CollectionBox = require('./CollectionBox'),
  AddCollectionForm = require('./AddCollectionForm');

import {RouteHandler} from 'react-router';

export default React.createClass({
  getInitialState() {
    return {cols: [], colFormVis: false};
  },
  componentDidMount() {
    ajax({
      url: '/api/collections',
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({cols:data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
  },
  handleSubmit(newCol) {
    ajax({
      url: '/api/collection',
      dataType: 'json',
      type: 'PUT',
      data: {newId: newCol.id, title: newCol.title},
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
    var newCols = this.state.cols.concat([newCol]);
    this.setState({cols: newCols});
  },
  handleUpdate(index){
    var id = this.state.cols[index].id;
    ajax({
      url: '/api/collection',
      dataType: 'json',
      type: 'POST',
      data: {id: id},
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
    var newCols = this.state.cols;
    newCols.splice(index, 1);
    this.setState({cols: newCols});
  },
  handleDelete(index){
    if(!confirm('Are you sure you want to delete "'+this.state.cols[index].title+'"?')){
      return;
    }
    var id = this.state.cols[index].id;
    ajax({
      url: '/api/collection',
      dataType: 'json',
      type: 'DELETE',
      data: {id: id},
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
    var newCols = this.state.cols;
    newCols.splice(index, 1);
    this.setState({cols: newCols});
  },
  toggleForm() {
    this.setState({colFormVis: !this.state.colFormVis});
  },
  render() {
    return (
      <section id="collectionList">
        <RouteHandler/>
        <h1>Collections</h1>
        <CollectionBox links={this.state.cols} deleteItem={this.handleDelete} />
        { this.state.colFormVis ? <AddCollectionForm onLinkSubmit={this.handleSubmit} toggler={this.toggleForm} /> : null }
        { !this.state.colFormVis ? <button onClick={this.toggleForm}>+</button> : null }
      </section>
    );
  }
});