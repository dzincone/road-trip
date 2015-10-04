var Modal = require('react-modal');

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

var TripDashboard = React.createClass({
  render: function(){
    return(
      <div className="tabs-profile small-12 columns">

        <div className="small-8 columns">
          <ul className="tabs" data-tab>
            <div className="small-5 itin columns">
              <li className="tab-title small-12 active"><a href="#">Itinerary</a></li>
            </div>
            <div className="small-7 columns">
              <li className="tab-title small-6"><a href="#panel2" id="tab-activity" onClick={this.props.activities}>Activities</a></li>
              <li className="tab-title small-6"><a href="#panel3" id="tab-blog" onClick={this.props.blogs}>Blog</a></li>
            </div>
          </ul>
          <div className="tab-content small-12 columns">
              <div className="itinerary small-5 columns">
                <Itinerary toggled={this.props.toggled} currentTrip={this.props.currentTrip} finished={this.props.finished} updateTrip={this.props.getTripInfo} trip={this.props.trip} destinations={this.props.destinations}/>
              </div>
              <div className="trip-options small-7 columns">
                {this.props.status === 2 ? <BlogCarousel showResults={this.props.showResults} onClick={this.props.onClick} lat={this.props.lat} long={this.props.long} posts={this.props.posts} newBlogPost={this.props.newBlogPost}/> :
                 <Activities currentTrip={this.props.currentTrip} lat={this.props.lat} long={this.props.long} finished={this.props.finished} updateTrip={this.props.getTripInfo} trip={this.props.trip} destinations={this.props.destinations} />
                   }
              </div>
           </div>
          </div>
          <div id="map" className="map small-4 columns">

          </div>
      </div>
    )
  }

})

var NewBlogPost = React.createClass({
  render: function () {
    return (
      <div>
      <input id="bloglatitude" type="hidden" name='post[latitude]' value={this.props.lat}/>
      <input id="bloglongitude" type="hidden" name='post[longitude]' value={this.props.long}/>
      <input id="blogtitle" type="text" name='post[title]' placeholder="Title"/>
      <textarea id="blogcontent" cols="20" name='post[content]' rows="10" placeholder="What did you do today?"></textarea>
      <button className='button small' onClick={this.props.newBlogPost}>Create Blog Post</button>
      </div>

    )
  }
})


var EditPost = React.createClass({
  render: function () {
    var postTitle = $('editTitle').val()
    var postContent = $('editContent').val()
    return(
    <form action={'/users/'+window.location.pathname.split('/')[2]+'/trips/'+this.props.currentState+'/posts/'+ this.props.id} method='post'>
      <input type="text" id='editTitle'  name='post[title]' placeholder={this.props.title}/>
      <textarea cols="20" id='editContent' name='post[content]' rows="10" placeholder="What did you do today?">{this.props.content}</textarea>
      <input type='submit' value='Update' className='button'/>
    </form>
    )
  }
})



var newPostButton = React.createClass({
  onClick: function() {
    this.state.showResults === true ? this.setState({ showResults: false }) : this.setState({ showResults: true })
  },
  render: function() {
    return (
      <div>
        <button className="small" onClick={this.onClick}><span className='fi-pencil'></span> Add new blog post</button>
      </div>
    );
  }
});

var NewDestinationButton = React.createClass({
  getInitialState: function() {
    return { showResults: false };
  },
  onClick: function() {
    this.state.showResults === true ? this.setState({ showResults: false }) : this.setState({ showResults: true })
  },
  render: function() {
    return (
      <span>
        <button className="tiny" onClick={this.onClick} ><span className='fi-pencil'></span> Add a Stop</button>
      { this.state.showResults ? <NewDestinationForm currentTrip={this.props.currentTrip}/> : null }
      </span>
    );
  }
});

var NewDestinationForm = React.createClass({
  render: function () {
    return (
      <form action={'/users/'+window.location.pathname.split('/')[2]+'/trips/'+this.props.currentTrip+'/destinations'} method='post'>
        <input type='hidden' name='_method' value='post'/>
        <input type="text" name='destination[name]' placeholder="City, State"/>
        <input type='submit' value='Add Stop' className='button'/>
      </form>
    )
  }
})

