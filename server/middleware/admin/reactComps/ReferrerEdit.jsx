/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
# NOTE: These components are linked with Bootstrap
*/

/** Page: Admin Content Home Page JSX **/

var React = require('react');

var ReferrerEdit = React.createClass({
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
						<li role="presentation"><a href="./prizes">总览</a></li>
						<li role="presentation"><a href="#">新增推荐人</a></li>
					</ul>
					<br />
				</div>
				<div className="col-xs-12 col-md-12 col-sm-12">
					{errHTML}
				</div>
				<div className="col-xs-12 col-md-12 col-sm-12">
					<div className="panel panel-primary">
						<div className="panel-heading">	
							<h3 className="panel-title">修改推荐人</h3>
						</div>
						<div className="panel-body">
							<form className="form-horizontal" method="POST" action="./editReferrer">
								<input type="hidden" name="id" value={this.props.editdata.id} />
								<div className="form-group">
									<label htmlFor="name" className="col-sm-2 control-label">推荐人名称</label>
									<div className="col-sm-10">
										<input type="text" className="form-control" id="name" name="name" value={this.props.editdata.name} placeholder="推荐人名称" />
									</div>
								</div>
								<div className="form-group">
									<div className="col-sm-10 col-sm-offset-2">
										<button type="submit" className="btn btn-success">更新推荐人</button>
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

module.exports = ReferrerEdit;