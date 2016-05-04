$(function() {

    $.widget( "custom.GridCreater",{
      options: {
        container : window.innerWidth,
        gridType: 9,
        //size : 30,
        actStr : 0,
        count : 0
      },
      
      // the constructor
      _create: function() {
          var self = $(this.element);
          var gridBlock  = this.options.gridType;
          var containerWidth = this.options.container - 1;
          console.log("containerWidth" , containerWidth)
          var containerCss = {'width': containerWidth +'px', 'height' : containerWidth+'px' , 'background-size' : containerWidth+'px'};
          self.css(containerCss);
          $('#actualImage').css(containerCss);

          
          
          var widthHeight = ( containerWidth/Math.sqrt( gridBlock ) ) - 2;
          var block = '<div class="smallBlock block"></div>';
          
          for(var i=0; i < gridBlock ; i++){
            self.append(block);
          }
          
          $('.smallBlock').css({
            'width': widthHeight +'px', 
            'height' : widthHeight+'px', 
            'background-size' : containerWidth+'px'
           })

          this.setBlockPosition();
          this.options.count = 0;

          self = this;
          $('.restart').click( function(){ self.refresh(); });
          $('.hintBtn').click( function(){ self.hintImage(); });
          $('.showImg').click( function(){ self.showImage(); });
          $('#moves').text( this.options.count );
       
      },

      hintImage : function() {
        
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
        $('.smallBlock').css('pointer-events','');
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
          
          smallBlocks.click(function(){
            var currEle = $(this);
            var matchedFlag = false;
            smallBlocks.removeClass('selectedTile').each(function(ind,ele){
              
              if(ele.style.cssText != currEle[0].style.cssText && $(ele).data('isSelected') == '1'){
                var eleCss = ele.style.cssText,
                thisCss = currEle[0].style.cssText,
                eleData = $(ele).data('indexA'),
                thisData = currEle.data('indexA');
                
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
         console.log(this.options.count)
         
         $('#moves').text( this.options.count );
         
         if( JSON.stringify( actualArray ) == JSON.stringify( currArray ) ){
            smallBlocks.css({'margin': '0px' , 'pointer-events' : 'none'});
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