var DisplayPosts = React.createClass({
  render: function() {
    var allPosts = this.props.posts
    var displayPosts = [];
    for(var i = 0; i < allPosts.length; i++){
      displayPosts.push(< PostComponent currentTrip={this.props.currentTrip} key={allPosts[i].id} data={allPosts[i]} />)
    }
  return (
        <div className="display-posts">
          {displayPosts}
        </div>
    )
  }
})
var BlogCarousel = React.createClass({
  render: function () {
      console.log(this.props.showResults);

    return (
      <div className="new-trip">
      <button className="small" onClick={this.props.onClick} ><span className='fi-pencil'></span> {this.props.showResults ? "Show my blogs" : "Add new blog post"}</button>
      { this.props.showResults ? <NewBlogPost newBlogPost={this.props.newBlogPost} lat={this.props.lat} long={this.props.long} /> : <DisplayPosts currentTrip={this.props.currentTrip} posts={this.props.posts} />}
      </div>
    )
  }
})

var PostComponent = React.createClass({
  getInitialState: function(){
    return {lat: 0, long: 0, editForm: false}
  },
  toggleForm: function () {
    this.state.editForm === true ? this.setState({ editForm: false }) : this.setState({ editForm: true })
  },
  render: function () {
    var data = this.props.data
    var date = data.created_at.split('T')
    var endDate = date[0].split('-')
    var displayDate = (endDate[1].toString() + " " +  endDate[2].toString()+ " " + endDate[0].toString())
    return (
      <div className="post-container">
        <div>
            <button className='button tiny' onClick={this.toggleForm}>EDIT</button>
          {
            this.state.editForm ? <EditPost currentTrip={this.props.currentTrip} className='editPost' key={data.id} id={data.id} title={data.title} content={data.content}/>:
            <div>
            <h1>{data.title}</h1>
            <p>{data.content}</p>
            <p>{displayDate}</p>
            </div>
          }
        </div>
      </div>
    )
  }
})

var Itinerary = React.createClass({
  finished: function () {
      this.props.finished ? this.setState({ finished: false }) : this.setState({ finished: true });
      $.post('/users/'+ window.location.pathname.split('/')[2]+ '/trips/' + this.props.currentTrip + '/finished?dist='+totalDist, function(){
      })
      this.props.updateTrip()
    },
  render: function () {
    var trip = this.props.trip
    var destinationsPath="/" + trip.start_location
      this.props.destinations.forEach(function (destination) {
        destinationsPath += "/" + destination.name.replace(/ /g, "+")
      })
      destinationsPath+="/" +trip.end_location
      var dest = destinationsPath.replace(/ /g, "+")
    return (
      <div className="itinerary">
        <button className="back-trip small" onClick={this.props.toggled}>Go Back to Trips</button>
        <div className="new-trip">
        <a href={'https://www.google.com/maps/dir' + dest} target='_blank' className='button tiny'>Get Directions</a>
        {<NewDestinationButton currentTrip={this.props.currentTrip}/>}
        </div>
        <div className="destination-list">
          <h3>Select City</h3>
          <Accordion updateTrip={this.props.updateTrip} destinations={this.props.destinations}/>
        </div>
        <div className="itinerary-finished">
          <button className="tiny" onClick={this.finished}> {this.props.finished ? "Trip is Finished!" : "End Trip?"}</button>
        </div>
      </div>
    )
  }
})


