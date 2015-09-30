var React = require('react');


var NewTripButton = React.createClass({
	handleClick: function(e){
		if(e && typeof e.preventDefault == 'function') {
			e.preventDefault();
		}
		var anchor = $('<a class="close-reveal-modal">&#215;</a>');
		var reveal = $('<div class="newTrip reveal-modal" data-reveal>').append($('#modal').html()).append($(anchor));
		$(reveal).foundation().foundation('reveal', 'open');
		$(reveal).bind('closed.fndtn.reveal', function(e){
      React.unmountComponentAtNode(this);
    });

		if(React.isValidElement(this.props.revealContent)) {
			React.render(this.props.revealContent, $('#modal')[0]);
		}
		else {
			$('#modal').append(this.props.revealContent);
		}
	},
	render: function(){
		return (
			<div className="new-trip">
        <button class='new-trip button tiny' onClick={this.handleClick}><span className='fi-plus'></span> Create New Trip</button>
			</div>
		);
	}
});

module.exports = NewTripButton
