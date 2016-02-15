/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
*/

var React = require('react');
var TitleBar = require('./TitleBar.jsx');

var AppFrame = React.createClass({
	getInitialState:function(){
		return {}
	},
	render:function(){
		return(
			<div>
				<TitleBar />
				<div className="container" dangerouslySetInnerHTML={{__html:this.props.children}}>
				</div>
			</div>
		);
	}
});

module.exports = AppFrame;