var Section = React.createClass({
  handleClick: function(){
    if(this.state.open) {
      this.setState({
        open: false,
        class: "section"
      });
    }else{
      this.setState({
        open: true,
        class: "section open"
      });
    }
  },
  getInitialState: function(){
     return {
       open: false,
       class: "section",
       togglePlacesForm: false,
       info: ''
     }
  },
  onClick: function() {
    $('#loclat').html(this.props.lat)
    $('#loclong').html(this.props.lng)
    $('#destinationid').html(this.props.destinationid)
    this.state.togglePlacesForm === true ? this.setState({ togglePlacesForm: false }) : this.setState({ togglePlacesForm: true })
  },
  deleteEvent: function (id) {
    $.post("/users/"+window.location.pathname.split('/')[2]+"/trips/" + window.location.pathname.split('/')[4] + "/destinations/"+this.props.destinationid  +"/events/"+id, function(results){
    });
    this.props.getTripInfo();
  },
  render: function() {
    var eventList = this.props.events.map(function (e) {
      return (<div className="eventlisting">
                <div className="small-7 columns">
                  <i className={eventIcons[e.category]}></i>&nbsp;&nbsp;
                  {e.name}&nbsp;&nbsp;
                </div>
                <div className="small-3 columns">
                  <MoreInfoModalButton className="inline" placeid={e.place_id}/>
                </div>
                <div className="small-2 columns">
                  <i onClick={this.deleteEvent.bind(this, e.id)} className="fa fa-close right"></i>&nbsp;
                </div>
              </div>)
    }, this)
    return (
      <div className={this.state.class}>
        <button>toggle</button>
        <div className="sectionhead" onClick={this.handleClick}><i className="fa fa-plus">{' '+this.props.name}</i></div>
        <div className="articlewrap">
          <div className="article">
            {eventList}
          </div>
        </div>
      </div>
    );
  }
});

var Accordion = React.createClass({
  render: function() {
    return (
      <div className="main">
         {this.props.destinations.map(function (e) {
            return (<Section getTripInfo={this.props.updateTrip} name={e.name} events={e.events} destinationid={e.destinationid} placeid={e.place_id} lat={e.lat} lng={e.lng}/>)
          }, this)}
      </div>
    );
  }
});




var Activities = React.createClass({
  getInitialState: function () {
    return {
      togglePlacesForm: false,
    }
  },
  onClick: function(lat, lng, id, name) {
    if (name === "Here and Now") {
      $('#loclat').html(this.props.lat)
      $('#loclong').html(this.props.long)
    } else {
      $('#loclat').html(lat)
      $('#loclong').html(lng)
    }
    $('#destinationid').html(id)
    this.state.togglePlacesForm === true ? this.setState({ togglePlacesForm: false }) : this.setState({ togglePlacesForm: true })
  },
  render: function () {
    var trip = this.props.trip
    return (
      <div>
        <div className='hideMe'>
          <div id='loclat' className='hidden'>{this.props.lat}</div>
          <div id='loclong' className='hidden'>{this.props.long}</div>
          <div id='destinationid' className='hidden'></div>
          <div id='category' className='hidden'></div>
        </div>
        <div className='small-4 columns'>
          <label for="range">Distance (Miles)</label>
          <select className="small" id="range" name="range">
            <option value="1600">1</option>
            <option value="8047">5</option>
            <option value="16093">10</option>
            <option value="32187">20</option>
          </select>
          <label for="cat">Activities Category</label>
          <select className="small" id="cat" name="category">
            <option value="museum">Museums</option>
            <option value="art_gallery">Art Galleries</option>
            <option value="campground">Campgrounds</option>
            <option value="zoo">Zoos</option>
            <option value="night_club">NightLife</option>
            <option value="shopping_mall">Shopping Malls</option>
            <option value="stadium">Stadiums</option>
            <option value="casino">Casinos</option>
          </select>
          {this.props.destinations.map(function (e) {
            return (<Destination onClick={this.onClick} getTripInfo={this.props.updateTrip} name={e.name} events={e.events} destinationid={e.destinationid} placeid={e.place_id} lat={e.lat} lng={e.lng}/>)
          }, this)}
        </div>
        <div className='small-8 columns'>
          <PlacesForm currentTrip={this.props.currentTrip} getTripInfo={this.props.updateTrip}/>
        </div>
      </div>
    )
  }
})

var Destination = React.createClass({
  getInitialState: function () {
    return {
      togglePlacesForm: false,
      info: ''
    }
  },
  render: function () {
    return (
      <div>
        <h3 className='destination' onClick={this.props.onClick.bind(this, this.props.lat, this.props.lng, this.props.destinationid, this.props.name)}>{this.props.name}</h3>
      </div>
    )
  }
})

