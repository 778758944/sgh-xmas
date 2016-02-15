/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
# NOTE: These components are linked with Bootstrap
*/

/** Page: Admin Content Home Page JSX **/

var React = require('react');

var AdminEdit = React.createClass({
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
					case 2:  message="旧密码不对，请重试。";break;
					case 2:  message="新密码和确认新密码栏里的密码不符，请检查后再试。";break;
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
					<strong>更改成功!</strong> 新的密码已经生效。下回登陆时请使用新密码登录
				</div>
		}
		return(
			<div className="row">
				<div className="col-xs-9 col-md-10">
					<h4>管理员设置</h4>
				</div>
				<div className="col-xs-9 col-md-10">
					<ul className="nav nav-tabs" role="tablist">
						<li role="presentation" className="active"><a href="#">修改密码</a></li>
					</ul>
				</div>
				<div className="col-xs-9 col-md-10">
					<h5>修改账号密码</h5>
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
								<h3 className="panel-title">目前账户</h3>
							</div>
							<div className="panel-body">
								<p>目前账户: admin</p>
							</div>
						</div>
					</div>
					<div className="col-xs-9 col-md-10">
						<div className="panel panel-primary">
							<div className="panel-heading">
								<h3 className="panel-title">更改密码</h3>
							</div>
							<div className="panel-body">
								<form className="form-horizontal" method="POST" action="/admin/editUserPassword">
									<div className="form-group">
										<label htmlFor="appID" className="col-sm-2 control-label">旧密码</label>
										<div className="col-sm-10">
											<input type="password" className="form-control" id="existingPass" name="existingPass" placeholder="旧密码" />
										</div>
									</div>
									<div className="form group">
										<hr />
									</div>
									<div className="form-group">
										<label htmlFor="secret" className="col-sm-2 control-label">新密码</label>
										<div className="col-sm-10">
											<input type="text" className="form-control" id="newPass" name="newPass" placeholder="新密码" />
										</div>
									</div>
									<div className="form-group">
										<label htmlFor="secret" className="col-sm-2 control-label">确认新密码</label>
										<div className="col-sm-10">
											<input type="text" className="form-control" id="confirmNewPass" name="confirmNewPass" placeholder="确认新密码" />
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

module.exports = AdminEdit;