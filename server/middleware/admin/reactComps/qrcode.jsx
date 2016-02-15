/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
*/

var React = require('react');

var qrcode = React.createClass({
	render:function(){
		var url = this.props.urlcode;
		return(
			<html>
			<head>
				<meta httpEquiv="Content-Type" content="text/html;charset=utf-8"/>
				<meta httpEquiv="Content-Language" content="zh-CN" />
				<title>QR Code</title>
				<script src="/admin/js/jquery.min.js" type="text/javascript"></script>
				<script src="/admin/js/qr.min.js" type="text/javascript"></script>
				<link rel="stylesheet" href="/admin/css/bootstrap-theme.min.css" type="text/css" />
			</head>
			<body>
				<canvas id="qrcode"></canvas>
				<input type="hidden" name="targetURL" id="targetURL" value={this.props.urlcode} />
				<script src="/admin/js/genqr.js"></script>
			</body>
			</html>
		);
	}
});

module.exports = qrcode;