var PlacesForm = React.createClass({
  getInitialState: function() {
    return {
      searchResults: []
    }
  },
  onClick: function (lat, lng, category) {
    var lat = $('#loclat').html();
    var lng = $('#loclong').html();
    var range = $('#range').val();
    if (category === "museum"){category =  $('#cat').val()}
    $.get('/find_places?lat='+lat+'&lng='+lng+'&range='+range+'&category='+category, function(results){
      if(this.isMounted()){
        this.setState({
          searchResults: results
        })
      }
    }.bind(this))
  },
  render: function () {
    return (
      <div>
        <div className="icon-bar three-up">
          <a className="item" onClick={this.onClick.bind(this, this.props.lat, this.props.lng, "restaurant")}>
            <label>Food</label>
          </a>
          <a className="item" onClick={this.onClick.bind(this, this.props.lat, this.props.lng, "lodging")}>
            <label>Hotels</label>
          </a>
          <a className="item" onClick={this.onClick.bind(this, this.props.lat, this.props.lng, "museum")}>
            <label>Activities</label>
          </a>
        </div>
        <PlacesResults currentTrip={this.props.currentTrip} getTripInfo={this.props.getTripInfo} results={this.state.searchResults}/>
      </div>
    )
  }
})

var PlacesResults = React.createClass({
  getInitialState: function () {
    return ({
      info: ''
    })
  },
  getInfo: function (placeId) {
    $.get("/show_info?place_id="+placeId, function(results){
      if(this.isMounted()){
        this.setState({
          info: results
        })
      }
    }.bind(this))
  },
  saveEvent: function (placeId, name) {
    var destinationId = $('#destinationid').html();
    var category = $('#category').html();
    $.post("/users/"+window.location.pathname.split('/')[2]+"/trips/" + this.props.currentTrip + "/destinations/"+destinationId+"/events?event[place_id]="+placeId+"&event[name]="+name+"&event[category]="+category, function(results){
      this.props.getTripInfo();
      if(this.isMounted()){
        this.setState({
          info: results
        })
      }
    }.bind(this))
  },
  render: function () {
    if (this.props.results.data){
      var listings = this.props.results.data.results.map(function (result) {
        return (<div className="placesresult clear">
                  <div className="small-7 columns">
                    <button type='submit' onClick={this.saveEvent.bind(this, result.place_id, result.name)} className="button tiny success">Save</button>
                    <MoreInfoModalButton saveEvent={this.saveEvent.bind(this, result.place_id, result.name)} placeid={result.place_id}/>
                  </div>
                  <div className="small-5 columns">
                    <h5 className="inline">{result.name}</h5>
                  </div>
                </div>);
      }, this);
    }
    return (
      <div className="searchresultlistings">
        {listings}
      </div>
    )
  }
})


var MoreInfoModalButton = React.createClass({
  getInitialState: function() {
    return { modalIsOpen: false,
              info: ''
                          };
  },
	handleClick: function(){
    $.get("/show_info?place_id="+this.props.placeid, function(results){
        console.log(results);
        this.setState({
          info: results
        })
    }.bind(this))
    this.openModal()
	},
  openModal: function() {
    this.setState({modalIsOpen: true});
    console.log(this.state.info);
  },

  closeModal: function() {
    this.setState({modalIsOpen: false});
  },
  saveAndClose: function(){
    this.props.saveEvent()
    this.closeModal()
  },
  render: function() {
    return (
      <div className="inline">
        <button onClick={this.handleClick} className="button tiny info">More Info</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles} >
              <div className="modal-info">
                  <div className="info-open">
                    <button type='submit' onClick={this.saveAndClose} className="button tiny success">Save</button>
                  </div>
                  <h2>Name:</h2>
                  <p>{this.state.info.data ? this.state.info.data.result.name : undefined}</p>
                  <h3>Address:</h3>
                  <p>{this.state.info.data ? this.state.info.data.result.formatted_address : undefined}</p>
                  <h3>Phone:</h3>
                  <p>{this.state.info.data ? this.state.info.data.result.formatted_phone_number : undefined}</p>
                  <h3>Website: <a href={this.state.info.data ? this.state.info.data.result.website : undefined} target='_blank'>Go To Website</a></h3>
                  <div className="info-open">

                  </div>
                </div>
        </Modal>
      </div>
    );
  }
})


module.exports = TripDashboard
