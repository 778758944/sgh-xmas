/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
# NOTE: These components are linked with Bootstrap
*/

var React = require('react');

var TitleBar = React.createClass({
	getInitialState:function(){
		return {itemOnFocus:'home'}
	},
	render:function(){
		return(
			<nav className="navbar navbar-inverse">
				<div className="container">
					<div className="navbar-header">
						<a className="navbar-brand" href="/admin">SGH 2015圣诞游戏项目 后台主控</a>
					</div>
					<div id="navbar" className="navbar-collapse collapse">
						<ul className="nav navbar-nav">
							<li className="active"><a href="#">管理员登录</a></li>
						</ul>
					</div>
				</div>
			</nav>
		);
	}
});

module.exports = TitleBar;