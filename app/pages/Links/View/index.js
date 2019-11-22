// LinkList
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Dropdown from '../../Dropdown';
import LinksBox from './LinkBox';
import get from '../../../utils/get';
import setTitle from '../../../utils/setTitle';
import { jsonToMarkdown } from '../../../utils/exporter';

import * as Actions from '../../../redux/actions/collections';

class ViewLinks extends React.Component {
  componentDidMount() {
    if (!Object.keys(this.props.collection).length) {
      this.props.getCollection(this.props.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!get(this.props, 'collection.name.length')
        || this.props.collection.postId !== nextProps.params.id) {
      this.props.getCollection(nextProps.params.id);
    }
    if (nextProps.collection.name) {
      setTitle(`${nextProps.collection.name}`);
    }
  }

  forkList() {
    if (this.props.user) {
      this.props.forkCollection(this.props.collection._id, this.props.user);
    } else {
      this.context.router.push('/login');
    }
  }

  editList() {
    this.context.router.push(`/${this.props.user.username}/${this.props.params.id}/edit`);
  }

  downloadMarkdownList() {
    const newFileContent = new Blob([jsonToMarkdown(this.props.collection)], {
      type: 'text/plain',
    });
    const downloadURL = window.URL.createObjectURL(newFileContent);
    const downloadLink = document.getElementById('download-link');

    downloadLink.href = downloadURL;
    downloadLink.download = `${this.props.collection.name}.md`;
    downloadLink.click();
    console.log('download?');
    // Free memory
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadURL);
    }, 1000);
  }

  deleteList() {
    if (!confirm(`Are you sure you want to delete this collection:\n"${this.props.collection.name}"?`)) {
      return;
    }
    this.props.deleteCollection(this.props.collection._id,
      `/${this.props.user.username}/collections`);
  }

  render() {
    const user = get(this.props, 'user');
    const { name, forkOf, owner } = this.props.collection;
    const isOwner = user && user._id === get(this.props, 'collection.owner._id');

    let sub = null;
    if (forkOf) {
      sub = (
        <small>
          by
          <Link to={`/${owner.username}/collections`}>{ owner.username }</Link>
          &nbsp;- fork of:
          <Link to={`/list/${forkOf.postId}/view`}>
            {forkOf.owner.username}
            /
            {forkOf.name}
          </Link>
        </small>
      );
    } else if (owner) {
      sub = (
        <small>
          by
          <Link to={`/${owner.username}/collections`}>{ owner.username }</Link>
        </small>
      );
    }

    return (
      <section id="linkList">
        <div className="linkListHeader">
          <div className="linkListTitle">
            <h1>{name}</h1>
            { sub }
          </div>
          <Dropdown buttonText="#">
            <ul className="dropdown-list">
              {/* <li onClick={() => {console.log('star, wayyy unimplemented');}}>Star List</li> */}
              <li>
                <button type="button" onClick={this.forkList}>
                  Fork List
                </button>
              </li>
              { isOwner
                ? (
                  <li>
                    <button type="button" onClick={this.editList}>
                      Edit List
                    </button>
                  </li>
                )
                : null}
              { isOwner
                ? (
                  <li>
                    <button type="button" onClick={this.deleteList}>
                      Delete list
                    </button>
                  </li>
                )
                : null}
              { isOwner
                ? (
                  <li>
                    <button type="button" onClick={this.downloadMarkdownList}>
                      List to Markdown
                    </button>
                  </li>
                )
                : null}
            </ul>
          </Dropdown>
        </div>
        <LinksBox links={this.props.collection.links} />
      </section>
    );
  }
}

ViewLinks.propTypes = {
  collection: PropTypes.object,
  user: PropTypes.object,
  getCollection: PropTypes.func,
  forkCollection: PropTypes.func,
  deleteCollection: PropTypes.func,
  params: PropTypes.object
};

export default connect(
  (state, props) => {
    let collection = {};
    if (state.collections.map[props.params.id]) {
      collection = state.collections.map[props.params.id];
    }
    return {
      collection,
      user: state.auth.user
    };
  },
  (dispatch) => ({
    getCollection: (id) => dispatch(Actions.getCollection(id)),
    forkCollection: (id, user) => dispatch(Actions.forkCollection(id, user)),
    deleteCollection: (id, loc) => dispatch(Actions.deleteCollection(id, loc))
  })
)(ViewLinks);
