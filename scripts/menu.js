var menu = {} || menu;

menu.drawTable = function(){
    $.ajax({
        url : "http://localhost:3000/menu",
        method : "GET",
        dataType : "json",
        success : function(data){
            $('#tbmenu').empty();
            $.each(data, function(i, v){
                $('#tbmenu').append(
                    "<tr>"+
                        "<td>"+ (i+1) +"</td>"+
                        "<td>" + v.Name + "</td>"+
                        "<td><img src='"+ v.Avatar +"' width='60px' height='50px' /></td>"+
                        "<td>"+ v.Price +" VND</td>"+
                        "<td>"+
                            "<a href='javascript:;' title='Edit this item' onclick='menu.get("+ v.id +
                                ")'><i class='fa fa-edit' style='font-size:25px; color:green; margin:5px;'></i></a> " +
                            "<a href='javascript:;' title='Remove this item' onclick='menu.delete("+ v.id +
                                ")' ><i class='fa fa-trash' style='font-size:25px; color:red; margin:5px;'></i></a>" +
                        "</td>"+
                    "</tr>"
                );
            });
            $('#mytable').DataTable({
                destroy: true,
                columnDefs : [
                    {
                        "targets": [2,4],
                        "orderable" : false
                    }
                    
                ]
            });
        }
    });
};

menu.openModal = function(){
    menu.reset();
    $('#addEditmenu').modal('show');
};

menu.save = function(){
    if($('#formAddEditmenu').valid()){
        if($('#id').val() == 0){
            var menuObj = {};
            menuObj.Name = $('#Name').val();
            menuObj.Avatar = $('#Avatar').val();
            menuObj.Price = $('#Price').val();
    
            $.ajax({
                url : "http://localhost:3000/menu",
                method : "POST",
                dataType : "json",
                contentType : "application/json",
                data : JSON.stringify(menuObj),
                success : function(data){
                    $('#addEditmenu').modal('hide');
                    menu.drawTable();
                }
            });
        }
        else{
            var menuObj = {};
            menuObj.Name = $('#Name').val();
            menuObj.Avatar = $('#Avatar').val();
            menuObj.Price = $('#Price').val();
            menuObj.id = $('#id').val();
    
            $.ajax({
                url : "http://localhost:3000/menu/" + menuObj.id,
                method : "PUT",
                dataType : "json",
                contentType : "application/json",
                data : JSON.stringify(menuObj),
                success : function(data){
                    $('#addEditmenu').modal('hide');
                    menu.drawTable();
                }
            });
        }
        
    }
};

menu.delete = function(id){
    bootbox.confirm({
        title: "Remove Item",
        message: "Do you want to remove this item?",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> No'
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Yes'
            }
        },
        callback: function (result) {
            if(result){
                $.ajax({
                    url : "http://localhost:3000/menu/" + id,
                    method: "DELETE",
                    dataType : "json",
                    success : function(data){
                        menu.drawTable();
                    }
                });
            }
        }
    });
};

menu.get = function(id){
    $.ajax({
        url : "http://localhost:3000/menu/" + id,
        method : "GET",
        dataType : "json",
        success : function(data){
            $('#Name').val(data.Name);
            $('#Avatar').val(data.Avatar);
            $('#showAvatar').attr('src', $('#Avatar').val());
            $('#Price').val(data.Price);
            $('#id').val(data.id);
            
            var validator = $( "#formAddEditmenu" ).validate();
            validator.resetForm();
            $('#addEditmenu').modal('show');
        }
    });
};

menu.uploadAvatar = function(input){
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#Avatar').val(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};

menu.reset = function(){
    $('#Name').val('');
    $('#Avatar').val('');
    $('#showAvatar').attr('src', '');
    $('#Price').val('');
    $('#id').val('0');
    var validator = $( "#formAddEditmenu" ).validate();
    validator.resetForm();
};

menu.init = function(){
    menu.drawTable();
};

$(document).ready(function(){
    menu.init();
});