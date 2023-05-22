export const MONOGRAM_H = 12;
export const MONOGRAM_W = 6;

const monogramBitmapObj = {
    "0":[0,0,0,14,17,25,21,19,17,14,0,0],
    "1":[0,0,0,4,6,4,4,4,4,31,0,0],
    "2":[0,0,0,14,17,16,8,4,2,31,0,0],
    "3":[0,0,0,14,17,16,12,16,17,14,0,0],
    "4":[0,0,0,18,18,17,31,16,16,16,0,0],
    "5":[0,0,0,31,1,15,16,16,17,14,0,0],
    "6":[0,0,0,14,1,1,15,17,17,14,0,0],
    "7":[0,0,0,31,16,16,8,4,4,4,0,0],
    "8":[0,0,0,14,17,17,14,17,17,14,0,0],
    "9":[0,0,0,14,17,17,30,16,17,14,0,0],
    "!":[0,0,0,4,4,4,4,4,0,4,0,0],
    "\"":[0,0,0,10,10,10,0,0,0,0,0,0],
    "#":[0,0,0,0,10,31,10,10,31,10,0,0],
    "$":[0,0,0,4,30,5,14,20,15,4,0,0],
    "%":[0,0,0,17,17,8,4,2,17,17,0,0],
    "&":[0,0,0,6,9,9,30,9,9,22,0,0],
    "'":[0,0,0,4,4,4,0,0,0,0,0,0],
    "(":[0,0,0,8,4,4,4,4,4,8,0,0],
    ")":[0,0,0,2,4,4,4,4,4,2,0,0],
    "*":[0,0,0,0,4,21,14,21,4,0,0,0],
    "+":[0,0,0,0,4,4,31,4,4,0,0,0],
    ",":[0,0,0,0,0,0,0,0,4,4,2,0],
    "-":[0,0,0,0,0,0,31,0,0,0,0,0],
    ".":[0,0,0,0,0,0,0,0,4,4,0,0],
    "/":[0,0,0,16,16,8,4,2,1,1,0,0],
    ":":[0,0,0,0,4,4,0,0,4,4,0,0],
    ";":[0,0,0,0,4,4,0,0,4,4,2,0],
    "<":[0,0,0,0,24,6,1,6,24,0,0,0],
    "=":[0,0,0,0,0,31,0,31,0,0,0,0],
    ">":[0,0,0,0,3,12,16,12,3,0,0,0],
    "?":[0,0,0,14,17,16,8,4,0,4,0,0],
    "@":[0,0,0,14,25,21,21,25,1,14,0,0],
    "A":[0,0,0,14,17,17,17,31,17,17,0,0],
    "B":[0,0,0,15,17,17,15,17,17,15,0,0],
    "C":[0,0,0,14,17,1,1,1,17,14,0,0],
    "D":[0,0,0,15,17,17,17,17,17,15,0,0],
    "E":[0,0,0,31,1,1,15,1,1,31,0,0],
    "F":[0,0,0,31,1,1,15,1,1,1,0,0],
    "G":[0,0,0,14,17,1,29,17,17,14,0,0],
    "H":[0,0,0,17,17,17,31,17,17,17,0,0],
    "I":[0,0,0,31,4,4,4,4,4,31,0,0],
    "J":[0,0,0,16,16,16,16,17,17,14,0,0],
    "K":[0,0,0,17,9,5,3,5,9,17,0,0],
    "L":[0,0,0,1,1,1,1,1,1,31,0,0],
    "M":[0,0,0,17,27,21,17,17,17,17,0,0],
    "N":[0,0,0,17,17,19,21,25,17,17,0,0],
    "O":[0,0,0,14,17,17,17,17,17,14,0,0],
    "P":[0,0,0,15,17,17,15,1,1,1,0,0],
    "Q":[0,0,0,14,17,17,17,17,17,14,24,0],
    "R":[0,0,0,15,17,17,15,17,17,17,0,0],
    "S":[0,0,0,14,17,1,14,16,17,14,0,0],
    "T":[0,0,0,31,4,4,4,4,4,4,0,0],
    "U":[0,0,0,17,17,17,17,17,17,14,0,0],
    "V":[0,0,0,17,17,17,17,10,10,4,0,0],
    "W":[0,0,0,17,17,17,17,21,27,17,0,0],
    "X":[0,0,0,17,17,10,4,10,17,17,0,0],
    "Y":[0,0,0,17,17,10,4,4,4,4,0,0],
    "Z":[0,0,0,31,16,8,4,2,1,31,0,0],
    "[":[0,0,0,12,4,4,4,4,4,12,0,0],
    "\\":[0,0,0,1,1,2,4,8,16,16,0,0],
    "]":[0,0,0,6,4,4,4,4,4,6,0,0],
    "^":[0,0,0,4,10,17,0,0,0,0,0,0],
    "_":[0,0,0,0,0,0,0,0,0,31,0,0],
    "`":[0,0,0,2,4,0,0,0,0,0,0,0],
    "a":[0,0,0,0,0,30,17,17,17,30,0,0],
    "b":[0,0,0,1,1,15,17,17,17,15,0,0],
    "c":[0,0,0,0,0,14,17,1,17,14,0,0],
    "d":[0,0,0,16,16,30,17,17,17,30,0,0],
    "e":[0,0,0,0,0,14,17,31,1,14,0,0],
    "f":[0,0,0,12,18,2,15,2,2,2,0,0],
    "g":[0,0,0,0,0,30,17,17,17,30,16,14],
    "h":[0,0,0,1,1,15,17,17,17,17,0,0],
    "i":[0,0,0,4,0,6,4,4,4,31,0,0],
    "j":[0,0,0,16,0,24,16,16,16,16,17,14],
    "k":[0,0,0,1,1,17,9,7,9,17,0,0],
    "l":[0,0,0,3,2,2,2,2,2,28,0,0],
    "m":[0,0,0,0,0,15,21,21,21,21,0,0],
    "n":[0,0,0,0,0,15,17,17,17,17,0,0],
    "o":[0,0,0,0,0,14,17,17,17,14,0,0],
    "p":[0,0,0,0,0,15,17,17,17,15,1,1],
    "q":[0,0,0,0,0,30,17,17,17,30,16,16],
    "r":[0,0,0,0,0,13,19,1,1,1,0,0],
    "s":[0,0,0,0,0,30,1,14,16,15,0,0],
    "t":[0,0,0,2,2,15,2,2,2,28,0,0],
    "u":[0,0,0,0,0,17,17,17,17,30,0,0],
    "v":[0,0,0,0,0,17,17,17,10,4,0,0],
    "w":[0,0,0,0,0,17,17,21,21,10,0,0],
    "x":[0,0,0,0,0,17,10,4,10,17,0,0],
    "y":[0,0,0,0,0,17,17,17,17,30,16,14],
    "z":[0,0,0,0,0,31,8,4,2,31,0,0],
    "{":[0,0,0,8,4,4,2,4,4,8,0,0],
    "|":[0,0,0,4,4,4,4,4,4,4,0,0],
    "}":[0,0,0,2,4,4,8,4,4,2,0,0],
    "~":[0,0,0,0,0,18,13,0,0,0,0,0],
    "¡":[0,0,0,4,0,4,4,4,4,4,0,0],
    "¢":[0,0,0,4,14,21,5,21,14,4,0,0],
    "£":[0,0,0,12,18,2,15,2,2,31,0,0],
    "¤":[0,0,0,0,17,14,10,14,17,0,0,0],
    "¥":[0,0,0,17,10,4,31,4,31,4,0,0],
    "¦":[0,0,0,4,4,4,0,4,4,4,0,0],
    "§":[0,0,0,30,1,14,17,14,16,15,0,0],
    "¨":[0,0,0,10,0,0,0,0,0,0,0,0],
    "©":[0,0,0,14,27,21,29,21,27,14,0,0],
    "ª":[0,0,0,14,9,9,9,14,0,0,0,0],
    "«":[0,0,0,0,0,18,9,18,0,0,0,0],
    "¬":[0,0,0,0,0,0,31,16,0,0,0,0],
    "®":[0,0,0,14,25,21,21,25,21,14,0,0],
    "¯":[0,0,0,0,0,0,31,0,0,0,0,0],
    "°":[0,0,0,6,9,9,6,0,0,0,0,0],
    "±":[0,0,0,4,4,31,4,4,0,31,0,0],
    "²":[0,0,0,3,4,2,1,7,0,0,0,0],
    "³":[0,0,0,3,4,2,4,3,0,0,0,0],
    "´":[0,0,8,4,0,0,0,0,0,0,0,0],
    "µ":[0,0,0,0,0,17,17,17,17,15,1,1],
    "¶":[0,0,0,30,23,23,23,22,20,20,0,0],
    "·":[0,0,0,4,0,0,0,0,0,0,0,0],
    "¸":[0,0,0,0,0,0,0,0,0,4,8,6],
    "¹":[0,0,0,2,3,2,2,7,0,0,0,0],
    "º":[0,0,0,6,9,9,9,6,0,0,0,0],
    "»":[0,0,0,0,0,9,18,9,0,0,0,0],
    "¼":[0,0,0,1,9,5,2,21,28,16,0,0],
    "½":[0,0,0,1,9,5,14,17,8,28,0,0],
    "¾":[0,0,0,7,22,15,4,22,29,16,0,0],
    "¿":[0,0,0,4,0,4,2,1,17,14,0,0],
    "À":[2,4,0,14,17,17,31,17,17,17,0,0],
    "Á":[8,4,0,14,17,17,31,17,17,17,0,0],
    "Â":[4,10,0,14,17,17,31,17,17,17,0,0],
    "Ã":[22,9,0,14,17,17,31,17,17,17,0,0],
    "Ä":[0,10,0,14,17,17,31,17,17,17,0,0],
    "Å":[4,10,4,14,17,17,31,17,17,17,0,0],
    "Æ":[0,0,0,30,5,5,31,5,5,29,0,0],
    "Ç":[0,0,0,14,17,1,1,1,17,14,8,6],
    "È":[2,4,0,31,1,1,15,1,1,31,0,0],
    "É":[8,4,0,31,1,1,15,1,1,31,0,0],
    "Ê":[4,10,0,31,1,1,15,1,1,31,0,0],
    "Ë":[0,10,0,31,1,1,15,1,1,31,0,0],
    "Ì":[2,4,0,31,4,4,4,4,4,31,0,0],
    "Í":[8,4,0,31,4,4,4,4,4,31,0,0],
    "Î":[4,10,0,31,4,4,4,4,4,31,0,0],
    "Ï":[0,10,0,31,4,4,4,4,4,31,0,0],
    "Ð":[0,0,0,15,17,17,19,17,17,15,0,0],
    "Ñ":[22,9,0,17,17,19,21,25,17,17,0,0],
    "Ò":[2,4,0,14,17,17,17,17,17,14,0,0],
    "Ó":[8,4,0,14,17,17,17,17,17,14,0,0],
    "Ô":[4,10,0,14,17,17,17,17,17,14,0,0],
    "Õ":[22,9,0,14,17,17,17,17,17,14,0,0],
    "Ö":[0,10,0,14,17,17,17,17,17,14,0,0],
    "×":[0,0,0,0,0,0,10,4,10,0,0,0],
    "Ø":[0,0,0,22,9,25,21,19,18,13,0,0],
    "Ù":[2,4,0,17,17,17,17,17,17,14,0,0],
    "Ú":[8,4,0,17,17,17,17,17,17,14,0,0],
    "Û":[4,10,0,17,17,17,17,17,17,14,0,0],
    "Ü":[0,10,0,17,17,17,17,17,17,14,0,0],
    "Ý":[8,4,0,17,17,10,4,4,4,4,0,0],
    "Þ":[0,0,0,1,15,17,17,17,15,1,0,0],
    "ß":[0,0,0,6,9,9,13,17,17,13,0,0],
    "à":[0,0,2,4,0,30,17,17,17,30,0,0],
    "á":[0,0,8,4,0,30,17,17,17,30,0,0],
    "â":[0,0,4,10,0,30,17,17,17,30,0,0],
    "ã":[0,0,22,9,0,30,17,17,17,30,0,0],
    "ä":[0,0,0,10,0,30,17,17,17,30,0,0],
    "å":[0,4,10,4,0,30,17,17,17,30,0,0],
    "æ":[0,0,0,0,0,14,21,29,5,30,0,0],
    "ç":[0,0,0,0,0,14,17,1,17,14,8,6],
    "è":[0,0,2,4,0,14,17,31,1,14,0,0],
    "é":[0,0,8,4,0,14,17,31,1,14,0,0],
    "ê":[0,0,4,10,0,14,17,31,1,14,0,0],
    "ë":[0,0,0,10,0,14,17,31,1,14,0,0],
    "ì":[0,0,2,4,0,6,4,4,4,31,0,0],
    "í":[0,0,8,4,0,6,4,4,4,31,0,0],
    "î":[0,0,4,10,0,6,4,4,4,31,0,0],
    "ï":[0,0,0,10,0,6,4,4,4,31,0,0],
    "ð":[0,0,14,48,24,30,17,17,17,14,0,0],
    "ñ":[0,0,22,9,0,15,17,17,17,17,0,0],
    "ò":[0,0,2,4,0,14,17,17,17,14,0,0],
    "ó":[0,0,8,4,0,14,17,17,17,14,0,0],
    "ô":[0,0,4,10,0,14,17,17,17,14,0,0],
    "õ":[0,0,22,9,0,14,17,17,17,14,0,0],
    "ö":[0,0,0,10,0,14,17,17,17,14,0,0],
    "÷":[0,0,0,0,0,4,0,31,0,4,0,0],
    "ø":[0,0,0,0,0,22,9,21,18,13,0,0],
    "ù":[0,0,2,4,0,17,17,17,17,30,0,0],
    "ú":[0,0,8,4,0,17,17,17,17,30,0,0],
    "û":[0,0,4,10,0,17,17,17,17,30,0,0],
    "ü":[0,0,0,10,0,17,17,17,17,30,0,0],
    "ý":[0,0,8,4,0,17,17,17,17,30,16,14],
    "þ":[0,0,0,1,1,15,17,17,17,15,1,1],
    "ÿ":[0,0,0,10,0,17,17,17,17,30,16,14],
    "Ā":[0,14,0,14,17,17,31,17,17,17,0,0],
    "ā":[0,0,0,14,0,30,17,17,17,30,0,0],
    "Ă":[10,4,0,14,17,17,31,17,17,17,0,0],
    "ă":[0,0,10,4,0,30,17,17,17,30,0,0],
    "Ą":[0,0,0,14,17,17,31,17,17,17,8,16],
    "ą":[0,0,0,0,0,30,17,17,17,30,4,24],
    "Ć":[8,4,0,14,17,1,1,1,17,14,0,0],
    "ć":[0,0,8,4,0,14,17,1,17,14,0,0],
    "Ĉ":[4,10,0,14,17,1,1,1,17,14,0,0],
    "ĉ":[0,0,4,10,0,14,17,1,17,14,0,0],
    "Ċ":[0,4,0,14,17,1,1,1,17,14,0,0],
    "ċ":[0,0,0,4,0,14,17,1,17,14,0,0],
    "Č":[10,4,0,14,17,1,1,1,17,14,0,0],
    "č":[0,0,10,4,0,14,17,1,17,14,0,0],
    "Ď":[10,4,0,15,17,17,17,17,17,15,0,0],
    "ď":[0,0,80,80,16,30,17,17,17,30,0,0],
    "Đ":[0,0,0,15,17,17,19,17,17,15,0,0],
    "đ":[0,0,16,60,16,30,17,17,17,30,0,0],
    "Ē":[0,14,0,31,1,1,7,1,1,31,0,0],
    "ē":[0,0,0,14,0,14,17,31,1,14,0,0],
    "Ĕ":[10,4,0,31,1,1,7,1,1,31,0,0],
    "ĕ":[0,0,10,4,0,14,17,31,1,14,0,0],
    "Ė":[0,4,0,31,1,1,7,1,1,31,0,0],
    "ė":[0,0,0,4,0,14,17,31,1,14,0,0],
    "Ę":[0,0,0,31,1,1,7,1,1,31,4,24],
    "ę":[0,0,0,0,0,14,17,31,1,30,4,24],
    "Ě":[0,14,0,31,1,1,7,1,1,31,0,0],
    "ě":[0,0,0,10,0,14,17,31,1,14,0,0],
    "Ĝ":[4,10,0,14,17,1,29,17,17,14,0,0],
    "ĝ":[0,0,4,10,0,30,17,17,17,30,16,14],
    "Ğ":[10,4,0,14,17,1,29,17,17,14,0,0],
    "ğ":[0,0,10,4,0,30,17,17,17,30,16,14],
    "Ġ":[0,4,0,14,17,1,29,17,17,14,0,0],
    "ġ":[0,0,0,4,0,30,17,17,17,30,16,14],
    "Ģ":[0,0,0,14,17,1,29,17,17,14,8,6],
    "ģ":[0,0,8,4,0,30,17,17,17,30,16,14],
    "Ĥ":[4,10,0,17,17,17,31,17,17,17,0,0],
    "ĥ":[0,0,8,21,1,15,17,17,17,17,0,0],
    "Ħ":[0,0,0,17,63,17,31,17,17,17,0,0],
    "ħ":[0,0,0,1,3,1,15,17,17,17,0,0],
    "Ĩ":[22,9,0,31,4,4,4,4,4,31,0,0],
    "ĩ":[0,0,22,9,0,6,4,4,4,31,0,0],
    "Ī":[0,14,0,31,4,4,4,4,4,31,0,0],
    "ī":[0,0,0,14,0,6,4,4,4,31,0,0],
    "Ĭ":[10,4,0,31,4,4,4,4,4,31,0,0],
    "ĭ":[0,0,10,4,0,6,4,4,4,31,0,0],
    "Į":[0,0,0,31,4,4,4,4,4,31,4,24],
    "į":[0,0,0,4,0,6,4,4,4,31,4,24],
    "İ":[22,9,0,31,4,4,4,4,4,31,0,0],
    "ı":[0,0,0,0,0,6,4,4,4,31,0,0],
    "Ĳ":[0,0,0,23,18,18,18,18,18,15,0,0],
    "ĳ":[0,0,0,18,0,27,18,18,18,31,16,14],
    "Ĵ":[4,10,0,16,16,16,16,17,17,14,0,0],
    "ĵ":[0,0,16,40,0,24,16,16,16,16,17,14],
    "Ķ":[0,0,0,17,9,5,3,5,9,17,4,4],
    "ķ":[0,0,0,1,1,17,9,7,9,17,4,4],
    "ĸ":[0,0,0,0,0,17,9,7,9,17,0,0],
    "Ĺ":[8,4,0,1,1,1,1,1,1,31,0,0],
    "ĺ":[8,4,0,31,4,4,4,4,4,31,0,0],
    "Ļ":[0,0,0,1,1,1,1,1,1,31,8,6],
    "ļ":[0,0,0,31,4,4,4,4,4,31,8,6],
    "Ľ":[0,0,0,17,17,9,1,1,1,31,0,0],
    "ľ":[0,0,0,19,18,10,2,2,2,28,0,0],
    "Ŀ":[0,0,0,1,1,1,9,1,1,31,0,0],
    "ŀ":[0,0,0,3,2,2,10,2,2,28,0,0],
    "Ł":[0,0,0,1,1,1,3,1,1,31,0,0],
    "ł":[0,0,0,3,2,2,6,3,2,28,0,0],
    "Ń":[8,4,0,17,17,19,21,25,17,17,0,0],
    "ń":[0,0,8,4,0,15,17,17,17,17,0,0],
    "Ņ":[0,0,0,17,17,19,21,25,17,17,4,3],
    "ņ":[0,0,0,0,0,15,17,17,17,17,4,3],
    "Ň":[10,4,0,17,17,19,21,25,17,17,0,0],
    "ň":[0,0,10,4,0,15,17,17,17,17,0,0],
    "ŉ":[0,0,0,0,0,15,17,17,17,17,0,0],
    "Ŋ":[0,0,0,17,17,19,21,25,17,17,16,12],
    "ŋ":[0,0,0,0,0,15,17,17,17,17,16,12],
    "Ō":[0,14,0,14,17,17,17,17,17,14,0,0],
    "ō":[0,0,0,14,0,14,17,17,17,14,0,0],
    "Ŏ":[10,4,0,14,17,17,17,17,17,14,0,0],
    "ŏ":[0,0,10,4,0,14,17,17,17,14,0,0],
    "Ő":[20,10,0,14,17,17,17,17,17,14,0,0],
    "ő":[0,0,20,10,0,14,17,17,17,14,0,0],
    "Œ":[0,0,0,30,5,5,29,5,5,30,0,0],
    "œ":[0,0,0,0,0,14,21,29,5,14,0,0],
    "Ŕ":[8,4,0,15,17,17,15,17,17,17,0,0],
    "ŕ":[0,0,8,4,0,13,19,1,1,1,0,0],
    "Ŗ":[0,0,0,15,17,17,15,17,17,17,4,3],
    "ŗ":[0,0,0,0,0,13,19,1,1,1,4,3],
    "Ř":[10,4,0,15,17,17,15,17,17,17,0,0],
    "ř":[0,0,10,4,0,13,19,1,1,1,0,0],
    "Ś":[8,4,0,14,17,1,14,16,17,14,0,0],
    "ś":[0,0,8,4,0,30,1,14,16,15,0,0],
    "Ŝ":[4,10,0,14,17,1,14,16,17,14,0,0],
    "ŝ":[0,0,4,10,0,30,1,14,16,15,0,0],
    "Ş":[0,0,0,14,17,1,14,16,17,14,4,3],
    "ş":[0,0,0,0,0,30,1,14,16,15,4,3],
    "Š":[10,4,0,14,17,1,14,16,17,14,0,0],
    "š":[0,0,10,4,0,30,1,14,16,15,0,0],
    "Ţ":[0,0,0,31,4,4,4,4,4,4,4,3],
    "ţ":[0,0,0,2,2,15,2,2,2,28,8,6],
    "Ť":[10,4,0,31,4,4,4,4,4,4,0,0],
    "ť":[0,0,8,10,2,15,2,2,2,28,0,0],
    "Ŧ":[0,0,0,31,4,14,4,4,4,4,0,0],
    "ŧ":[0,0,0,2,15,2,15,2,2,28,0,0],
    "Ũ":[22,9,0,17,17,17,17,17,17,14,0,0],
    "ũ":[0,0,22,9,0,17,17,17,17,30,0,0],
    "Ū":[0,14,0,17,17,17,17,17,17,14,0,0],
    "ū":[0,0,0,14,0,17,17,17,17,30,0,0],
    "Ŭ":[10,4,0,17,17,17,17,17,17,14,0,0],
    "ŭ":[0,0,10,4,0,17,17,17,17,30,0,0],
    "Ů":[10,4,0,17,17,17,17,17,17,14,0,0],
    "ů":[0,4,10,4,0,17,17,17,17,30,0,0],
    "Ű":[20,10,0,17,17,17,17,17,17,14,0,0],
    "ű":[0,0,20,10,0,17,17,17,17,30,0,0],
    "Ų":[0,0,0,17,17,17,17,17,17,14,4,24],
    "ų":[0,0,0,0,0,17,17,17,17,30,4,24],
    "Ŵ":[4,10,0,17,17,17,17,21,27,17,0,0],
    "ŵ":[0,0,4,10,0,17,17,21,21,10,0,0],
    "Ŷ":[4,10,0,17,17,10,4,4,4,4,0,0],
    "ŷ":[0,0,4,10,0,17,17,17,17,30,16,14],
    "Ÿ":[0,10,0,17,17,10,4,4,4,4,0,0],
    "Ź":[8,4,0,31,16,8,4,2,1,31,0,0],
    "ź":[0,0,8,4,0,31,8,4,2,31,0,0],
    "Ż":[0,4,0,31,16,8,4,2,1,31,0,0],
    "ż":[0,0,0,4,0,31,8,4,2,31,0,0],
    "Ž":[10,4,0,31,16,8,4,2,1,31,0,0],
    "ž":[0,0,10,4,0,31,8,4,2,31,0,0],
    "Ё":[0,10,0,31,1,1,15,1,1,31,0,0],
    "А":[0,0,0,14,17,17,17,31,17,17,0,0],
    "Б":[0,0,0,31,1,1,15,17,17,15,0,0],
    "В":[0,0,0,15,17,17,15,17,17,15,0,0],
    "Г":[0,0,0,31,1,1,1,1,1,1,0,0],
    "Д":[0,0,0,12,10,10,10,10,10,31,17,0],
    "Е":[0,0,0,31,1,1,15,1,1,31,0,0],
    "Ж":[0,0,0,21,21,21,14,21,21,21,0,0],
    "З":[0,0,0,14,17,16,14,16,17,14,0,0],
    "И":[0,0,0,17,17,25,21,19,17,17,0,0],
    "Й":[0,10,4,17,17,25,21,19,17,17,0,0],
    "К":[0,0,0,25,5,5,3,5,9,17,0,0],
    "Л":[0,0,0,30,18,18,18,18,18,17,0,0],
    "М":[0,0,0,17,27,21,17,17,17,17,0,0],
    "Н":[0,0,0,17,17,17,31,17,17,17,0,0],
    "О":[0,0,0,14,17,17,17,17,17,14,0,0],
    "П":[0,0,0,31,17,17,17,17,17,17,0,0],
    "Р":[0,0,0,15,17,17,15,1,1,1,0,0],
    "С":[0,0,0,14,17,1,1,1,17,14,0,0],
    "Т":[0,0,0,31,4,4,4,4,4,4,0,0],
    "У":[0,0,0,17,17,17,17,30,16,14,0,0],
    "Ф":[0,0,0,4,14,21,21,21,14,4,0,0],
    "Х":[0,0,0,17,17,10,4,10,17,17,0,0],
    "Ц":[0,0,0,0,9,9,9,9,9,31,16,0],
    "Ч":[0,0,0,17,17,17,30,16,16,16,0,0],
    "Ш":[0,0,0,21,21,21,21,21,21,31,0,0],
    "Щ":[0,0,0,21,21,21,21,21,21,31,16,0],
    "Ъ":[0,0,0,0,3,2,14,18,18,14,0,0],
    "Ы":[0,0,0,0,17,17,19,21,21,19,0,0],
    "Ь":[0,0,0,0,1,1,15,17,17,15,0,0],
    "Э":[0,0,0,14,17,16,28,16,17,14,0,0],
    "Ю":[0,0,0,9,21,21,23,21,21,9,0,0],
    "Я":[0,0,0,0,30,17,17,30,17,17,0,0],
    "а":[0,0,0,0,0,14,16,30,17,30,0,0],
    "б":[0,0,0,30,1,13,19,17,17,14,0,0],
    "в":[0,0,0,0,0,15,17,15,17,15,0,0],
    "г":[0,0,0,0,0,31,1,1,1,1,0,0],
    "д":[0,0,0,0,0,12,10,10,10,31,17,0],
    "е":[0,0,0,0,0,14,17,31,1,14,0,0],
    "ж":[0,0,0,0,0,21,14,4,14,21,0,0],
    "з":[0,0,0,0,0,6,9,4,9,6,0,0],
    "и":[0,0,0,0,0,17,25,21,19,17,0,0],
    "й":[0,0,0,10,4,17,25,21,19,17,0,0],
    "к":[0,0,0,0,0,17,9,7,9,17,0,0],
    "л":[0,0,0,0,0,30,18,18,18,17,0,0],
    "м":[0,0,0,0,0,17,27,21,17,17,0,0],
    "н":[0,0,0,0,0,17,17,31,17,17,0,0],
    "о":[0,0,0,0,0,14,17,17,17,14,0,0],
    "п":[0,0,0,0,0,31,17,17,17,17,0,0],
    "р":[0,0,0,0,0,13,19,17,17,15,1,1],
    "с":[0,0,0,0,0,14,17,1,17,14,0,0],
    "т":[0,0,0,0,0,31,4,4,4,4,0,0],
    "у":[0,0,0,0,0,17,17,17,17,30,16,14],
    "ф":[0,0,0,4,4,14,21,21,21,14,4,4],
    "х":[0,0,0,0,0,17,10,4,10,17,0,0],
    "ц":[0,0,0,0,0,9,9,9,9,31,16,0],
    "ч":[0,0,0,0,0,17,17,17,30,16,0,0],
    "ш":[0,0,0,0,0,21,21,21,21,31,0,0],
    "щ":[0,0,0,0,0,21,21,21,21,31,16,0],
    "ъ":[0,0,0,0,0,3,2,14,18,14,0,0],
    "ы":[0,0,0,0,0,17,17,19,21,19,0,0],
    "ь":[0,0,0,0,0,1,1,15,17,15,0,0],
    "э":[0,0,0,0,0,14,17,28,17,14,0,0],
    "ю":[0,0,0,0,0,9,21,23,21,9,0,0],
    "я":[0,0,0,0,0,30,17,17,30,17,0,0],
    "ё":[0,0,0,10,0,14,17,31,1,14,0,0],
    "—":[0,0,0,0,0,0,31,0,0,0,0,0],
    "’":[0,0,0,8,4,0,0,0,0,0,0,0],
    "…":[0,0,0,0,0,0,0,0,21,21,0,0],
    "€":[0,0,0,12,18,7,2,7,18,12,0,0],
    "←":[0,0,0,0,0,4,30,31,30,4,0,0],
    "↑":[0,0,0,0,0,4,14,31,14,14,0,0],
    "→":[0,0,0,0,0,4,15,31,15,4,0,0],
    "↓":[0,0,0,0,0,14,14,31,14,4,0,0],
    " ":[0,0,0,0,0,0,0,0,0,0,0,0]
    }

let monomap : Map<string, number[]> = new Map<string, number[]>();
Object.entries(monogramBitmapObj).map(
    ([k, v], i) => monomap.set(k as string, v as number[])
  );
export const monogramBitmap : Map<string, number[]> = monomap;
