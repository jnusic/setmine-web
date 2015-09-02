var React = require('react')
var constants = require('../constants/constants')

var FeaturedTile = React.createClass({
	componentDidMount: function() {
		$('.featured-tile').hover(function() {
			$('.featured-info', $(this)).addClass('slideInUp')
		}, function() {
			$('.featured-info').removeClass('slideInUp');
		})
	},
	render: function() {
		var image = {
			backgroundImage: "url(" + constants.S3_ROOT_FOR_IMAGES + 'small_' + this.props.data.main_imageURL+")"
		}
		return (
			<div 
			className="featured-tile flex-column overlay-container click" 
			style={image} >
			    <div className="overlay"></div>
			    <div className="flex-column featured-info animated">
			        <div className="event-name">{this.props.data.event}</div>
			        <div className="event-date">{this.props.data.formattedDate}</div>
			        <div className="featured-type">{this.props.data.type}</div>
			    </div>
			</div>
		);
	}
});

module.exports = FeaturedTile