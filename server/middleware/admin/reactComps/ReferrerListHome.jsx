/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
# NOTE: These components are linked with Bootstrap
*/

/** Page: Admin Content Home Page JSX **/

var React = require('react');

var referrerListHome = React.createClass({
	getInitialState:function(){
		return {}
	},
	getSuccess:function(){
		if(this.props.success){
			var ttl = "";
			var msg = "";
			switch(this.props.success){
				case 1 	: ttl="新增成功";msg="新的推荐人信息已经登陆到服务器上。";break;
				case 2  : ttl="修改成功";msg="推荐人信息已经更新。";break;
				case 3  : ttl="删除成功";msg="有关推荐人已经被删除。";break;
			}
			return(
				<div className="alert alert-success" role="alert">
					<strong>{ttl}</strong> {msg} 
				</div>
			);
		}
	},
	getErrCode:function(){
		var errHTML = [];
		if(this.props.errCode){
			var message = "";
			switch(this.props.errCode){
				case 1 	: message="服务器连线错误。请重试";break;
				// case 10	: message="微信公众号设定获取错误或者未登录。请检查微信公众号设定";break;
				// case 11	: message="无法获取推荐人二维码设定或者未登录。请检查。";break;
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
	getExportTab:function(errCode){
		var exportsHTML = [];
		if(!errCode && this.props.data.length != 0){
			exportsHTML.push(
				<form method="GET" action="./exportReferrerToExcel">
					<button type="submit" className="btn btn-success">导出至Excel 2007活页本(XLSX)</button>
				</form>
			);
		}
		return exportsHTML;
	},
	parseResult: function(dataArr,propName){
		//Adds properties to an object with default value, and pass-em back.
		var newObjArray = [];
		var defaultVal = 0;
		for(var i=0;i<dataArr.length;i++){
			var currentObj = dataArr[i];
			if(typeof(currentObj[propName]) === 'undefined'){
				currentObj[propName] = defaultVal;
				newObjArray.push(currentObj);
			}else{
				//State exists, push back to the array...
				newObjArray.push(currentObj);
			}
		}
		return newObjArray;
	},
	getNavTab:function(rights){
		var navLists = [];
		if(rights == 1){
			navLists.push(
				<ul className="nav nav-tabs" role="tablist">
					<li role="presentation" className="active"><a href="#">总览</a></li>
					<li role="presentation"><a href="./addReferrer">新增推荐人</a></li>
				</ul>
			);
		}else{
			navLists.push(
				<ul className="nav nav-tabs" role="tablist">
					<li role="presentation" className="active"><a href="#">总览</a></li>
				</ul>
			);
		}
		return navLists;
	},
	render:function(){
		var navHTML = this.getNavTab(this.props.rights);
		var successHTML = this.getSuccess();
		var errorHTML = this.getErrCode();
		var referrerData = this.parseResult(this.props.data,'count');
		var exportsHTML = this.getExportTab(this.props.errCode);
		// var wxqrhtml = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=';
		var datahtml = [];
		if(!referrerData){
			datahtml.push(<pre>数据库里没有注册任何推荐人</pre>);
		}else if(referrerData.length == 0){
			datahtml.push(<pre>数据库里没有注册任何推荐人</pre>)
		}else if(this.props.rights == 1){
			var theadhtml = 
				<thead>
					<tr>
						<th>#</th>
						<th>推荐人姓名</th>
						<th>访问人数</th>
						<th>二维码图片链接</th>
						<th>操作</th>
					</tr>
				</thead>;
			var rows = [];
			for(var items in referrerData){
				rows.push(
					<tr key={'referrerData'+items}>
						<th scope="row">{parseInt(items)+1}</th>
						<td>{referrerData[items].name}</td>
						<td>{referrerData[items].count} 人</td>
						<td><a href={'./genQRCode?refid='+referrerData[items].id} target='_blank'><button type="button" className="btn btn-info">点我显示二维码</button></a></td>
						<td>
							<form method="GET" action="./editReferrer" id={'editf-'+referrerData[items].id}>
								<input type="hidden" name="id" value={referrerData[items].id} />
								<button className="btn btn-warning">修改</button>
							</form>
							<form method="GET" action="./deleteReferrer" id={'remf-'+referrerData[items].id}>
								<input type="hidden" name="id" value={referrerData[items].id} />
								<button className="btn btn-danger">删除</button>
							</form>
						</td>
					</tr>
				);
			}
			var tbodyhtml = <tbody>{rows}</tbody>;
			var tablehtml = <table className="table table-bordered">{theadhtml}{tbodyhtml}</table>
			datahtml = tablehtml;
		}else{
			var theadhtml = 
				<thead>
					<tr>
						<th>#</th>
						<th>推荐人姓名</th>
						<th>访问人数</th>
					</tr>
				</thead>;
			var rows = [];
			for(var items in referrerData){
				rows.push(
					<tr key={'referrerData'+referrerData[items].name}>
						<th scope="row">{parseInt(items)+1}</th>
						<td>{referrerData[items].name}</td>
						<td>{referrerData[items].count} 人</td>
					</tr>
				);
			}
			var tbodyhtml = <tbody>{rows}</tbody>;
			var tablehtml = <table className="table table-bordered">{theadhtml}{tbodyhtml}</table>
			datahtml = tablehtml;
		}
		return(
			<div className="col-xs-12 col-sm-12 col-md-12">
				<h4>推荐人名单</h4>
				{navHTML}
				<br />
				<div className="col-xs-12 col-sm-12 col-md-12">
					{errorHTML}
				</div>
				<div className="col-xs-12 col-sm-12 col-md-12">
					{successHTML}
				</div>
				<div className="col-xs-12 col-sm-12 col-md-12">
					{exportsHTML}
				</div>
				<div>
					{datahtml}
				</div>
			</div>
		);
	}
});

module.exports = referrerListHome;