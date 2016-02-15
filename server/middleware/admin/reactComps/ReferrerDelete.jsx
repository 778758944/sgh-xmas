/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
# NOTE: These components are linked with Bootstrap
*/

/** Page: Admin Content Home Page JSX **/

var React = require('react');

var ReferrerDelete = React.createClass({
	getInitialState:function(){
		return {}
	},
	getErrCode:function(){
		var errHTML = [];
		if(this.props.errCode){
			var message = "";
			switch(this.props.errCode){
				case 1 	: message="服务器连线错误。请重试";break;
				case 2 	: message="无法找到相关的推荐人信息";break;
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
		var currentInfo = this.props.editdata;
		return(
			<div className="row">
				<div className="col-xs-12 col-md-12 col-sm-12">
					<h4>删除推荐人</h4>
						<ul className="nav nav-tabs" role="tablist">
							<li role="presentation"><a href="./referrer">总览</a></li>
							<li role="presentation"><a href="./addReferrer">新增推荐人</a></li>
						</ul>
					<br />
				</div>
				<div className="col-xs-12 col-md-12 col-sm-12">
					{errHTML}
				</div>
				<div className="col-xs-12 col-md-12 col-sm-12">
					<div className="panel panel-danger">
						<div className="panel-heading">	
							<h3 className="panel-title">删除推荐人</h3>
						</div>
						<div className="panel-body">
							<p>确定删除此推荐人？<br />这操作不能复原！</p>
							<form className="form-horizontal" method="POST" action="./deleteReferrer">
								<input type="hidden" name="id" value={this.props.data.id} />
								<div className="form-group">
									<label htmlFor="name" className="col-sm-2 control-label">推荐人名称</label>
									<div className="col-sm-10">
										<p className="form-control-static">{this.props.data.name}</p>
									</div>
								</div>
								<div className="form-group">
									<div className="col-sm-10 col-sm-offset-2">
										<a href="./prizes"><button type="button" className="btn btn-default">返回</button></a>
										&nbsp;&nbsp;
										<button type="submit" className="btn btn-danger">删除</button>
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

module.exports = ReferrerDelete;