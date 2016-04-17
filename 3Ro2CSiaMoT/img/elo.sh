#!/bin/bash

# robi same podwojne/potrojne

convert -flop boom.png boom2.png # ?!
convert -flop machine.png machine2.png
convert -flop triangle.png triangle2.png
convert -flop hole-triangle.png hole-triangle2.png
convert -flop disk.png disk2.png
convert -flop square.png square2.png
convert -flop -flip disk.png disk3.png
convert -flop -flip square.png square3.png
convert -flop hole-triangle.png hole-triangle2.png
convert -flop hole-square.png hole-square2.png
convert -flop hole-disk.png hole-disk2.png
convert -flop -flip hole-square.png hole-square3.png
convert -flop -flip hole-disk.png hole-disk3.png
convert -flop turncock-h.png turncock-h2.png
convert -flip turncock-v.png turncock-v2.png
