/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
# NOTE: These components are linked with Bootstrap
*/

/** Page: Admin Content Home Page JSX **/

var React = require('react');

var ReferrerAdd = React.createClass({
	getInitialState:function(){
		return {}
	},
	getErrCode:function(){
		var errHTML = [];
		if(this.props.errCode){
			var message = "";
			switch(this.props.errCode){
				case 1 	: message="服务器连线错误。请重试";break;
				case 2 	: message="推荐人名称不能为空。请检查输入数据，然后再提交。";break;
				// case 20 : message="微信获取Access_Token失败。有可能是微信公众号AppID或者Secret不正确。请重试。";break;
				// case 21 : message="服务器获取微信公众号AppID或者Secret出错。请重试";break;
				// case 22 : message="跟微信服务器连线出现问题。请重试。";break;
				// case 23 : message="微信返回HTTP Response为非200代码。请重试";break;
				// case 24 : message="无法储存AccessToken。";break;
				// case 30 : message="连线到微信服务器时发生错误。请重试。";break;
				// case 31	: message="微信服务器返回错误，有可能是微信公众号AppID或者Secret不正确。请重试。";break;
				default : message="不明错误。请重试";break;
			}
			errHTML.push(
				<div className="alert alert-danger">
					<strong>发生错误！</strong> {message}
				</div>
			);
		}
		return errHTML;
	},
	render:function(){
		var errHTML = this.getErrCode();
		return(
			<div className="row">
				<div className="col-xs-12 col-md-12 col-sm-12">
					<h4>推荐人设置</h4>
					<ul className="nav nav-tabs" role="tablist">
						<li role="presentation"><a href="./referrer">总览</a></li>
						<li role="presentation" className="active"><a href="#">新增推荐人</a></li>
					</ul>
					<br />
				</div>
				<div className="col-xs-12 col-md-12 col-sm-12">
					{errHTML}
				</div>
				<div className="col-xs-12 col-md-12 col-sm-12">
					<div className="panel panel-primary">
						<div className="panel-heading">	
							<h3 className="panel-title">新增推荐人</h3>
						</div>
						<div className="panel-body">
							<form className="form-horizontal" method="POST" action="./addReferrer">
								<div className="form-group">
									<label htmlFor="name" className="col-sm-2 control-label">推荐人名称</label>
									<div className="col-sm-10">
										<input type="text" className="form-control" id="name" name="name" placeholder="推荐人名称" />
									</div>
								</div>
								<div className="form-group">
									<div className="col-sm-10 col-sm-offset-2">
										<button type="submit" className="btn btn-success">新增推荐人</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = ReferrerAdd;