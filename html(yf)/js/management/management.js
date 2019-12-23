var jsonDataUrl = "http://192.168.25.26";
function ExcelToJsonInit($filesBox) {
    var me = this;
    /*FileReader共有4种读取方法：
    1.readAsArrayBuffer(file)：将文件读取为ArrayBuffer。
    2.readAsBinaryString(file)：将文件读取为二进制字符串
    3.readAsDataURL(file)：将文件读取为Data URL
    4.readAsText(file, [encoding])：将文件读取为文本，encoding缺省值为'UTF-8'*/
    me.wb = "";//读取完成的数据
    me.rABS = false; //是否将文件读取为二进制字符串
    $($filesBox).on("change", function () {
        var $this = $(this);
        var thisUrl = $this.data("url");
        var thisDeleteUrl = $this.data("deleteurl");
        me.Importf(this, thisUrl, thisDeleteUrl);
    });
}

ExcelToJsonInit.prototype = {
    Importf: function (obj, thisUrl, thisDeleteUrl) {//导入
        if (!obj.files) {
            return;
        }
        var me = this;
        var f = obj.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            if (me.rABS) {
                me.wb = XLSX.read(btoa(me.FixData(data)), {//手动转化
                    type: 'base64'
                });
            } else {
                me.wb = XLSX.read(data, {
                    type: 'binary'
                });
            }
            var jsonData = XLSX.utils.sheet_to_json(me.wb.Sheets[me.wb.SheetNames[0]]);
            var sortNum;
            for (var i = 0; i < jsonData.length; i++) {
                var staffData = jsonData[i];
                if (staffData.id < 10) {
                    sortNum = "00" + staffData.id
                } else if(staffData.id >= 10 && staffData.id < 100){
                    sortNum = "0" + staffData.id
                } else{
                    sortNum = staffData.id
                }
                me.PostData(jsonDataUrl + ":" + thisUrl, {
                    id: staffData.id ? staffData.id : "",
                    staffName: staffData.staffName ? staffData.staffName : "",
                    staffDepartment: staffData.staffDepartment ? staffData.staffDepartment : "",
                    staffCompany: staffData.staffCompany ? staffData.staffCompany : "",
                    staffHead: staffData.staffHead ? staffData.staffHead : "",
                    staffClass: staffData.staffClass ? staffData.staffClass : "",
                    staffSort: sortNum
                }, function (data) {
                    me.DataRender(data, ".table-staff tbody");
                });
            }
            me.GetData(jsonDataUrl + ":" + thisDeleteUrl + "?_sort=staffSort", "", function (data) {
                for (var i = 0; i < data.length; i++) {
                    var deletData = data[i];
                    me.DeleteData(jsonDataUrl + ":" + thisDeleteUrl + "/", deletData.id);
                }
            });
        };
        if (me.rABS) {
            reader.readAsArrayBuffer(f);
        } else {
            reader.readAsBinaryString(f);
        }
    },
    FixData: function (data) { //文件流转BinaryString
        var o = "",
            l = 0,
            w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    },
    GetData: function (getUrl, getData, callback) {
        $.ajax({
            url: getUrl,
            data: getData,
            type: "get",
            success: function (data) {
                callback && callback(data);
            }
        });
    },
    PostData: function (postUrl, postData, callback) {
        $.ajax({
            url: postUrl,
            data: postData,
            type: "post",
            success: function (data) {
                callback && callback(data);
            }
        });
    },
    DeleteData: function (deleteUrl, deleteData, callback) {
        $.ajax({
            url: deleteUrl + deleteData,
            type: "delete",
            success: function () {
                callback && callback();
            }
        });
    },
    EditData: function (editUrl, editData, callback) {
        $.ajax({
            url: editUrl,
            data: editData,
            type: "put",
            success: function (data) {
                callback && callback(data);
            }
        });
    },
    DataRender: function (data, dataBoxClass) {
        var staffHtml = '<tr>' +
            '<td><input type="checkbox" id="' + data.id + '"></td>' +
            '<td>' + data.id + '-' + data.staffName + '-' + data.staffDepartment + '-' + data.staffCompany + '</td>' +
            '<td>' + data.staffHead + '</td>' +
            '<td>' + data.staffClass + '</td>' +
            //'<td><a href="javascript:;" class="staffEdit" data-sid="' + data.id + '">修改</a></td>' +
            '</tr>';
        $(dataBoxClass).append(staffHtml);
    }
};
