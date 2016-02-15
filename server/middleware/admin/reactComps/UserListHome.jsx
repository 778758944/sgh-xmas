/** @jsx React.DOM */
/**
# SGH 2015 Christmas Game - Server
# React Modules
# NOTE: These components are linked with Bootstrap
*/

/** Page: Admin Content Home Page JSX **/

var React = require('react');

var UserListHome = React.createClass({
	getInitialState:function(){
		return {tabOnFocus:'overview'}
	},
	changeFocus:function(focusName){
		console.log('clicked!');
		this.setState({tabOnFocus:focusName});
	},
	debugAlert:function(){
		console.log('onClick still works');
	},
	getTabs:function(){
		var navObj = [{name:'overview',caption:'总览'}];
		if(this.props.prizelist){
			//Push the name of prizes into the navObj for navigation rendering
			var items = this.props.prizelist;
			for(var item in items){
				navObj.push({name:items[item].id,caption:items[item].name});
			}
		}
		var onFocusPage = this.props.onFocusPage;
		if(!onFocusPage){
			onFocusPage = 'overview';
		}
		//Generate nav HTML here...
		for(var item in navObj){
			if(navObj[item].name == onFocusPage){
				navObj[item].active = true;
			}
		}
		var navHTML = [];
		for(var item in navObj){
			if(navObj[item].active){
				if(navObj[item].name === 'overview'){
					navHTML.push(<li role="presentation" className="active" key={navObj[item].name}><a href="./winners">{navObj[item].caption}</a></li>);
				}else{
					navHTML.push(<li role="presentation" className="active" key={navObj[item].name}><a href={"./winners?prizeid="+navObj[item].name}>{navObj[item].caption}</a></li>);
				}
			}else{
				if(navObj[item].name === 'overview'){
					navHTML.push(<li role="presentation" key={navObj[item].name}><a href="./winners">{navObj[item].caption}</a></li>);
				}else{
					navHTML.push(<li role="presentation" key={navObj[item].name}><a href={"./winners?prizeid="+navObj[item].name}>{navObj[item].caption}</a></li>);
				}
			}
		}
		return navHTML;
	},
	getErrCode:function(errCode){
		var notifyhtml = [];
		if(errCode){
			console.log('called');
			var message = "";
			if(errCode != 0){
				switch(errCode){
					case 1:  message="服务器无法获取数据。请重试。";break;
					case 10: message="服务器没有登陆任何要抽奖的奖品。请先建立一个，然后再试。";break;
					default: message="发生不明错误。请重试。";break;
				}
			}
			console.log(message);
			notifyhtml.push(
				<div className="alert alert-danger">
					<strong>发生错误！</strong> {message}
				</div>
			);
		}
		return notifyhtml;
	},
	getExportTab:function(errCode){
		console.log('GET run');
		var exportsHTML = [];
		if(!errCode && this.props.prizedata.length != 0){
			exportsHTML.push(
				<form method="GET" action="./exportToExcel">
					<input type="hidden" name="prizeid" value={this.props.onFocusPage} />
					<button type="submit" className="btn btn-success">导出至Excel 2007活页本(XLSX)</button>
				</form>
			);
		}
		return exportsHTML;
	},
	parseResult:function(propsobj){
		//Parse Required information here and prints friendly note if user did not enter anything in appropriate fields
		var obj = [];
		var processResult = function(string){
			if(!string){
				return '--未填写--'
			}else{
				return string
			}
		}
		if(propsobj){
			for(var i=0;i<propsobj.length;i++){
				var item = {};
				item.winnername = processResult(propsobj[i].winnername);
				item.tel = processResult(propsobj[i].tel);
				item.address = processResult(propsobj[i].address);
				item.prize = propsobj[i].name; //Prizename, this must always be here?
				obj.push(item);
			}
		}
		return obj;
	},
	render:function(){
		var tabhtml = this.getTabs();
		var errhtml = this.getErrCode(this.props.errCode);
		var prizedata = this.parseResult(this.props.prizedata);
		var datahtml = [];
		var exportOpts = this.getExportTab(this.props.errCode);
		console.log('prizedata-final'+JSON.stringify(prizedata));
		if(!prizedata){
			datahtml.push(<pre>数据库里没有返回任何项目</pre>);
		}else if(prizedata.length == 0){
			datahtml.push(<pre>数据库里没有任何项目</pre>)
		}else{
			var theadhtml = 
				<thead>
					<tr>
						<th>#</th>
						<th>姓名</th>
						<th>电话号码</th>
						<th>住址</th>
						<th>得奖物品</th>
					</tr>
				</thead>;
			var rows = [];
			for(var items in prizedata){
				rows.push(
					<tr>
						<th scope="row" key={prizedata[items].winnername}>{parseInt(items)+1}</th>
						<td>{prizedata[items].winnername}</td>
						<td>{prizedata[items].tel}</td>
						<td>{prizedata[items].address}</td>
						<td>{prizedata[items].prize}</td>
					</tr>
				);
			}
			var tbodyhtml = <tbody>{rows}</tbody>;
			var tablehtml = <table className="table table-bordered">{theadhtml}{tbodyhtml}</table>
			datahtml = tablehtml;
		}
		return(
			<div>
				<h4>用户中奖名单</h4>
				<ul className="nav nav-tabs" role="tablist">
					{tabhtml}
				</ul>
				<br />
				<div>
					{errhtml}
				</div>
				<div className="col-xs-12 col-sm-12 col-md-12">
					{exportOpts}
				</div>
				<div>
					{datahtml}
				</div>
			</div>
		);
	}
});

module.exports = UserListHome;