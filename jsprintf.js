
var sprintf = function(fmt, args){
    var result = "";
    var argAt = 1;
    for(var i = 0; i < fmt.length; i++){
        var c = fmt.charAt(i);
        if(c == "%"){
            //seek to the specifier
            var specifier;
            var sPosition = i+1;
            for(sPosition; sPosition < fmt.length; sPosition++){
                var s = fmt.charAt(sPosition);
                if(sprintf.specifiers[s] !== undefined){
                    specifier = s;
                    break;
                }
            }
            if(specifier === undefined) continue;
            var str = fmt.substring(i+1,sPosition);
            var p = 0;
            var width="";
            var precision="";
            var flags = 0;
            //Scan for flags
            for(p = 0; p < str.length; p++){
                var flagChar = str.charAt(p);
                if(flagChar == '-')
                    flags |= sprintf.flags.LEFT_JUSTIFY;
                else if(flagChar == '+')
                    flags |= sprintf.flags.SHOW_SIGN;
                else if(flagChar == ' ')
                    flags |= sprintf.flags.SPACE;
                else if(flagChar == '#')
                    flags |= sprintf.flags.PREFIX|sprintf.flags.SUFFIX;
                else
                    break;
            }
            //Read the width
            for(; p < str.length; p++){
                var wChar = str.charAt(p);
                if(wChar == '.') break;
                if(wChar == '*'){width = arguments[argAt++]; break;}
                width += wChar;
            }
            width = Math.round(width);
            
            //read the precision
            //make sure that p is at a precision marker
            for(; p < str.length; p++){
                if(str.charAt(p)=='.')break;
            }
            p++;
            for(; p < str.length; p++){
                precision += str.charAt(p);
            }
            precision = Math.round(precision);
            
            var param = arguments[argAt++];
            result += sprintf.specifiers[specifier](param, {"flags": flags, "width": width, "precision": precision});
            i=sPosition;
        }else
            result += c;
    }
    return result;
};
sprintf.pad = function(str, amount, char, left){
    left = left || false;
    str = str + "";
    char = (char|| " ").charAt(0);
    amount = parseInt(amount,10) || 0;
    
    var pad = "";
    for(var i = 0; i < amount - str.length; i++){
        pad += char;
    }
    return left?str+pad:pad+str;
};
sprintf.lpad = function(str, amount, char){
    return sprintf.pad(str, amount, char, true);
};
sprintf.rpad = sprintf.pad;
sprintf.specifiers = 
    {'s': function(arg, properties){
         properties = properties || {flags: 0, width: 0, precision: 0};
        var result = arg+"";
        result = sprintf.pad(result, 
                             properties.width, 
                             (properties.flags & sprintf.flags.SPACE) ? ' ':'0', 
                             properties.flags & sprintf.flags.LEFT_JUSTIFY);
        return result;
    },
     'x': function(arg, properties){
         properties = properties || {flags: 0, width: 0, precision: 0};
         var result = parseInt(arg,10).toString(16);
         if(properties.flags & sprintf.flags.PREFIX)
            result = "0x"+result;
         return result;
     },
     'X': function(arg, properties){
         properties = properties || {flags: 0, width: 0, precision: 0};
         var result = parseInt(arg,10).toString(16);
         if(properties.flags & sprintf.flags.PREFIX)
            result = "0x"+result;
         return result.toUpperCase();
     },
     'd': function(arg, properties){
         var result = parseInt(arg,10);
         properties = properties || {flags: 0, width: 0, precision: 0};
         
         if(properties.flags & sprintf.flags.SHOW_SIGN)
            result = (result<0?'-':'+') + result;
            
          result = sprintf.pad(result, 
                               properties.width, 
                               (properties.flags & sprintf.flags.SPACE) ? ' ':'0', 
                               properties.flags & sprintf.flags.LEFT_JUSTIFY);
                               
         return result;
    },
     'f': function(arg, properties){
         var result = parseFloat(arg);
         properties = properties || {flags: 0, width: 0, precision: 0};
         if(properties.flags & sprintf.flags.SHOW_SIGN)
            result = (result<0?'-':'+') + result;
         if(properties.flags & sprintf.flags.SUFFIX)
            result+='.';
         result = sprintf.pad(result, 
                              properties.width, 
                              (properties.flags & sprintf.flags.SPACE) ? ' ':'0', 
                              properties.flags & sprintf.flags.LEFT_JUSTIFY);
         return result;
    },
     '%': function(arg, properties){return '%';},
    };
sprintf.flags = {
    LEFT_JUSTIFY: 1<<0,
    SHOW_SIGN: 1<<1,
    SPACE: 1<<2,
    SPAAAAAACE: 1<<2,
    SPAAAAAAAAAAAAACE: 1<<2,
    SUFFIX: 1<<3,
    PREFIX: 1<<4,
    LEFTPAD: 1<<5
};

//console.log(sprintf("%*s", 10,"POOOP"));;