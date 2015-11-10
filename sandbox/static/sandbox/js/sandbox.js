
///// parser ////

function Parser(script) {
    this.script = script.trim();
    this.code_gen = null;
    this.code_gen_script = "";
    this.codes = script.split("\n");
    this.opt = {};
    this.lp=0;
    this.speed=400;


	this.code_gen_script = "function* runner() {\r\n";
	for ( i=0 ; i < this.codes.length ; i++ ) {
		this.code_gen_script += this.codes[i]+"\r\n";
		this.code_gen_script += "yield "+i+";\r\n";
	}
	this.code_gen_script += "}\r\n";

	console.log(this.code_gen_script);
}

Parser.prototype.start = function (opt) {
    this.opt = opt;
    this.lp = 0;

    console.log("START!");

    $('#screen tr td').text('').addClass('unset');

    if ( this.codes.length == 0 || ( this.codes.length == 1 && this.codes[0] == "" ) ) {
        this.opt.error('저런.... 코드가 없다곰!');
        this.opt.done();
    } else {
        var self=this;
	try{
		eval(this.code_gen_script);
	} catch(e) {
		this.opt.error(e);
		this.opt.done();
		console.log('error');
		return;
	}
	this.code_gen = runner();

        $('.lineno').eq(0).addClass('lineselect');
        setTimeout(function(){self.step()}, this.speed);
    }
}


Parser.prototype.run = function (opt) {
    this.opt = opt;
    this.lp = 0;

    console.log("RUN!");

    $('#screen tr td').text('').addClass('unset');

    if ( this.codes.length == 0 || ( this.codes.length == 1 && this.codes[0] == "" ) ) {
        this.opt.error('저런.... 코드가 없다곰!');
        this.opt.done();
    } else {
        var self=this;
        //$('.lineno').eq(0).addClass('lineselect');
        //setTimeout(function(){self.step()}, this.speed);
        try {
            eval(this.script);

            this.opt.success();
            this.opt.done();
            console.log('complete');

        } catch(e) {
            this.opt.error(e);
            this.opt.done();
            console.log('error');
        }
    }
}

Parser.prototype.step = function() {

    try {
	var ex=this.code_gen.next();

        if ( ex.done ) {
            // run completed
            this.opt.success();
            this.opt.done();
            console.log('complete');

            $('.lineno').removeClass('lineselect')
        } else {
            // regist next step;
	    this.lp=ex.value;

            $('.lineno').removeClass('lineselect');
            $('.lineno').eq(ex.value).addClass('lineselect');

            var self=this;
            setTimeout(function(){self.step()}, this.speed);
        }
    } catch(e) {
        this.opt.error("라인 "+ (this.lp+2)+" : "+e);
        this.opt.done();
        console.log('error');

        $('.lineno').removeClass('lineselect');
    }
}


///////// UI ////////////
function init_sandbox() {
    var screen_width=8;
    var screen_height=8;
    var script="";

    if ( typeof(localStorage['sandbox_width']) != "undefined" ) {
        screen_width = localStorage['sandbox_width'];
    }
    if ( typeof(localStorage['sandbox_height']) != "undefined" ) {
        screen_height = localStorage['sandbox_height'];
    }

    if ( typeof(localStorage['sandbox_script']) != "undefined" ) {
        script = localStorage['sandbox_script'];
    } else {
        script = "set_point(0,0);\nset_point(1,1);\nset_point(2,2);";
    }

    $('#code').val(script);
    $('#screen_width').val(screen_width);
    $('#screen_height').val(screen_height);

    $("#code").linedtextarea();
    _ui_change_screen();
}

function execute_sandbox(is_slow) {

    $('#result-box').empty();

    $('#runit').addClass('disabled');
    $('#code').addClass('disabled');

    var script = $('#code').val();
    var parser = new Parser(script);

    localStorage['sandbox_script'] = script;

    if ( is_slow )
        parser.start({
            error:function(err) {
                $('#error #descript').text(err);
                display_error(err);
            },
            success:function() {
                $('#complete').slideDown();
                display_success();
            },
            done:function() {
                $('#code').removeClass('disabled');
                $('#runit').removeClass('disabled');
            }
        });
    else
        parser.run({
            error:function(err) {
                $('#error #descript').text(err);
                display_error(err);
            },
            success:function() {
                $('#complete').slideDown();
                display_success();
            },
            done:function() {
                $('#code').removeClass('disabled');
                $('#runit').removeClass('disabled');
            }
        });

}

function display_error(err) {
    $('#result-box').append(''+
        '<div class="alert alert-danger" role="alert" id="error">'+
        '    <button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
        '        <span aria-hidden="true">&times;</span>'+
        '    </button>'+
        '    <strong>에러곰!</strong>'+
        '    <span id="descript">'+err+'</span>'+
        '</div>');

};

function display_success() {
    $('#result-box').append(''+
        '<div class="alert alert-success" role="alert" id="complete">'+
        '    <button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
        '        <span aria-hidden="true">&times;</span>'+
        '    </button>'+
        '    <strong>성공!</strong>'+
        '    <span id="descript">아름답게도 처리가 성공했다곰!</span>'+
        '</div> ');
};

function _ui_change_screen() {
    var table=$('#screen');
    var width=$('#screen_width').val();
    var height=$('#screen_height').val();
    table.empty();

    localStorage['sandbox_width'] = width;
    localStorage['sandbox_height'] = height;

    var head = $("<tr></tr>");
    head.append("<th><span class='glyphicon glyphicon-unchecked'></span></th>");

    for ( i=0 ; i < width ; i++ ) {
        head.append("<th>"+(i)+"</th>");
    }
    table.append(head);

    for ( i=0 ; i < height ; i++ ) {
        var row = $("<tr></tr>");
        row.append("<th>"+(i)+"</th>");

        for ( j=0 ; j < width ; j++ ) {
            row.append("<td class='unset'></td>");
        }

        table.append(row);

    }

}

///// api /////
function set_point(x, y) {
    var width=$('#screen_width').val();
    var height=$('#screen_height').val();

    if ( x < 0 )
        throw "set_point(x,y)에서 x는 0보다 커야 한다곰!";
    if ( x >= width )
        throw "set_point(x,y)에서 x는 "+width+"보다 작아야 한다곰!";
    if ( y < 0 )
        throw "set_point(x,y)에서 y는 0보다 커야 한다곰!";
    if ( y >= width )
        throw "set_point(x,y)에서 y는 "+height+"보다 작아야 한다곰!";

    var target=$('#screen tr').eq(y+1).find('td').eq(x);
    target.html('<span class="glyphicon glyphicon-unchecked"></span>');
    target.removeClass('unset');
}

///// on load /////
$(function() {


    $('#change_screen').on('click', function(e) {
        e.preventDefault();
        _ui_change_screen();
    });

    $('#runit').on('click', function(e) {
        execute_sandbox(false);
    });

    $('#slow').on('click', function(e) {
        execute_sandbox(true);
    })


    init_sandbox();
});
