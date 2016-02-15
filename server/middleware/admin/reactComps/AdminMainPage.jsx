/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
# NOTE: These components are linked with Bootstrap
*/

/** Page: Admin Main Page JSX **/
var React = require('react');
var TitleBar = require('./TitleBar.jsx');
var AdminSidebar = require('./AdminSidebar.jsx');

var AdminMainPage = React.createClass({
	getInitialState:function(){
		return {}
	},
	render:function(){
		var focusPageUrl = "";
		if(typeof(this.props.page) === 'undefined'){
			focusPageUrl = "./adminHome.jsx";
		}else{
			focusPageUrl=this.props.page;
		}
		//Render
		return(
			<div>
				<TitleBar loggedIn={true} />
				<div className="container-fluid">
					<div className="row">
						<div className="col-sm-12 col-md-12">
							<AdminSidebar onFocusItem={this.props.page} rights={this.props.rights}/>
							<div className="col-sm-8 col-sm-offset-3 col-md-9 col-md-offset-2 main" dangerouslySetInnerHTML={{__html:this.props.pageContent}}>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = AdminMainPage;