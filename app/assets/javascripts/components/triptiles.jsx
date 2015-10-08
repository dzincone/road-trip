var React = require('react');
var Modal = require('react-modal');
var NewTripButton = require('./newtripbutton.jsx')
var Slider = require('react-slick');
var TripDashboard = require('./trips.jsx')

var customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

var eventIcons = {
  'restaurant': 'fa fa-cutlery',
  'lodging': 'fa fa-bed',
  'museum': 'fa fa-institution',
  'gas_station': 'fa fa-car',
}


var UserComponent = React.createClass({
  getInitialState: function(){
    return {
      value: "",
      status: 1,
      trip: "",
      destinations: [],
      finished: false,
      lat: 0,
      long: 0,
      posts: "",
      showResults: false,
      toggle: true,
      currentTrip: "",
      }
  },
  componentDidMount: function(){
    $.get('/users/'+ window.location.pathname.split('/')[2]+'/trips', function(results){
      if(this.isMounted()){
        this.setState({
          value: results
        })
      }
    }.bind(this))
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
  },
  oneTrip: function(id){
    this.toggled()
    $.get('/users/'+ window.location.pathname.split('/')[2]+'/trips/' + id + '.json', function(results){
      console.log("here are the results", results);
      $('#startLoc').append(results.start_location)
      $('#endLoc').append(results.end_location)
      $('#waypoints').append(results.destinations.map(function(e){
        return e.name + "/"
      }))
        if(this.isMounted()){
          var events = results.events
          var temp = results.destinations.splice(1, 1)
          results.destinations = results.destinations.concat(temp)
          var destinations = results.destinations.map(function (e) {
            var destEvents = []
            events.forEach(function (event) {
              if (event.destination_id === e.id){
                destEvents.push(event);
              }
            })
            return {name: e.name, destinationid: e.id, events: destEvents, lat: e.lat, lng: e.lng, place_id: e.place_id};
          });
          this.setState({
            currentTrip: results.id,
            trip: results,
            destinations: destinations,
            finished: results.finished
          })
          this.activities()
          initMap()
        }
      }.bind(this))
  },
  oneTripstop: function(id){
      $('#waypoints').empty()
    $.get('/users/'+ window.location.pathname.split('/')[2]+'/trips/' + id + '.json', function(results){
      console.log("here are the results", results);
      $('#waypoints').append(results.destinations.map(function(e){
        return e.name + "/"
      }))
        if(this.isMounted()){
          var events = results.events
          var temp = results.destinations.splice(1, 1)
          results.destinations = results.destinations.concat(temp)
          var destinations = results.destinations.map(function (e) {
            var destEvents = []
            events.forEach(function (event) {
              if (event.destination_id === e.id){
                destEvents.push(event);
              }
            })
            return {name: e.name, destinationid: e.id, events: destEvents, lat: e.lat, lng: e.lng, place_id: e.place_id};
          });
          this.setState({
            currentTrip: results.id,
            trip: results,
            destinations: destinations,
            finished: results.finished
          })
          this.activities()
          initMap()
        }
      }.bind(this))
  },
  getTripInfo: function(){
    $.get('/users/'+ window.location.pathname.split('/')[2]+'/trips/' + this.state.currentTrip + '.json', function(results){
      if(this.isMounted()){
        var events = results.events
        var temp = results.destinations.splice(1, 1)
        results.destinations = results.destinations.concat(temp)
        var destinations = results.destinations.map(function (e) {
          var destEvents = []
          events.forEach(function (event) {
            if (event.destination_id === e.id){
              destEvents.push(event);
            }
          })
          return {name: e.name, destinationid: e.id, events: destEvents, lat: e.lat, lng: e.lng, place_id: e.place_id};
        });
        this.setState({
          trip: results,
          destinations: destinations,
          finished: results.finished
        })
      }
    }.bind(this))
  },
  makeNewTrip: function(){
    var name = $('#createname').val()
    var start_location_city = $('#createstartcity').val()
    var start_location_state = $('#createstartstate').val()
    var end_location_city = $('#createendcity').val()
    var end_location_state = $('#createendstate').val()
    $.post('/users/'+ window.location.pathname.split('/')[2]+'/trips',
    {async: false, 'trip[name]': name, 'trip[start_location_city]': start_location_city, 'trip[start_location_state]': start_location_state, 'trip[end_location_city]': end_location_city, 'trip[end_location_state]': end_location_state, "_method": "post"})
    .done(function(data){
      this.oneTrip(data.id)
    }.bind(this))

  },
  addAStop: function(){
    $.post('/users')
  },
  newBlogPost: function(){
    this.onClick()
    var latitude = $("#bloglatitude").val()
    var longitude = $('#bloglongitude').val()
    var title = $('#blogtitle').val()
    var content = $('#blogcontent').val()
    $.post('/users/'+window.location.pathname.split('/')[2]+'/trips/'+ this.state.currentTrip +'/posts',
      {'post[latitude]': latitude, 'post[longitude]': longitude, 'post[title]': title, 'post[content]': content, "_method": "post"})
      .success(function(data){
      })
      this.blogs()
      this.getTripInfo()
  },
  itinerary: function(){
    this.setState({
      status: 1
    })
  },
  toggled: function(){
    this.state.toggle === true ? this.setState({ toggle: false }) : this.setState({ toggle: true })
    $('#startLoc').empty()
    $('#endLoc').empty()
    $('#waypoints').empty()

  },
  onClick: function() {
    this.state.showResults === true ? this.setState({ showResults: false }) : this.setState({ showResults: true })
  },
  blogs: function(){
    if(!$('#tab-blog').hasClass('active')){
      $('#tab-blog').addClass('active');
    }
    if($('#tab-activity').hasClass('active')){
      $('#tab-activity').removeClass('active')
    }
    navigator.geolocation.getCurrentPosition(function (position) {
      if(this.isMounted()){
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude
        })
      }
    }.bind(this))
    $.get('/users/'+ window.location.pathname.split('/')[2]+'/trips/' + this.state.currentTrip + '/posts', function(data){
        this.setState({
          posts: data,
          status: 2
        })
    }.bind(this))
  },
  activities: function(){
  if(!$('#tab-activity').hasClass('active')){
    $('#tab-activity').addClass('active');
  }
  if($('#tab-blog').hasClass('active')){
    $('#tab-blog').removeClass('active')
  }    navigator.geolocation.getCurrentPosition(function (position) {
      if(this.isMounted()){
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude
        })
      }
    }.bind(this))
    this.setState({
      status: 1
    })
  },
  render: function(){
    return (
      <div>
      {this.state.toggle ? <GetTiles makeNewTrip={this.makeNewTrip} oneTrip={this.oneTrip} toggled={this.toggled} toggle={this.state.toggle} value={this.state.value} trip={this.state.trip} destinations={this.state.destinations}
      finished={this.state.finished} /> :
      <TripDashboard toggled={this.toggled} oneTripstop={this.oneTripstop} currentTrip={this.state.currentTrip} onClick={this.onClick} posts={this.state.posts} newBlogPost={this.newBlogPost}
      lat={this.state.lat} long={this.state.long} showResults={this.state.showResults}
      itinerary={this.itinerary} blogs={this.blogs}
      activities={this.activities} trip={this.state.trip} destinations={this.state.destinations}
      getTripInfo={this.getTripInfo} finished={this.state.finished} status={this.state.status} />}
      </div>
    )
  }
})


