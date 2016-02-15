/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
*/

var React = require('react');

var MainApp = React.createClass({
	getInitialState:function(){
		return {errcode:0}
	},
	render:function(){
		var pageTitle = this.props.title + " | "+ this.props.siteTitle;
		return(
			<html>
			<head>
				<meta httpEquiv="Content-Type" content="text/html;charset=utf-8"/>
				<meta httpEquiv="Content-Language" content="zh-CN" />
				<title>{pageTitle}</title>
				<script src="/admin/js/jquery.min.js" type="text/javascript"></script>
				<script src="/admin/js/bootstrap.min.js" type="text/javascript"></script>
				<link rel="stylesheet" href="/admin/css/bootstrap.min.css" type="text/css" />
				<link rel="stylesheet" href="/admin/css/bootstrap-theme.min.css" type="text/css" />
			</head>
			<body>
				<div id="bodycontent" dangerouslySetInnerHTML={{__html:this.props.children}}>
				</div>
			</body>
			</html>
		);
	}
});

module.exports = MainApp;

