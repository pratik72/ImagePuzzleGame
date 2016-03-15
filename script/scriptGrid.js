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
      
      randomNumberStrGen: function() {
        var gridBlock  = this.options.gridType;
        var actStr = [];
        for(var i = 0 ; i < gridBlock ; i++){
          actStr.push(i+1);
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
          var gridBlock  = this.options.gridType;
          var containerWidth = this.options.container;
          var cellPerRowCol = Math.sqrt( gridBlock );
          
          var row = 0;
          var column = 0;
          var randomNumber = this.randomNumberStrGen();
          
          var cloneEles = [];
          
          $('.smallBlock').each(function(i , ele){
              var offsetVal = $(ele).offset();
              var xPoz = '-' +  ( $(ele).width() * column ) ;
              var yPoz = '-' +  ( $(ele).width() * row ) ;
              
              $(ele).data('indexA' , i+1);
           
              $(ele).css({'background-position-x' : xPoz+'px' , 'background-position-y' : yPoz+'px'});
              column++;
              if(cellPerRowCol == column){
                row++;
                column = 0;
              }
              
              var tmpClone = ele.cloneNode(true)
              cloneEles.push(tmpClone);
              
              //console.log(cloneEles)
              ele.remove();
          });
         
          for(var i=0; i < randomNumber.length ; i++){
            
            $('#gridImage').append( cloneEles[ randomNumber[i]-1 ] );
          }
          
          $('.smallBlock').click(function(){
            var currEle = $(this);
            var asd = false;
            $('.smallBlock').removeClass('selectedTile').each(function(ind,ele){
              console.log(ele , $(ele).data('isSelected'));
              if(ele.style.cssText != currEle[0].style.cssText && $(ele).data('isSelected') == '1'){
                var eleCss = ele.style.cssText;
                var thisCss = currEle[0].style.cssText;
                
                currEle[0].style.cssText = eleCss;
                ele.style.cssText = thisCss;
                
                $(ele).removeData('isSelected');
                
                asd = true;
              }
              
            });
            if(asd) return;
            
            console.log("asee")
            currEle.addClass('selectedTile');
            currEle.data('isSelected' , '1');
          })
          
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
    //$('#blockGen').BlockCreater();

  });