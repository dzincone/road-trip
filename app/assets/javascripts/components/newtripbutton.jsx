var Modal = require('react-modal');

var customStyles = {
  content : {
    width: '50%',
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

var NewTripButton = React.createClass({
	getInitialState: function() {
    return { modalIsOpen: false };
  },

  openModal: function() {
    this.setState({modalIsOpen: true});
  },

  closeModal: function() {
    this.setState({modalIsOpen: false});
  },
  makeNewAndClose: function(){
    this.props.makeNewTrip()
    this.closeModal()
  },
  render: function() {
    return (
      <div className="new-trip">
        <button onClick={this.openModal}><i className="fa fa-plus"></i> Create New Trip!</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles} >
            <div className="new-trip-modal">
            <h1>New Trip</h1>
            </div>
            <div className="row">
              <div className="small-12 columns">
                <input id="createname" type="text" name="trip[name]" placeholder="Trip Name" />
              </div>
              <div className="small-8 columns">
                <input id="createstartcity" type="text" name="trip[start_location_city]" placeholder="Starting City" />
              </div>
              <div className="small-4 columns">
                <input id="createstartstate" type="text" name="trip[start_location_state]" placeholder="Starting State" />
              </div>
              <div className="small-8 columns">
                <input id="createendcity" type="text" name="trip[end_location_city]" placeholder="Ending City" />
              </div>
              <div className="small-4 columns">
                <input id="createendstate" type="text" name="trip[end_location_state]" placeholder="Ending City" />
              </div>
              <div className="small-12 columns">
                <button className="tiny" onClick={this.makeNewAndClose} type="button">Create Trip</button>
              </div>
            </div>
        </Modal>
      </div>
    );
  }
});

module.exports = NewTripButton
