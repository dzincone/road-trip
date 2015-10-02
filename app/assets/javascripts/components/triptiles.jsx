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
      toggle: true,
      currentTrip: ""}
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
          this.blogs()
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
  newBlogPost: function(){
    this.onClick()
    var latitude = $("#bloglatitude").val()
    var longitude = $('#bloglongitude').val()
    var title = $('#blogtitle').val()
    var content = $('#blogcontent').val()
    $.post('/users/'+window.location.pathname.split('/')[2]+'/trips/'+ this.state.currentTrip +'/posts',
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
      status: 3
    })
  },
  render: function(){
    return (
      <div>
      {this.state.toggle ? <GetTiles oneTrip={this.oneTrip} toggled={this.toggled} toggle={this.state.toggle} value={this.state.value} trip={this.state.trip} destinations={this.state.destinations}
      finished={this.state.finished} /> :
      <TripDashboard currentTrip={this.state.currentTrip} onClick={this.onClick} posts={this.state.posts} newBlogPost={this.newBlogPost}
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
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 1,
      initialSlide: 1
    };
    return (
      <div className="small-12 columns">
        <NewTripButton />
            <Slider className="trip-tile centered small-centered small-11 columns"{...settings}>
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
          <input type="hidden" value={this.props.data.id} />
          <div className={this.props.data.finished ? "finished" : undefined}>
            <a onClick={this.props.oneTrip.bind(null, this.props.data.id)} href="#">
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
