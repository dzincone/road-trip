var React = require('react');

var GasInfo = React.createClass({
  getInitialState: function () {
    return {
      gasDistance: '',
      cafeDistance: '',
      liquorDistance: '',
      campDistance: '',
      lat: 0,
      long: 0
    }
  },
  componentDidMount: function(){
    navigator.geolocation.getCurrentPosition(function (position) {
      if(this.isMounted()){
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude
        })
        this.getGasInfo(position.coords.latitude, position.coords.longitude);
        this.getCafeInfo(position.coords.latitude, position.coords.longitude);
        this.getLiquorInfo(position.coords.latitude, position.coords.longitude);
        this.getCampInfo(position.coords.latitude, position.coords.longitude);
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
  getCafeInfo: function (lat, long) {
    $.get('/cafe_info?lat='+lat+'&lng='+long, function(results){
      if(this.isMounted()){
        var distance = results
        this.setState({
          cafeDistance: distance
        })
      }
    }.bind(this))
  },
  getLiquorInfo: function (lat, long) {
    $.get('/liquor_info?lat='+lat+'&lng='+long, function(results){
      if(this.isMounted()){
        var distance = results
        this.setState({
          liquorDistance: distance
        })
      }
    }.bind(this))
  },
    getCampInfo: function (lat, long) {
      $.get('/camp_info?lat='+lat+'&lng='+long, function(results){
        if(this.isMounted()){
          var distance = results
          this.setState({
            campDistance: distance
          })
        }
      }.bind(this))
    },
  render: function () {
    return (
      <div className="small-12 columns">

        <div className="small-3 columns">
          <div className="gasinfo">
            <i className="fa fa-car"></i>
            <p>Gas</p>
            <p>{this.state.gasDistance}</p>
          </div>
        </div>

        <div className="small-3 columns">
          <div className="liquorinfo">
            <i className="fa fa-beer"></i>
            <p>Spirits</p>
            <p>{this.state.liquorDistance}</p>
          </div>
        </div>

        <div className="small-3 columns">
          <div className="campinfo">
            <i className="fa fa-fire"></i>
            <p>Campground</p>
            <p>{this.state.campDistance}</p>
          </div>
        </div>

        <div className="small-3 columns end">
          <div className="cafeinfo">
            <i className="fa fa-apple"></i>
            <p>Cafe</p>
            <p>{this.state.cafeDistance}</p>
          </div>
        </div>

      </div>
    )
  }
})

module.exports = GasInfo
