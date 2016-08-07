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
          
          var containerWidth = this.options.container - 10;
  
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
          var block = '<div class="smallBlock block"></div>';
          
          for(var i=0; i < gridBlock ; i++){
            self.append(block);
          }

          backButton.click(function() {
            self.backToDashboard();
          })
          
          $('.smallBlock').css({
            'width': widthHeight +'px', 
            'height' : widthHeight+'px', 
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
            dummyArray = this.options.hintedArray;

        $(allBlock).removeClass("hintBrd");
        for (var k = 0; k < gridType; k++) {
          actualArray = k;
          for (var i = 0; i < allBlock.length; i++) {
            var blStr = $(allBlock[i]).data('indexA') -1;
            
            if( allBlock[i] != allBlock[ actualArray ] && dummyArray.indexOf(blStr) == -1 && blStr == actualArray){
              dummyArray.push(blStr);
              $(allBlock[i]).addClass("hintBrd");
              $(allBlock[ actualArray ]).addClass("hintBrd");
              isMatch = true
              break
            }
          };
          if(isMatch){
            break;
          }
        };
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
          smallBlocks = $('.smallBlock '),
          row = 0,
          column = 0, self = this,
          cloneEles = [] ,
          randomNumber = this.randomNumberStrGen();

          smallBlocks.removeClass("hintBrd");
          
          smallBlocks.each(function(i , ele){
              var offsetVal = $(ele).offset();
              var xPoz = '-' +  ( $(ele).width() * column ) ;
              var yPoz = '-' +  ( $(ele).width() * row ) ;
              
              $(ele).data('indexA' , i+1);
           
              $(ele).css({'background-position' : xPoz+'px ' + yPoz + 'px'});
              column++;
              if(cellPerRowCol == column){
                row++;
                column = 0;
              }
              
              var tmpClone = $(ele).clone(true);
              cloneEles.push(tmpClone);
              
              ele.remove();
          });
         
          for(var i=0; i < randomNumber.length ; i++){
            
            $('#gridImage').append( cloneEles[ randomNumber[i]-1 ] );
          }
          smallBlocks = $('.smallBlock ');
          if(this.options.isRefresh){
            //return;
            this.options.isRefresh = false;
            $('.smallBlock').css('pointer-events','');
            $( smallBlocks ).unbind( "click" );
          }

          
          smallBlocks.click(function(){
            var currEle = $(this);
            var matchedFlag = false;
            //var hintBrd = $(".hintBrd");
            smallBlocks.removeClass('selectedTile').each(function(ind,ele){

              if(ele.style.cssText != currEle[0].style.cssText && $(ele).data('isSelected') == '1'){
                var eleCss = ele.style.cssText,
                thisCss = currEle[0].style.cssText,
                eleData = $(ele).data('indexA'),
                thisData = currEle.data('indexA');
                
                $(ele).removeClass("hintBrd")

                currEle.data('indexA' , eleData);
                $(ele).data('indexA' , thisData)
               
                currEle[0].style.cssText = eleCss;
                ele.style.cssText = thisCss;
                
                $(ele).removeData('isSelected');
                
                matchedFlag = true;
                self._countAndClearImg();
              }
              
            });
            if( currEle.data('isSelected') == '1' ){
              $(currEle).removeData('isSelected');
              matchedFlag = true;
            };
            if(matchedFlag) return;
            
            currEle.addClass('selectedTile');
            currEle.data('isSelected' , '1');
          })
          
      },
      
      _countAndClearImg: function() {
         var actualArray = this.randomNumberStrGen(true),
         currArray = [], self = this,
         smallBlocks = $('.smallBlock ');
         this.options.count++;
         smallBlocks.each(function(ind , ele){
            currArray.push($(ele).data('indexA'));
         });
         
         $('#moves').text( this.options.count );
         
         if( JSON.stringify( actualArray ) == JSON.stringify( currArray ) ){
            smallBlocks.css({'margin': '0px' , 'pointer-events' : 'none'});
            smallBlocks.removeClass('hintBrd');
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