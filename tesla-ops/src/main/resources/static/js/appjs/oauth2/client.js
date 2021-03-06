var prefix = "/sys/oauth2";
$(function() {
	load();
});

function load() {
	$('#oauth2Table')
			.bootstrapTable(
					{
						method : 'get',
						url : prefix + "/listClient",
						iconSize : 'outline',
						toolbar : '#exampleToolbar',
						striped : true,
						dataType : "json",
						pagination : true,
						singleSelect : false,
						pageSize : 10,
						pageNumber : 1,
						showColumns : false,
						sidePagination : "server",
						queryParams : function(params) {
							return {
								limit : params.limit,
								offset : params.offset
							};
						},
						columns : [
								{
									checkbox : true
								},
								{
									field : 'clientId',
									title : 'Id'
								},
								{
									field : 'name',
									title : '客户端名称'
								},
								{
									field : 'clientSecret',
									title : '安全码'
								},
								{
									field : 'redirectUri',
									title : '重定向URL'
								},
								{
									field : 'scope',
									title : '权限范围'
								},
								{
									field : 'grantTypes',
									title : '授权类型'
								},
								{
									field : 'accessTokenValidity',
									title : 'Access有效时长',
									resetWidth : 100
								},
								{
									field : 'refreshTokenValidity',
									title : 'Refresh有效时长',
									resetWidth : 100
								},
								{
									field : 'trusted',
									title : '信任',
									formatter : function(value, row, index) {
										if (value) {
											return "是";
										} else {
											return "否"
										}
									}
								},
								{
									title : '操作',
									field : 'clientId',
									align : 'center',
									formatter : function(value, row, index) {
										var e = '<a class="btn btn-primary btn-sm '
												+ s_edit_h
												+ '" href="#" mce_href="#" title="编辑" onclick="edit(\''
												+ row.clientId
												+ '\')"><i class="fa fa-edit"></i></a> ';
										var d = '<a class="btn btn-warning btn-sm" href="#" title="删除"  mce_href="#" onclick="remove(\''
												+ row.clientId
												+ '\')"><i class="fa fa-remove"></i></a> ';
										return e + d;
									}
								} ]
					});
}
function reLoad() {
	$('#oauth2Table').bootstrapTable('refresh');
}

function add() {
	layer.open({
		type : 2,
		title : '添加Oauth2客户端',
		maxmin : true,
		shadeClose : true,
		area : [ '1100px', '500px' ],
		content : prefix + '/add'
	});
}
function remove(id) {
	layer.confirm('确定要删除选中的记录？', {
		btn : [ '确定', '取消' ]
	}, function() {
		$.ajax({
			url : prefix + "/remove",
			type : "post",
			data : {
				'id' : id
			},
			success : function(r) {
				if (r.code === 0) {
					layer.msg("删除成功");
					reLoad();
				} else {
					layer.msg(r.msg);
				}
			}
		});
	})

}
function edit(id) {
	layer.open({
		type : 2,
		title : '修改Oauth2客户端',
		maxmin : true,
		shadeClose : true,
		area : [ '1100px', '500px' ],
		content : prefix + '/edit/' + id
	});
}
function batchRemove() {
	var rows = $('#oauth2Table').bootstrapTable('getSelections'); // 返回所有选择的行，当没有选择的记录时，返回一个空数组
	if (rows.length == 0) {
		layer.msg("请选择要删除的数据");
		return;
	}
	layer.confirm("确认要删除选中的'" + rows.length + "'条数据吗?", {
		btn : [ '确定', '取消' ]
	}, function() {
		var ids = new Array();
		$.each(rows, function(i, row) {
			ids[i] = row['clientId'];
		});
		console.log(ids);
		$.ajax({
			type : 'POST',
			data : {
				"ids" : ids
			},
			url : prefix + '/batchRemove',
			success : function(r) {
				if (r.code == 0) {
					layer.msg(r.msg);
					reLoad();
				} else {
					layer.msg(r.msg);
				}
			}
		});
	}, function() {
	});
}