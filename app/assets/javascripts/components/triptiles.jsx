var React = require('react');
var NewTripButton = require('./newtripbutton.jsx')
var Slider = require('react-slick');
var TripDashboard = require('./trips.jsx')

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
      toggle: true}
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
    $.get('/users/'+ window.location.pathname.split('/')[2]+'/trips/' + window.location.pathname.split('/')[4] + '.json', function(results){
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
  getTripInfo: function(){
    $.get('/users/'+ window.location.pathname.split('/')[2]+'/trips/' + window.location.pathname.split('/')[4] + '.json', function(results){
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
  newBlogPost: function(){
    this.onClick()
    var latitude = $("#bloglatitude").val()
    var longitude = $('#bloglongitude').val()
    var title = $('#blogtitle').val()
    var content = $('#blogcontent').val()
    $.post('/users/'+window.location.pathname.split('/')[2]+'/trips/'+window.location.pathname.split('/')[4]+'/posts',
      {'post[latitude]': latitude, 'post[longitude]': longitude, 'post[title]': title, 'post[content]': content, "_method": "post"})
      .done(function(data){
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

  },
  onClick: function() {
    this.state.showResults === true ? this.setState({ showResults: false }) : this.setState({ showResults: true })
  },
  blogs: function(){
    navigator.geolocation.getCurrentPosition(function (position) {
      if(this.isMounted()){
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude
        })
      }
    }.bind(this))
    $.get('/users/'+ window.location.pathname.split('/')[2]+'/trips/' + window.location.pathname.split('/')[4] + '/posts', function(data){
        this.setState({
          posts: data,
          status: 2
        })
    }.bind(this))
  },
  activities: function(){
    navigator.geolocation.getCurrentPosition(function (position) {
      if(this.isMounted()){
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude
        })
      }
    }.bind(this))
    this.setState({
      status: 3
    })
  },
  render: function(){
    return (
      <div>
      {this.state.toggle ? <GetTiles toggled={this.toggled} toggle={this.state.toggle} value={this.state.value} /> :
      <TripDashboard toggled={this.toggled} toggle={this.state.toggle}
      onClick={this.onClick} posts={this.state.posts} newBlogPost={this.newBlogPost}
      lat={this.state.lat} long={this.state.long} showresults={this.state.showresults}
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
      allTrips.push(<TripTile toggled={this.props.toggled} toggle={this.props.toggle} key={trips[i].id} data={trips[i]}/>)
    }
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 2,
      initialSlide: 1
    };
    return (
      <div>
        <NewTripButton />
            <Slider className="trip-tile small-10 columns"{...settings}>
              {allTrips}
            </Slider>
      </div>
    );
  }
})

var TripTile = React.createClass({
  render: function () {
    // {'/users/'+ window.location.pathname.split('/')[2]+'/trips/' + this.props.data.id }
    return (
        <div className="polaroids small-3 columns">
          <div className={this.props.data.finished ? "finished" : undefined}>
            <a onClick={this.props.toggled} href="#">
              <img src="http://www.usnews.com/dims4/USNEWS/e4ce14a/2147483647/resize/652x%3E/quality/85/?url=%2Fcmsmedia%2F2e%2Fc1%2F90572c4e46c997c90ff60b17be58%2F140624-summerroadtrip-stock.jpg" alt=""></img>
              <p className="trip-name">{this.props.data.name}</p>
            </a>
              <p className="trip-name">{this.props.data.finished ? "(finished)" : null}</p>
          </div>
        </div>
    )
  }
})

module.exports = UserComponent
