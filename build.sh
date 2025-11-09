#!/bin/zsh

if [ $# = 1 ]
then 3=$1; 2=$1/source; 1=$2/template.html
else if [ $# -lt 3 ]; then echo insufficient number of arguments; exit 1; fi
fi

mark="<!-- ... -->"

for source in $2/*
do
	if [ ! $source = $1 ]
	then
		target=$3${source#$2}
		if [[ (! -f $target) || $source -nt $target || $1 -nt $target ]]
		then
			sed "/$mark/{
				s/$mark//
				r $source
			}" $1 > $target
			echo built $target
		fi
	fi
done