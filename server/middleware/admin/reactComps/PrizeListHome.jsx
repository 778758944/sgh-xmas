/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
# NOTE: These components are linked with Bootstrap
*/

/** Page: Admin Content Home Page JSX **/

var React = require('react');

var prizeListHome = React.createClass({
	getInitialState:function(){
		return {}
	},
	getSuccess:function(){
		if(this.props.success){
			var ttl = "";
			var msg = "";
			switch(this.props.success){
				case 1 	: ttl="新增成功";msg="新的奖品已经登记到服务器上。";break;
				case 2  : ttl="修改成功";msg="奖品信息已经更新。";break;
				case 3  : ttl="删除成功";msg="有关奖品已经被删除。";break;
			}
			return(
				<div className="alert alert-success" role="alert">
					<strong>{ttl}</strong> {msg} 
				</div>
			);
		}
	},
	render:function(){
		var prizedata = this.props.prizedata;
		var datahtml = [];
		if(!prizedata){
			datahtml.push(<pre>数据库里没有注册任何礼物</pre>);
		}else if(prizedata.length == 0){
			datahtml.push(<pre>数据库里没有注册任何礼物</pre>)
		}else{
			var notifyhtml = this.getSuccess();
			var theadhtml = 
				<thead>
					<tr>
						<th>#</th>
						<th>奖品 (等级)</th>
						<th>中奖机率</th>
						<th>派发数量</th>
						<th>剩余数量</th>
						<th>操作</th>
					</tr>
				</thead>;
			var rows = [];
			for(var items in prizedata){
				rows.push(
					<tr key={'prizedata'+items}>
						<th scope="row">{items}</th>
						<td>{prizedata[items].name + ' (' + prizedata[items].order +'等奖)'}</td>
						<td>{prizedata[items].initialPercentage * 100}%</td>
						<td>{prizedata[items].amount}</td>
						<td>{prizedata[items].remainingAmount}</td>
						<td>
							<form method="GET" action="./editPrize" id={'editf-'+prizedata[items].id}>
								<input type="hidden" name="id" value={prizedata[items].id} />
								<button className="btn btn-warning">修改</button>
							</form>
							<form method="GET" action="./deletePrize" id={'remf-'+prizedata[items].id}>
								<input type="hidden" name="id" value={prizedata[items].id} />
								<button className="btn btn-danger">删除</button>
							</form>
						</td>
					</tr>
				);
			}
			var tbodyhtml = <tbody>{rows}</tbody>;
			var tablehtml = <table className="table table-bordered">{theadhtml}{tbodyhtml}</table>
			datahtml = tablehtml;
		}
		return(
			<div>
				<h4>奖品名单</h4>
				<ul className="nav nav-tabs" role="tablist">
					<li role="presentation" className="active"><a href="#">总览</a></li>
					<li role="presentation"><a href="./addPrize">新增奖品</a></li>
				</ul>
				<br />
				{notifyhtml}
				<div>
					{datahtml}
				</div>
			</div>
		);
	}
});

module.exports = prizeListHome;