$(function() {

    $.widget( "custom.GridCreater",{
      options: {
        container : window.innerWidth,
        gridType: 9,
        //size : 30,
        actStr : 0,
        count : 0,
        isRefresh : false,
        isInit : true,
        hintedArray : [],
      },
      
      // the constructor
      _create: function() {
          var self = $(this.element),
              gridBlock  = this.options.gridType,
              backButton = $('.backToDshb'),
              hintButton = $('.hintBtn');
          
          var containerWidth = this.options.container;
  
          var containerCss = {'width': containerWidth +'px', 'height' : containerWidth+'px' , 'background-size' : containerWidth+'px'};
          self.css(containerCss);

          $('#actualImage').css(containerCss);

          $('.newGame').click(function(){
            self.startNewGame();
          });

          $('.myPicGame').click(function() {
            self.myPicGameView();
          })

          var widthHeight = ( containerWidth/Math.sqrt( gridBlock ) ) - 2;
          var block = '<div class="smallBlock"><div class="block"></div></div>';
          
          for(var i=0; i < gridBlock ; i++){
            self.append(block);
          }

          backButton.click(function() {
            self.backToDashboard();
          })
          
          $('.smallBlock').css({
            'width': widthHeight +'px', 
            'height' : widthHeight+'px'
           })

          $('.block').css({
            'background-size' : containerWidth+'px '+containerWidth+'px'
           })

          this.setBlockPosition();
          this.options.count = 0;

          self = this;
          $('.restart').click( function(){ self.refresh(); });
          hintButton.click( function(){ self.hintImage(); });
          $('.showImg').click( function(){ self.showImage(); });
          $('#moves').text( this.options.count );
       
      },

      myPicGameView : function () {
        var self = this,
            uploadMyPicBtn = $('.uploadMyPic button');

        $(".headerBox").show();
        $("#dashboard").hide();
        $(".uploadMyPic").show();

        if(!self.options.isInit){
          self.refresh();
        }

        uploadMyPicBtn.click(function(){
          var imgData = localStorage.getItem('img');
          $(".uploadMyPic").hide();

          var styleText = "body .block{background-image: url(" + imgData + ")}";
          $('#dyStyle').text(styleText);
          
          /*$('.block').css({
              'background-image': 'url(' + imgData + ')'
            });*/

          $(".gameMode").show();
          $("#actualImage").hide();
        })

        $('#FileUpload').change( function(event) {
          self.SetAndRenderImage(event)
          uploadMyPicBtn.show();
        })
      },

      SetAndRenderImage : function(eve) {
        var files = eve.target.files;

        for (var i = 0, f; f = files[i]; i++) {

          if (!f.type.match('image.*')) {
            continue;
          }

          var reader = new FileReader();
          reader.onload = (function(theFile) {
            return function(e) {

              var span = document.createElement('span');
              span.innerHTML = ['<img class="thumb" src="', e.target.result,
                                '" title="', escape(theFile.name), '"/>'].join('');
                
              document.getElementById('list').insertBefore(span, null);
              localStorage.setItem('img', e.target.result);
            };
          })(f);
          reader.readAsDataURL(f);
        }
      },

      startNewGame : function() {
        if(!this.options.isInit){
          this.refresh();
        }
        this.options.isInit = false;
        $(".gameMode").show();
        $("#actualImage").hide();
        $("#dashboard").hide();
        var self = this;
      },

      backToDashboard : function() {
        var uploadMyPicView = $(".uploadMyPic");

        $(".gameMode").hide();
        $("#dashboard").show();
        uploadMyPicView.hide(); 
      },

      hintImage : function() {
        var allBlock = $('.block'),
          gridType = this.options.gridType,
          actualArray = null,
          isMatch = false,
          tmpRandomNum = Math.floor(Math.random() * gridType ),
          dummyArray = this.options.hintedArray;

          $(allBlock).removeClass("hintBrd");
          countAndShowHint( tmpRandomNum );

          function countAndShowHint (argument) {
            var actEleStr = $( allBlock[ tmpRandomNum ] ).data('indexA') -1;

            if( allBlock[ tmpRandomNum ] != allBlock[ actEleStr ] ){
              $(allBlock[ tmpRandomNum ] ).addClass("hintBrd");
              $(allBlock[ actEleStr ] ).addClass("hintBrd");
            }else{
              tmpRandomNum = Math.floor(Math.random() * gridType )
              countAndShowHint( tmpRandomNum );
            }
          }
      },

      showImage : function() {
        $("#actualImage").show();
        $("#gridImage").hide();
        setTimeout(function(){ 
          $("#actualImage").hide();
          $("#gridImage").show();
        }, 2000);
      },
 
      refresh: function() {
        this.options.isRefresh = true;
        this.options.hintedArray = [];
        this._create()
      },
      
      randomNumberStrGen: function(actualArray) {
        var gridBlock  = this.options.gridType;
        var actStr = [];
        for(var i = 0 ; i < gridBlock ; i++){
          actStr.push(i+1);
        }

        if(actualArray){
          return actStr;
        }
        this.options.actStr = actStr;
        var ranNums = [],
        i = actStr.length,
        j = 0;

        while (i--) {
            j = Math.floor(Math.random() * (i+1));
            ranNums.push(actStr[j]);
            actStr.splice(j,1);
        }
        return ranNums;
      },

      setBlockPosition : function(){
          var gridBlock  = this.options.gridType,
          containerWidth = this.options.container,
          cellPerRowCol = Math.sqrt( gridBlock ),
          block = $('.block '),
          smallBlock = $('.smallBlock '),
          row = 0,
          column = 0, self = this,
          cloneEles = [] ,
          randomNumber = this.randomNumberStrGen();

          block.removeClass("hintBrd");
          
          smallBlock.each(function(i , ele){
              var xPoz = '-' +  ( $(ele).width() * column ) ;
              var yPoz = '-' +  ( $(ele).width() * row ) ;
              
              $(ele).find('.block ').data('indexA' , i+1);
           
              $(ele).find('.block ').css({'background-position' : xPoz+'px ' + yPoz + 'px'});
              column++;
              if(cellPerRowCol == column){
                row++;
                column = 0;
              }
              
              var tmpClone = $(ele)
              
              cloneEles.push(tmpClone);              
              ele.remove();
          });
         
          for(var i=0; i < randomNumber.length ; i++){
            
            $('#gridImage').append( cloneEles[ randomNumber[i]-1 ] );
          }
          block = $('.block ');
          if(this.options.isRefresh){
            this.options.isRefresh = false;
          }

          block.draggable({
            containment: "#gridImage",
            revert: "valid",
            revertDuration: 0,
            stop : function( event, ui) {
              $(this).css({'top' : '' , 'left' : ''});
            }
          });

          block.droppable({
            drop: function( event, ui ) {
              var currEle = $(event.toElement);
              var ele = this;
              if(ele.style.cssText != currEle[0].style.cssText ){
                var eleCss = ele.style.cssText,
                thisCss = currEle[0].style.cssText,
                eleData = $(ele).data('indexA'),
                thisData = currEle.data('indexA');
                
                block.removeClass("hintBrd")

                currEle.data('indexA' , eleData);
                $(ele).data('indexA' , thisData)
                $(currEle[0]).css({'top':'' , 'left' : ''});

                var currBgCSS = $(currEle[0]).css('background-position');
                var eleBgCSS = $( ele ).css('background-position');

                $(currEle[0]).css({'background-position' : eleBgCSS });
                $( ele ).css({'background-position' : currBgCSS });
                                
                matchedFlag = true;
                self._countAndClearImg();
              }

            }
          });
          
      },
      
      _countAndClearImg: function() {
         var actualArray = this.randomNumberStrGen(true),
         currArray = [], self = this,
         block = $('.block ');
         this.options.count++;
         block.each(function(ind , ele){
            $(ele).css({'top' : '' , 'left' : ''});
            currArray.push($(ele).data('indexA'));
         });
         
         $('#moves').text( this.options.count );         
         if( JSON.stringify( actualArray ) == JSON.stringify( currArray ) ){
            
            block.removeClass('hintBrd');
            $("#myModal").modal('show');
         }
      },
      
      _destroy: function() {
        this.changer.remove();
 
      },
 
      _setOptions: function() {
        
      },
 
      _setOption: function( key, value ) {
        
      }
    });
 
    $('#gridImage').GridCreater();
  });