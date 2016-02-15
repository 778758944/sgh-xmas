/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
# NOTE: These components are linked with Bootstrap
*/

/** Page: Admin Content Home Page JSX **/

var React = require('react');

var AdminContentHome = React.createClass({
	getInitialState:function(){
		return {}
	},
	render:function(){
		return(
			<div>
				<h1 className="page-header">主控台主页</h1>
				<p className="lead">请从目录栏选择设定选项</p>
			</div>
		);
	}
});

module.exports = AdminContentHome;