/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
# NOTE: These components are linked with Bootstrap
*/

/** Page: Admin Content Home Page JSX **/

var React = require('react');

var wxSettings = React.createClass({
	getInitialState:function(){
		return {tabOnFocus:'overview'}
	},
	changeFocus:function(focusName){
		console.log('clicked!');
		this.setState({tabOnFocus:focusName});
	},
	getErrCode:function(errCode){
		var notifyhtml = [];
		if(errCode){
			var message = "";
			if(errCode != 0){
				switch(errCode){
					case 1:  message="服务器无法获取数据。请重试。";break;
					case 2:  message="AppID和Secret不能为空。请检查输入后再试";break;
					default: message="发生不明错误。请重试。";break;
				}
			}
			notifyhtml.push(
				<div className="alert alert-danger">
					<strong>发生错误！</strong> {message}
				</div>
			);
		}
		return notifyhtml;
	},
	render:function(){
		var errhtml = this.getErrCode(this.props.errCode);
		var ntfhtml = "";
		if(this.props.success){
			ntfhtml = 
				<div className="alert alert-success" role="alert">
					<strong>更改成功!</strong> 新的设置已经储存到服务器，并已生效。
				</div>
		}
		var appIDStr = "";
		console.log('props:'+JSON.stringify(this.props));
		console.log('AppSettings:'+JSON.stringify(this.props.appSettings));
		if(!this.props.appSettings){
			appIDStr = <em>未设定</em>
		}else{
			appIDStr = this.props.appSettings.appid
		}
		return(
			<div className="row">
				<div className="col-xs-9 col-md-10">
					<h4>微信JS-SDK设定</h4>
				</div>
				<div className="col-xs-9 col-md-10">
					<ul className="nav nav-tabs" role="tablist">
						<li role="presentation" className="active"><a href="#">微信公众号</a></li>
					</ul>
				</div>
				<div className="col-xs-9 col-md-10">
					<h5>微信公众号设置</h5>
					<p>如要调用微信客户端的功能，请在这里提供公众号的信息。</p>
				</div>
				<div className="col-xs-9 col-md-10">
					{ntfhtml}
				</div>
				<div className="col-xs-9 col-md-10">
					{errhtml}
				</div>
				<div className="row">
					<div className="col-xs-9 col-md-10">
						<div className="panel panel-default">
							<div className="panel-heading">
								<h3 className="panel-title">目前设定</h3>
							</div>
							<div className="panel-body">
								<p>目前已设定的AppID: {appIDStr}</p>
							</div>
						</div>
					</div>
					<div className="col-xs-9 col-md-10">
						<div className="panel panel-primary">
							<div className="panel-heading">
								<h3 className="panel-title">更改公众号</h3>
							</div>
							<div className="panel-body">
								<form className="form-horizontal" method="POST" action="/admin/configureWXApp">
									<div className="form-group">
										<label htmlFor="appID" className="col-sm-2 control-label">AppID</label>
										<div className="col-sm-10">
											<input type="text" className="form-control" id="appid" name="appid" placeholder="AppID" />
										</div>
									</div>
									<div className="form-group">
										<label htmlFor="secret" className="col-sm-2 control-label">Secret</label>
										<div className="col-sm-10">
											<input type="text" className="form-control" id="secret" name="secret" placeholder="Secret" />
										</div>
									</div>
									<div className="form-group">
										<div className="col-sm-offset-2 col-sm-10">
											<button type="submit" className="btn btn-default">更新设定</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = wxSettings;