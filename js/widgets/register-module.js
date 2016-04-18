define(['jquery', 'bootstrap', 'validate'], function(jquery, bootstrap, Validate) {
    //按热度推送感兴趣科目
    var subjectPost = (function() {
        $.ajax({
                url: '../php/register.php',
                type: 'GET',
                dataType: 'json',
                data: {
                    type: 'getSubjects'
                }
            })
            .done(function(result) {
                fillSubjects('[name="subjects[]"]', result);
            })
            .fail(function() {
                console.log("get subject error");
            })
            .always(function(result) {
                // console.log("complete");
            });

        function fillSubjects(selector, subjects) {
            $(selector).each(function(index, el) {
                var temp = subjects[index];
                if (temp) {
                    $(el).val(temp.subjectID);
                    $(el).parent().html('<input type="checkbox" name="subjects[]" value="' + temp.subjectID + '">' + temp.subjectName);
                }
            });
        }
    }());

    var validate = (function() {
        var pswdEl = $('#js_password');
        var validateOpt = {
            // debug: true,
            rules: {
                username: {
                    required: true,
                    minlength: {
                        param: 4
                    },
                    maxlength: {
                        param: 10
                    }
                },
                password: "required",
                repeatPassword: {
                    required: true,
                    equalTo: '#js_rgstPassword'
                }
            },
            messages: {
                username: {
                    required: "用户名不能为空",
                    minlength: jQuery.validator.format('至少需要 {0} 个字符'),
                    maxlength: jQuery.validator.format('请勿超过 {0} 个字符')
                },
                password: {
                    required: "密码不能为空"
                },
                repeatPassword: {
                    required: "密码不能为空",
                    equalTo: "两次输入的密码不一致"
                }
            },
            errorPlacement: function(error, element) {
                var group = element.parent('.form-group');
                //show message
                group.find('.help-block').text(error[0].innerText);
                //change status
                group.removeClass('has-success');
                group.addClass('has-error');
                group.find('.glyphicon').removeClass('glyphicon-ok');
                group.find('.glyphicon').addClass('glyphicon-remove');

            },
            success: function(lebel, element) {
                var group = $(element).parent('.form-group');
                group.removeClass('has-error');
                group.addClass('has-success');
                group.find('.glyphicon').removeClass('glyphicon-remove');
                group.find('.glyphicon').addClass('glyphicon-ok');
            },
            submitHandler: function(form) {
                console.log($(form).serialize());
                $.ajax({
                        url: '../php/register.php',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            type: 'register',
                            form: $(form).serialize()
                        }
                    })
                    .done(function(result) {
                        console.log("register success");
                        if (result.status == '0') {
                            $('#js_modal').modal();
                        } else if (result.status == '200') {
                            var noticeStr = '<p class="notice text-center">注册成功！</br>本页面将在3s后关闭！</p>';
                            $('.signup-form').html(noticeStr);
                            setTimeout(function() {
                                // window.close();
                            }, 3000);
                        }
                    })
                    .fail(function() {
                        console.log("register error");
                    })
                    .always(function(result) {
                        console.log(result);
                        // console.log("complete");
                    });
            }
        };

        $('#registerForm').validate(validateOpt);
    }());
});
