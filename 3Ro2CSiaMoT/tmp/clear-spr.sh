#!/bin/bash

NAME=`echo "$1" | cut -d "." -f1`
EXT=`echo "$1" | cut -d "." -f2`

rm $NAME-right.$EXT
rm $NAME-right2.$EXT
rm $NAME-left.$EXT
rm $NAME-left2.$EXT
rm $NAME-up.$EXT
rm $NAME-up2.$EXT
rm $NAME-down.$EXT
rm $NAME-down2.$EXT
