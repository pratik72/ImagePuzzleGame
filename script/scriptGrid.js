$(function() {

    $.widget( "custom.GridCreater",{
      options: {
        container : 200,
        gridType: 9,
        size : 30,
        actStr : 0,
        y : 0
      },
      
      // the constructor
      _create: function() {
          var self = $(this.element);
          var gridBlock  = this.options.gridType;
          var containerWidth = this.options.container;
          var containerCss = {'width': containerWidth +'px', 'height' : containerWidth+'px'};
          self.css(containerCss);
          $('#actualImage').css(containerCss);
          
          var widthHeight = ( containerWidth/Math.sqrt( gridBlock ) ) -1;
          var block = '<div class="smallBlock block"></div>';
          
          for(var i=0; i < gridBlock ; i++){
            self.append(block);
          }
          
          $('.smallBlock').css({'width': widthHeight +'px', 'height' : widthHeight+'px'})

          this.setBlockPosition();
       
      },
 
      refresh: function() {
        
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
                var eleCss = ele.style.cssText;
                var thisCss = currEle[0].style.cssText;

                var eleData = $(ele).data('indexA');
                var thisData = currEle.data('indexA');

                currEle.data('indexA' , eleData);
                $(ele).data('indexA' , thisData)
                
                currEle[0].style.cssText = eleCss;
                ele.style.cssText = thisCss;
                
                $(ele).removeData('isSelected');
                
                matchedFlag = true;
                self._countAndClearImg();
              }
              
            });
            if(matchedFlag) return;

            currEle.addClass('selectedTile');
            currEle.data('isSelected' , '1');
          })
      },

      _countAndClearImg: function() {
        var actualArray = this.randomNumberStrGen(true),
        currArray = [],
        smallBlocks = $('.smallBlock ');

        smallBlocks.each(function(ind , ele){
          currArray.push($(ele).data('indexA'));
        });

        if( JSON.stringify( actualArray ) == JSON.stringify( currArray ) ){
          smallBlocks.css({'margin': '0px' , 'pointer-events' : 'none'});
          alert("Hurrey , I done it.");
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