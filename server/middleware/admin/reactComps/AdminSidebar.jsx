/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
# NOTE: These components are linked with Bootstrap
*/

/** Component: Admin Main Page Side menu JSX **/

var React = require('react');

var AdminSidebar = React.createClass({
	genInitialState:function(){
		return {}
	},
	render:function(){
		if(this.props.rights == 1){
			var items=[
				{name:'dashboard',caption:'主页',link:'./home'},
				{name:'winners',caption:'中奖人士名单',link:'./winners'},
				{name:'prizes',caption:'礼品名单',link:'./prizes'},
				{name:'referrer',caption:'推荐人设定',link:'./referrer'},
				{name:'wxsettings',caption:'微信JS-SDK设定',link:'./wx'},
				{name:'logout',caption:'登出',link:'./logout'}
			]; //{name:'admin',caption:'管理人管理',link:'./AdminCPL'},
		}else{
			var items=[
				{name:'dashboard',caption:'主页',link:'./home'},
				{name:'winners',caption:'中奖人士名单',link:'./winners'},
				{name:'referrer',caption:'推荐人设定',link:'./referrer'},
				{name:'logout',caption:'登出',link:'./logout'}
			];
		}
		if(typeof(this.props.onFocusItem) !== 'undefined'){
			renderItems = items;
			for(var item in items){
				if(items[item].name == this.props.onFocusItem){
					renderItems[item].active = true;
				}
			}
			items = renderItems;
		}
		//Start render
		var sidebarHTML = [];
		for(var i=0;i<items.length;i++){
			if(items[i].active){
				sidebarHTML.push(<li className='active' key={items[i].name}><a href={items[i].link}>{items[i].caption}</a></li>);
			}else{
				sidebarHTML.push(<li key={items[i].name}><a href={items[i].link}>{items[i].caption}</a></li>);
			}
		}
		//Return HTML
		return(
			<div className="col-sm-3 col-md-2 sidebar">
				<ul className="nav nav-sidebar">
					{sidebarHTML}
				</ul>
			</div>
		);
	}
});



module.exports = AdminSidebar;