var GasInfo = React.createClass({
  getInitialState: function () {
    return {
      gasDistance: '',
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
  render: function () {
    return (
      <div className="gasinfo">
        <i className="fa fa-car"></i><br></br>Closest Gas <br></br>{this.state.gasDistance}
        {(this.state.gasDistance === "") ? null : <button className='new-trip button tiny'>Find Directions</button>}
      </div>
    )
  }
})
