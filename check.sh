#!/bin/bash

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games

cd `dirname $0`

proc_num=`ps -ef | grep node | grep -v grep | wc -l`
if [ $proc_num -eq 0 ]
then
	./start.sh
fi