var GetTiles = React.createClass({
  render: function () {
    var trips = this.props.value
    var allTrips = []
    for (var i = 0; i < trips.length; i++) {
      allTrips.push(<TripTile oneTrip={this.props.oneTrip} key={trips[i].id} data={trips[i]}/>)
    }
    var settings = {
      dots: true,
      infinite: true,
      speed: 700,
      slidesToShow: 1,
      slidesToScroll: 1,
      initialSlide: 1
    };
    return (
      <div className="small-12 columns">
        <div className="small-12">
          <NewTripButton oneTrip={this.props.oneTrip} makeNewTrip={this.props.makeNewTrip}/>
          <div className="create-title">
          <h1>Choose Your Trip</h1>
          </div>
          <Slider className="trip-tile centered small-centered small-8 columns"{...settings}>
              {allTrips.map(function(trip){
                console.log(trip, "here it is");
                return (<div className="small-centered">{trip}</div>)
              }, this)}
          </Slider>
        </div>
      </div>
    );
  }
})

var TripTile = React.createClass({
  render: function () {
    console.log(this.props.data, "this is the props");
    // {'/users/'+ window.location.pathname.split('/')[2]+'/trips/' + this.props.data.id }
    return (
        <div className="polaroids small-4 small-centered columns" onClick={this.props.oneTrip.bind(null, this.props.data.id)}>
          <input type="hidden" value={this.props.data.id} />
          <div className={this.props.data.finished ? "finished" : undefined}>
              <p className="trip-name">{this.props.data.name}</p>
          </div>
          <div className="trip-contents">
            <p>Start Location: {this.props.data.start_location}</p>
            <p>End Location: {this.props.data.end_location}</p>
          </div>
        </div>
    )
  }
})

module.exports = UserComponent
