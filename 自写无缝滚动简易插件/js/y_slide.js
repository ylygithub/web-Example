/**
 * Created by apple on 15/6/18.
 */
var imgdata=[
        {src:"img/goods-1.jpg"},
        {src:"img/goods-2.jpg"},
        {src:"img/goods-3.jpg"},
        {src:"img/goods-4.jpg"},
        {src:"img/1.large.jpg"}
    ]

;(function($){
    var Yslide=function(ele,options){
        var self=this;
        this.ele=ele;
        this.animateCD=true;
        this.index=0;

        this.setting={
            width:520,
            height:280,
            auto:true,
            delay:2000,
            speed:1000,
            type:"top"

        };

        $.extend(this.setting,options);

        this.init();
        this.control()

    };
    Yslide.prototype={

        setCss:function(){
            this.ele.css({
                width:this.setting.width,
                height:this.setting.height,
                overflow:"hidden",
                position:"relative"

            });

        },
        setHtml:function(){
            var slideItem='';
            var slidebox='<div class="slide-list"><ul class="clearfix"></ul></div>';
            this.ele.append(slidebox);
            var slideListUL=this.ele.find(".slide-list ul");
            if(this.setting.type==="top"){
                slideListUL.css({marginTop:-this.setting.height});
            }else{
                slideListUL.width(this.setting.width*(imgdata.length+2));
                slideListUL.css({marginLeft:-this.setting.width});
            }

            $.each(imgdata,function(i,obj){
                slideItem+='<li class="slide-item">'+
                        '<img src='+obj.src+' alt=""/>'+
                    '</li>';
            });
            slideListUL.append(slideItem);
            $(".slide-item").css({width:this.setting.width,height:this.setting.height});
            var firstImg=this.ele.find(".slide-item").first();
            var lastImg=this.ele.find(".slide-item").last();
            slideListUL.append(firstImg.clone());
            slideListUL.prepend(lastImg.clone());


            var pagination='';
            var paginationBox='<div class="pagination"><ul class="clearfix"></ul></div>';
            this.ele.append(paginationBox);
            var pagintionUl=this.ele.find(".pagination ul");
            for(var i=0;i<imgdata.length;i++){
                pagination+='<li></li>';
            }
            pagintionUl.append(pagination);
            pagintionUl.find("li:first").addClass("curr");

            this.ele.append('<div class="btn next"></div><div class="btn prev"></div>');

        },
        animate:function(offset){
            var _this=this;
            var ele=this.ele;
            var slidelistUl=this.slidelistUl;

            var itemLen=ele.find(".slide-item").length;
            var minL=(itemLen-2)*this.setting.width;
            var maxL=this.setting.width;
            var minT=(itemLen-2)*this.setting.height;
            var maxT=this.setting.height;
            if(this.setting.type==="top"){
                if(_this.animateCD){
                    _this.animateCD=false;
                    var marginT = parseInt(slidelistUl.css("marginTop"))+offset;
                    slidelistUl.animate({
                        marginTop: marginT
                    }, _this.setting.speed, function () {
                        _this.animateCD = true;
                        if (marginT < -minT) {
                            slidelistUl.css({marginTop: -maxT})
                        }
                        if (marginT > -maxT) {
                            slidelistUl.css({marginTop: -minT})
                        }

                    });
                }
            }else if(this.setting.type==="left"){
                if(_this.animateCD){
                    _this.animateCD=false;
                    var marginL = parseInt(slidelistUl.css("marginLeft"))+offset;
                    slidelistUl.animate({
                        marginLeft: marginL
                    }, _this.setting.speed, function () {
                        _this.animateCD = true;
                        if (marginL < -minL) {
                            slidelistUl.css({marginLeft: -maxL})
                        }
                        if (marginL > -maxL) {
                            slidelistUl.css({marginLeft: -minL})
                        }

                    });
                }
            }



        },
        move:function(){
            var _this=this;
            var pageLi=this.pageLi;
            var pageLen=pageLi.length;
            if(_this.animateCD){
                if (_this.index == pageLen-1) {
                    _this.index = 0;
                } else {
                    _this.index += 1;
                }
                pageLi.eq(_this.index).addClass("curr").siblings().removeClass("curr");
                if(_this.setting.type==="left"){
                    _this.animate(-_this.setting.width);
                }else if(_this.setting.type==="top"){
                    _this.animate(-_this.setting.height);
                }

            }
        },
        btnClick:function(){
            var _this=this;
            var nextBtn=this.ele.find(".btn.next");
            var prevBtn=this.ele.find(".btn.prev");
            var pageLi=this.pageLi;
            var pageLen=pageLi.length;
            nextBtn.on("click",function(){
                 _this.move()
            });
            prevBtn.on("click",function(){
                    if(_this.animateCD){
                    if (_this.index == 0) {
                        _this.index = pageLen-1;
                    } else {
                        _this.index -= 1;
                    }
                    pageLi.eq(_this.index).addClass("curr").siblings().removeClass("curr");
                    if(_this.setting.type==="left"){
                        _this.animate(_this.setting.width);
                    }else if(_this.setting.type==="top"){
                        _this.animate(_this.setting.height);
                    }

                }
            })

        },
        pageClick:function(){
            var pageLi= this.pageLi;
            var offset;
            var _this=this;
            pageLi.each(function(i,obj){
                $(obj).on("click",function(){
                    if ($(obj).hasClass("curr")) {
                        return;
                    } else {
                        if (_this.animateCD) {
                            $(obj).addClass("curr").siblings().removeClass("curr");
                            var currIndex = i;

                            if(_this.setting.type==="left"){
                               offset = (-_this.setting.width) * (currIndex - _this.index);
                                _this.index = currIndex;
                                _this.animate(offset);
                            }else if(_this.setting.type==="top"){
                                offset = (-_this.setting.height) * (currIndex - _this.index);
                                _this.index = currIndex;
                                _this.animate(offset);
                            }


                        }
                    }
                })
            })
        },
        autoPlay:function(){
            var timer;
            if(this.setting.auto){
                var _this=this;
                function play(){
                    timer=setInterval(function(){
                        _this.move()
                    },_this.setting.delay)
                }
                play();

                this.ele.on({mouseover:function(){
                    clearInterval(timer)
                },mouseout:function(){
                    play()
                }
                });
            }

        },
        init:function(){

            this.setCss();
            this.setHtml();
            this.slidelistUl=this.ele.find(".slide-list ul");
            this.pageLi=this.ele.find(".pagination li");

        },
        control:function(){
            this.btnClick();
            this.pageClick();
            this.autoPlay();
        }



    };
    Yslide.newSlide=function(eles,options){
        var _this=this;
        eles.each(function(i,obj){
            new _this($(obj),options);

        })
    };
    window["Y_silde"]=Yslide;

})(jQuery);























/*
function Yslide(ele){

}
Yslide.prototype={

};
Yslide.init=function(eles){
    var _this=this;
    eles.each(function(i,obj){
        new _this($(obj));

        console.log($(obj))
    })
}*/
