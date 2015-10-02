var React = require('react');
var Slider = require('react-slick');

var SimpleSlider = React.createClass({
  getInitialState: function(){
    return {
      mappy: false
    }
  },
  change: function(){
    this.state.mappy ? this.setState({ mappy: false }) : this.setState({ mappy: true })
  },
  render: function () {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 3,
      initialSlide: 2
    };
    console.log(this.state.mappy);
    return (
      <div>
      <button className="tiny" onClick={this.change}>Change Me</button>
      {this.state.mappy ? <Mappy /> : null}
      <Slider {...settings}>
        <div><h3>1</h3></div>
        <div><h3>2</h3></div>
        <div><h3>3</h3></div>
        <div><h3>4</h3></div>
        <div><h3>5</h3></div>
        <div><h3>6</h3></div>
      </Slider>
      </div>
    );
  }
});

var Mappy = React.createClass({
  render: function(){
    return (
      <div id="Map" className="map">

      </div>
    )
  }
})

module.exports = SimpleSlider
