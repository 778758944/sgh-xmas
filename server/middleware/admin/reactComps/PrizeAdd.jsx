/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
# NOTE: These components are linked with Bootstrap
*/

/** Page: Admin Content Home Page JSX **/

var React = require('react');

var prizeAdd = React.createClass({
	getInitialState:function(){
		return {}
	},
	getErrCode:function(){
		var errHTML = [];
		if(this.props.errCode){
			var message = "";
			switch(this.props.errCode){
				case 1 	: message="服务器连线错误。请重试";break;
				case 2 	: message="奖品名称，中奖机率和数量不能为空。请检查输入数据，然后再提交。";break;
				case 3	: message="中奖机率和奖品数量必须为有效数字";break;
				case 4	: message="中奖机率必须为0%到100%";break;
				case 5	: message="奖品数量必须为有效数字，并必须高于1。";break;
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
					<h4>奖品设置</h4>
					<ul className="nav nav-tabs" role="tablist">
						<li role="presentation"><a href="./prizes">总览</a></li>
						<li role="presentation" className="active"><a href="#">新增礼物</a></li>
					</ul>
					<br />
				</div>
				<div className="col-xs-12 col-md-12 col-sm-12">
					{errHTML}
				</div>
				<div className="col-xs-12 col-md-12 col-sm-12">
					<div className="panel panel-primary">
						<div className="panel-heading">	
							<h3 className="panel-title">新增奖品</h3>
						</div>
						<div className="panel-body">
							<form className="form-horizontal" method="POST" action="./addPrize">
								<div className="form-group">
									<label htmlFor="name" className="col-sm-2 control-label">奖品名称</label>
									<div className="col-sm-10">
										<input type="text" className="form-control" id="name" name="name" placeholder="奖品名称" />
									</div>
								</div>
								<div className="form-group">
									<label htmlFor="order" className="col-sm-2 control-label">奖品等级</label>
									<div className="col-sm-10">
										<input type="text" className="form-control" id="order" name="order" placeholder="奖品等级,例:如该奖品为一等奖，输入'一'" />
									</div>
								</div>								
								<div className="form-group">
									<label htmlFor="percentage" className="col-sm-2 control-label">中奖机率 (0%-100%)</label>
									<div className="col-sm-10">
										<input type="number" className="form-control" id="percentage" name="percentage" placeholder="中奖机率" min={0} max={100} step={0.01}/>
									</div>
								</div>
								<div className="form-group">
									<label htmlFor="amount" className="col-sm-2 control-label">奖品数量</label>
									<div className="col-sm-10">
										<input type="text" className="form-control" id="amount" name="amount" placeholder="奖品数量" min={1}/>
									</div>
								</div>
								<div className="form-group">
									<div className="col-sm-10 col-sm-offset-2">
										<button type="submit" className="btn btn-success">新增奖品</button>
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

module.exports = prizeAdd;