var React = require('react');
var GasInfo = require('./gas')

var SettingsButtons = React.createClass({
  getInitialState: function() {
    return { showResults: true,
              name: "",
              hometown_city: "",
              hometown_state: "",
              favoriteloc: "",
              trips: "",
              miles: "",
              lat: "",
              long: ""};
  },
  componentDidMount: function(){
    $.get('/users/'+ window.location.pathname.split('/')[2]+'/trips', function(results){
      if(this.isMounted()){
        var finishedTrips = results.filter(function (trip) {
          return trip.finished
        })
        this.setState({
          trips: finishedTrips.length
        })
      }
    }.bind(this));
    $.get('/users/' + window.location.pathname.split('/')[2] + '.json', function(results){
      console.log(results);
        if(this.isMounted()){
          if(results.name){
          var name = results.name.charAt(0).toUpperCase() + results.name.substring(1).toLowerCase()
          }
          var hometown_city = results.hometown_city
          var hometown_state = results.hometown_state
          var favoriteloc = results.favorite_place
          var miles = results.total_miles
          this.setState({
            name: name,
            hometown_city: hometown_city,
            hometown_state: hometown_state,
            favoriteloc: favoriteloc,
            miles: miles
          })
        }
      }.bind(this))
  },
  getGasInfo: function (lat, long) {
    $.get('/gas_info?lat='+lat+'&lng='+long, function(results){
      if(this.isMounted()){
        var distance = results
        this.setState({
          gasDistance: distance
        })
      }
    }.bind(this))
  },
  toggleForm: function() {
    this.state.showResults === true ? this.setState({ showResults: false }) : this.setState({ showResults: true })
  },
  doStuff: function () {
    if ($("#editName").val() === ""){
      var name = this.state.name
    } else {
      var name = $("#editName").val()
    }
    if ($('#editHometown_city').val() === "") {
      var hometown_city = this.state.hometown_city
    } else {
      var hometown_city = $('#editHometown_city').val()
    }
    if($('#editHometown_state').val() === "") {
      var hometown_state = this.state.hometown_state
    } else {
      var hometown_state = $('#editHometown_state').val()
    }
    $.post('/users/' + window.location.pathname.split('/')[2], {'user[name]': name, 'user[hometown_city]': hometown_city, 'user[hometown_state]': hometown_state, "_method": "patch"})
      .done(function (data) {
      })
      this.componentDidMount()
      this.setState({ showResults: true})
  },
  render: function() {
    return (
      <div className="small-12 columns">
        <div className="profile-settings small-6 columns">
          {this.state.showResults ? <ProfileInfo toggle={this.toggleForm} miles={this.state.miles} name={ this.state.name} hometown_city= {this.state.hometown_city} hometown_state= {this.state.hometown_state} trips= {this.state.trips} /> :
          <EditProfileInfo onClick={this.doStuff} toggle={this.toggleForm} name={ this.state.name} hometown_city= {this.state.hometown_city} hometown_state= {this.state.hometown_state} trips= {this.state.trips} /> }
        </div>
        <div className="find-now small-6 columns">
          <GasInfo />
        </div>

      </div>
    )
  }
});

var ProfileInfo = React.createClass({
  render: function () {
    console.log(this.props.miles);
    return (
      <div className="profile-info small-12 columns">

          <div className="profile-pic small-3 columns">
          </div>
          <div className="small-9 columns">
            <div className="profile-content small-8 columns">
              <h2>Hello, {this.props.name ? this.props.name : "roadtripper"}!</h2>
              <p> Miles Traveled&#58; {this.props.miles} </p>
              <p> Trips Taken&#58; {this.props.trips} </p>
              <p> Hometown&#58; {this.props.hometown_city ? this.props.hometown_city : "Somewhere"}, {this.props.hometown_state ? this.props.hometown_state : "USA"}</p>
            </div>
            <div className="profile-gear small-2 columns end">
              <a href="#"><i fid="edit-intro" className='fi-widget edit-profile' onClick={this.props.toggle}></i></a>
            </div>
          </div>
      </div>
    )
  }
})
var EditProfileInfo = React.createClass({
  render: function () {
    return (
      <div className="profile-info small-6 columns">
        <div className="profile-pic-edit small-3 columns">
          <a href="#" className="camera"><i className="fi-camera"></i>
            <p>Upload</p>
          </a>
        </div>
        <div className="small-6 columns">
          <div className="profile-content small-12 columns">
            <div className="row">
              <div className="large-12 small-centered columns">
                <div className="row collapse">
                  <div className="small-3 columns">
                    <span href="#" className="prefix">Name</span>
                  </div>
                  <div className="small-9 columns">
                    <input  id='editName' type="text" placeholder={this.props.name} name="user[name]"/>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="large-12 small-centered columns">
                <div className="row collapse">
                  <div className="small-12 columns">
                    <span href="#" className="prefix">Hometown</span>
                  </div>
                  <div className="small-7 columns">
                    <input  id='editHometown_city' type="text" placeholder={this.props.hometown_city} name="user[hometown]"/>
                  </div>
                  <div className="small-5 columns">
                    <input  id='editHometown_state' type="text" placeholder={this.props.hometown_state} name="user[hometown]"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-options">
          <div className="profile-back">
          <a href="#" onClick={this.props.toggle}>Back</a>
          </div>
          <div>
            <input type='hidden' name='_method' value='patch'/>
            <button className='button small' id='editProfileButton' value='Update Profile' onClick={this.props.onClick}>Update Profile</button>
            </div>
              <div className="row">
                <a href={'/users/' + window.location.pathname.split('/')[2]} data-method='delete' rel='nofollow' className="delete">Delete Account</a>
              </div>
        </div>
      </div>

    )
  }
})


module.exports = SettingsButtons
