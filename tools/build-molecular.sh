# Build molecular for tests.
(
	moleculardir=./molecular;
	testsdir=../molecular-tests;
	libdir=$testsdir/node_modules/molecular;

	cd $moleculardir;
	rm -rf ./build/*
	npm run build && { 
		rm -rf $libdir;
		mkdir $libdir;
		ls | grep -v 'node_modules' | grep -v docs | xargs -I xx cp -avr xx $libdir/;
		touch $libdir/build/renderer.js;
		touch $libdir/build/main.js;
		touch $testsdir/dist/molecular.bundle.js;
		touch $testsdir/src/app/app.module.ts;
	};

)

