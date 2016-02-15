/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
# NOTE: These components are linked with Bootstrap
*/

/** Page: Login Page JSX **/

var React 	= require('react');
var TitleBar = require('./TitleBar.jsx');

var loginPage = React.createClass({
	render:function(){
		var errorHTML= "";
		if(this.props.errCode != 0){
			var errMsg = "";
			var errTitle = "登陆错误";
			switch(this.props.errCode){
				case 1: errMsg="用户名称和密码不正确,请重新输入";break;
				case 2: errMsg="请输入用户名";break;
				case 3: errMsg="密码不能为空";break;
				case 4: errMsg="服务器出错，请再试";break;
				case 10: errMsg="你没有权利进行这操作。请登录";break;
				case 20: errMsg="Cookie已经关闭。请打开Cookie以保存登陆状态";break;
				case 21: errMsg="Cookie读取发生错误。请重试";break;
				default: errMsg="不明错误，请再试";break;
			}
			errorHTML = 
				<div className="alert alert-danger">
					<strong>{errTitle}</strong> {errMsg}
				</div>;
		}
		return(
			<div>
				<TitleBar />
				<div className="container theme-showcase" role="main">
					<div className="col-md-8 col-md-offset-2">
						<div className="row">
							<div className="col-sm-12 col-md-12 col-xs-12">
								{errorHTML}
							</div>
							<div className="col-sm-12 col-md-12 col-xs-12">
								<div className="panel panel-primary">
									<div className="panel-heading">
										<h3 className="panel-title">管理员登陆</h3>
									</div>
									<div className="panel-body">
										<form className="form-horizontal" action="/admin/login" method="post">
											<div className="form-group">
												<label htmlFor="username" className="col-sm-2 control-label">用户名</label>
												<div className="col-sm-10">
													<input type="text" id="username" name="username" placeholder="用户名"/>
												</div>
											</div>
											<div className="form-group">
												<label htmlFor="password" className="col-sm-2 control-label">密码</label>
												<div className="col-sm-10">
													<input type="password" id="password" name="password" placeholder="密码"/>
												</div>
											</div>
											<div className="form-group">
												<div className="col-sm-offset-2 col-sm-10">
													<button type="submit" className="btn btn-default">登陆</button>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = loginPage;