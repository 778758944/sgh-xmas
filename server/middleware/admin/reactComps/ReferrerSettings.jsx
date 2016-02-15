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
					case 2:  message="二维码有效期数必须为整数，最小值为1，最大为2592000。请检查输入后重试。";break;
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
		var parseResult = function(string){
			if(!string){
				return <em>未设定</em>
			}else{
				return string
			}
		}
		var appIDStr = "";

		console.log('props:'+JSON.stringify(this.props));
		console.log('AppSettings:'+JSON.stringify(this.props.appSettings));
		appIDStr = parseResult(this.props.appSettings.appid);
		expryStr = parseResult(this.props.appSettings.qrexpiry);
		return(
			<div className="row">
				<div className="col-xs-9 col-md-10">
					<h4>推荐人名单</h4>
				</div>
				<div className="col-xs-9 col-md-10">
					<ul className="nav nav-tabs" role="tablist">
					<li role="presentation"><a href="./referrer">总览</a></li>
					<li role="presentation"><a href="./addReferrer">新增推荐人</a></li>
					<li role="presentation" className="active"><a href="#">推荐人二维码 通用设定</a></li>
					</ul>
					<br />
				</div>
				<div className="col-xs-9 col-md-10">
					<h5>推荐人二维码 通用设定</h5>
					<p>如要管理或者新增推荐人，请设置以下参数。</p>
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
								<p>目前已设定的二维码有效时间为: {expryStr} 秒</p>
								<p>目前已设定的AppID: {appIDStr}</p>
							</div>
						</div>
					</div>
					<div className="col-xs-9 col-md-10">
						<div className="panel panel-primary">
							<div className="panel-heading">
								<h3 className="panel-title">更改推荐人二维码设定</h3>
							</div>
							<div className="panel-body">
								<form className="form-horizontal" method="POST" action="/admin/referrerSetting">
									<div className="form-group">
										<label className="col-sm-2 control-label">微信公众号AppID,Secret</label>
										<div className="col-sm-10">
											<p className="form-control-static">请在微信JS-SDK设定页面里设置。<a href='./wx'>点击这里设定</a></p>
										</div>
									</div>
									<div className="form-group">
										<label htmlFor="expiry" className="col-sm-2 control-label">二维码有效期</label>
										<div className="col-sm-10">
											<input type="number" className="form-control" id="expiry" name="expiry" min={1} max={2592000} placeholder="有效期 （以秒为单位）" />
											<div className="input-group-addon">秒</div>
										</div>
									</div>
									<div className="form-group">
										<div className="col-sm-offset-2 col-sm-10">
											<button type="submit" className="btn btn-success">更新设定</button>
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